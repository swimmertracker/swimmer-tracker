from flask import Flask, jsonify, request, session
from config import ApplicationConfig
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from wtforms.validators import ValidationError
from flask_bcrypt import Bcrypt
from models import db, User, TrainingSession, Swimmer
from flask_session import Session


app = Flask(__name__)
app.config.from_object(ApplicationConfig)
CORS(app, supports_credentials=True)

db.init_app(app)
ma = Marshmallow(app)
bcrypt = Bcrypt(app)
server_session = Session(app)

with app.app_context():
    db.create_all()


class SessionSchema(ma.Schema):
    class Meta:
        fields = (
            "session_id",
            "swimmer_id",
            "coach_id",
            "session_date",
            "session_time",
            "distance",
            "stroke_rate",
            "duration",
            "swim_duration",
            "intensity_factor",
            "sss",
        )


class UserSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "email", "date_added", "role")


user_schema = UserSchema()
users_schema = UserSchema(many=True)

session_schema = SessionSchema()
sessions_schema = SessionSchema(many=True)


@app.route("/users/<id>/", methods=["GET"])
def get_user(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)


@app.route("/users", methods=["PUT"])
def update_user():
    user_id = request.json["id"]
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "Incorrect email, not a registered user"}), 412

    if user.password != request.json["password"]:
        return jsonify({"error": "Incorrect password, cannot update details"}), 403

    user.name = request.json["name"]
    user.email = request.json["email"]

    db.session.commit()
    return user_schema.jsonify(user)


@app.route("/users/<id>/", methods=["DELETE"])
def delete_user():
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return user_schema.jsonify(user)


@app.route("/users", methods=["POST"])
def register_user():
    name = request.json["name"]
    email = request.json["email"]
    password = request.json["password"]
    user_exists = User.query.filter_by(email=email).first() is not None
    role = "Coach"
    if not request.json["coachCheck"]:
        role = "Swimmer"

    coach_email = None

    if "coach_email" in request.json:
        coach_email = request.json["coach_email"]

    if user_exists:
        return jsonify({"error": "User with this email already exists"}), 409

    coach_id = None
    hashed_password = bcrypt.generate_password_hash(password)
    coach = User.query.filter_by(email=coach_email).first()

    if role == "Swimmer":
        if not coach or coach.role != "Coach":
            return jsonify({"error": "That is not a registered coach"}), 412
        else:
            print(coach.id)
            print(coach.role)
            coach_id = coach.id

    user = User(name, email, hashed_password, role)

    db.session.add(user)
    db.session.commit()
    db.session.flush()

    if role == "Swimmer":
        user_id = User.query.filter_by(email=email).first().id
        swimmer = Swimmer(user_id, coach_id, 1)
        db.session.add(swimmer)
        db.session.commit()

    return user_schema.jsonify(user)


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "User not found"}), 404

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401

    session["user_id"] = user.id

    return user_schema.jsonify(user)


@app.route("/logout", methods=["GET"])
def logout():
    session["user_id"] = None
    return "200"


@app.route("/me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()

    return user_schema.jsonify(user)


@app.route("/sessions/<session_id>", methods=["GET"])
def get_sessions(session_id=None):
    if session_id == None:
        all_sessions = TrainingSession.query.all()
        results = sessions_schema.dump(all_sessions)
        return jsonify(results)
    else:
        train_session = TrainingSession.query.get(session_id)
        return session_schema.jsonify(train_session)


@app.route("/sessions/<session_id>", methods=["DELETE"])
def delete_session(session_id):
    train_session = TrainingSession.query.get(session_id)
    db.session.delete(train_session)
    db.session.commit()
    return session_schema.jsonify(train_session)


@app.route("/users/sessions/<user_id>", methods=["GET"])
def get_session_by_user_id(user_id):
    user = User.query.get(user_id)

    if user.role == "Swimmer":
        train_sessions = TrainingSession.query.filter_by(swimmer_id=user_id)
        print(train_sessions)
    else:
        train_sessions = TrainingSession.query.filter_by(coach_id=user_id)

    return sessions_schema.jsonify(train_sessions)


@app.route("/sessions/<session_id>", methods=["PUT"])
def update_sessions(session_id):
    train_session = TrainingSession.query.get(session_id)
    FTT = User.query.get(train_session.swimmer_id).FTT
    coach_id = Swimmer.query.filter_by(
        swimmer_user_id=train_session.user_id
    ).coach_user_id

    session_date = (
        request.json["session_date"]
        if request.json["session_date"]
        else train_session.session_date
    )
    swimmer_id = (
        request.json["swimmer_id"]
        if request.json["swimmer_id"]
        else train_session.swimmer_id
    )
    stroke_rate = (
        request.json["stroke_rate"]
        if request.json["stroke_rate"]
        else train_session.stroke_rate
    )
    duration = (
        request.json["duration"] if request.json["duration"] else train_session.duration
    )
    swim_duration = (
        request.json["swim_duration"]
        if request.json["swim_duration"]
        else train_session.swim_duration
    )
    distance = (
        request.json["distance"] if request.json["distance"] else train_session.distance
    )

    train_session.swimmer_id = swimmer_id
    train_session.coach_id = coach_id
    train_session.session_date = session_date
    train_session.distance = distance
    train_session.stroke_rate = stroke_rate
    train_session.duration = duration
    train_session.intensity_factor = (stroke_rate / 0.335) / (
        distance * 60 / swim_duration
    )
    train_session.sss = duration * train_session.intensity_factor * 3.75

    # Alt calcs
    # train_session.intensity_factor = (distance / swim_duration) / FTT
    # train_session.sss = train_session.calculate_sss(
    #     duration, stroke_rate, FTT, swim_duration
    # )
    db.session.commit()

    return session_schema.jsonify(train_session)


@app.route("/sessions", methods=["POST"])
def add_session():
    swimmer_id = request.json["swimmer_id"]
    FTT = Swimmer.query.filter_by(swimmer_user_id=swimmer_id).first().FTT
    coach_id = Swimmer.query.filter_by(swimmer_user_id=swimmer_id).first().coach_user_id

    session_date = request.json["session_date"]
    session_time = request.json["session_time"]
    stroke_rate = request.json["stroke_rate"]
    duration = request.json["duration"]
    swim_duration = request.json["swim_duration"]
    distance = request.json["distance"]

    train_session = TrainingSession(
        session_date,
        session_time,
        swimmer_id,
        coach_id,
        distance,
        stroke_rate,
        duration,
        swim_duration,
        FTT,
    )
    db.session.add(train_session)
    db.session.commit()
    return session_schema.jsonify(train_session)


if __name__ == "__main__":
    app.run(debug=True)
