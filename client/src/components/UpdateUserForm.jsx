import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Card,
} from "antd";
import { useState, React, useEffect } from "react";
import * as api from "../ApiCalls";
import { useRecoilState } from "recoil";
import { user_id_atom } from "../atoms";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const UpdateUserForm = ({ onSubmit = (values) => {} }) => {
  const [coach, setCoach] = useState(false);
  const [userID, setUserID] = useRecoilState(user_id_atom);
  const [data, setData] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      const dataRes = await api.getUserInfo(userID);
      console.log("UserID", userID);
      setData(dataRes);
    })();
  }, []);

  const onLoad = () => {
    form.setFieldsValue({
      email: data.email,
      name: data.name,
      coach_email: data.coach_email,
    });
  };

  return (
    <Card>
      <Form
        form={form}
        {...formItemLayout}
        name="updateUser"
        onFinish={onSubmit}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="name"
          label="Name and Surname"
          tooltip="Your full name and surname"
          rules={[
            {
              required: true,
              message: "Please input your username!",
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="coach_email"
          label="Coach email"
          tooltip="The email address that your coach used to register."
          rules={[
            {
              required: !coach,
              message: "Please enter your coach's email address!",
              whitespace: true,
            },
          ]}
        >
          <Input disabled={coach} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
          <Button htmlType="button" onClick={onLoad}>
            Load current values
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
export default UpdateUserForm;
