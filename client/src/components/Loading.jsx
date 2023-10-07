import { Card } from "antd";
import React from "react";

const Loading = () => {
  return (
    <Card
      bodyStyle={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "100h",
      }}
    >
      <p style={{ display: "flex", alignSelf: "center" }}>Loading...</p>
    </Card>
  );
};

export default Loading;
