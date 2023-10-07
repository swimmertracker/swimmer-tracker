import React from "react";
import { Button, Card } from "antd";
import { account_modal_atom } from "../atoms";
import { useRecoilState } from "recoil";

const LoggedOut = () => {
  const [accountModal, setAccountModal] = useRecoilState(account_modal_atom);
  return (
    <Card
      bodyStyle={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "100h",
      }}
    >
      <p style={{ display: "flex", alignSelf: "center" }}>
        You are not logged in
      </p>
      <Button
        type="primary"
        style={{ display: "flex", alignSelf: "center" }}
        onClick={() => setAccountModal(true)}
      >
        Login
      </Button>
    </Card>
  );
};

export default LoggedOut;
