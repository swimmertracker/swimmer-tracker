import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Menu, Radio } from "antd";
import { UserOutlined, UserAddOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { user_id_atom } from "../atoms";
import Logout from "./Logout";

const items = [
  {
    key: "login",
    icon: <UserOutlined />,
  },
  {
    key: "register",
    icon: <UserAddOutlined />,
  },
];

const AccountModal = () => {
  const [current, setCurrent] = useState("login");
  const [userID, setUserID] = useRecoilState(user_id_atom);
  const onChange = (e) => {
    setCurrent(e.target.value);
  };

  const getContent = () => {
    const pages = {
      login: <Login />,
      register: <Register />,
    };
    if (userID != null) {
      return <Logout />;
    } else {
      return (
        <div>
          <Radio.Group defaultValue={"login"} onChange={onChange} centered>
            <Radio.Button value={"login"}>
              <UserOutlined />
            </Radio.Button>
            <Radio.Button value={"register"}>
              <UserAddOutlined />
            </Radio.Button>
          </Radio.Group>
          {pages[[current]]}
        </div>
      );
    }
  };
  return <div>{getContent()}</div>;
};

export default AccountModal;
