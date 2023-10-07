import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Form, Input } from "antd";
import * as api from "../ApiCalls";
import { useRecoilState } from "recoil";
import { account_modal_atom, is_coach_atom, user_id_atom } from "../atoms";

const Login = () => {
  const [userID, setUserID] = useRecoilState(user_id_atom);
  const [isCoach, setIsCoach] = useRecoilState(is_coach_atom);
  const [accountModal, setAccountModal] = useRecoilState(account_modal_atom);
  const logInUser = async (values) => {
    var res = await api.login(JSON.stringify(values));
    if (res.status == 200) {
      // alert("Logged In!");
      var userInfo = await api.getUserInfo();
      setUserID(userInfo.id);
      var data = await api.loadUserSessions("b778cfa8df684611bcf041feecaaaf07");
      if (userInfo.role == "Coach") {
        setIsCoach(true);
      }
      setAccountModal(false);
    } else if (res.status === 401) {
      alert("Invalid credentials");
    } else if (res.status === 404) {
      alert("User not found");
    }
  };

  return (
    <div style={{ margin: "auto" }}>
      <Card>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={logInUser}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email address!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default Login;
