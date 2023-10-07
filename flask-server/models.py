from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship


def get_uuid():
    return uuid4().hex


db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = mapped_column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name, email, password, role):
        self.name = name
        self.email = email
        self.password = password
        self.role = role


class Swimmer(db.Model):
    __tablename__ = "swimmers"

    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    swimmer_user_id = mapped_column(ForeignKey("users.id"))
    coach_user_id = mapped_column(ForeignKey("users.id"))
    FTT = db.Column(db.Integer, nullable=True)

    swimmer_user = relationship("User", foreign_keys=[swimmer_user_id])
    coach_user = relationship("User", foreign_keys=[coach_user_id])

    def __init__(self, swimmer_id, coach_id, FTT):
        self.swimmer_user_id = swimmer_id
        self.coach_user_id = coach_id
        self.FTT = FTT


class TrainingSession(db.Model):
    __tablename__ = "sessions"

    # Metadata
    session_id = db.Column(
        db.String(32), primary_key=True, unique=True, default=get_uuid
    )
    swimmer_id = db.Column(db.String(32), nullable=False)
    coach_id = db.Column(db.String(32), nullable=False)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)

    # Session data

    session_date = db.Column(db.Date, nullable=False)
    session_time = db.Column(db.Time, nullable=False)
    distance = db.Column(db.Integer, nullable=False)
    stroke_rate = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    swim_duration = db.Column(db.Integer, nullable=False)

    # Calculated factors
    intensity_factor = db.Column(db.Float)
    sss = db.Column(db.Float)

    def __init__(
        self,
        session_date,
        session_time,
        swimmer_id,
        coach_id,
        distance,
        stroke_rate,
        duration,
        swim_duration,
        FTT,
    ):
        self.swimmer_id = swimmer_id
        self.coach_id = coach_id

        self.session_date = session_date
        self.session_time = session_time
        self.distance = distance
        self.stroke_rate = stroke_rate
        self.duration = duration
        self.swim_duration = swim_duration

        self.intensity_factor = round(
            (stroke_rate / 0.335) / (distance * 60 / swim_duration), 2
        )
        self.sss = round(duration * self.intensity_factor * 3.75, 2)

        # Alt calcs
        # self.intensity_factor = (distance / swim_duration) / FTT
        # self.sss = self.calculate_sss(duration, stroke_rate, FTT, swim_duration)

    def calculate_sss(duration, stroke_rate, FTT, swim_duration):
        return (duration * duration * stroke_rate * 117) / (FTT * swim_duration * 6)
