import React, { Children, useState } from "react";
import { Breadcrumb, Button, Layout, Menu, Modal, theme } from "antd";
import {
  HomeOutlined,
  LineChartOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
const { Header, Content, Footer } = Layout;
import { account_modal_atom, navbar_status_atom, user_id_atom } from "../atoms";
import { useRecoilState } from "recoil";
import AccountModal from "./AccountModal";
import Logo from "../assets/vite.svg";

function Navbar({ children }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    {
      label: "Overview",
      key: "overview",
      icon: <HomeOutlined />,
    },
  ];

  const [navbarState, setNavbarState] = useRecoilState(navbar_status_atom);
  const [userID, setUserID] = useRecoilState(user_id_atom);
  const [accountModal, setAccountModal] = useRecoilState(account_modal_atom);

  if (userID != null) {
    items.push({
      label: "Statistics",
      key: "statistics",
      icon: <LineChartOutlined />,
    });
    items.push({
      label: "My Account",
      key: "account",
      icon: <EditOutlined />,
    });
  }

  const onClick = (e) => {
    setNavbarState(e.key);
  };

  return (
    <Layout className="layout">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <img src={Logo} style={{ padding: "24px" }} />
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={onClick}
          selectedKeys={[navbarState]}
          defaultSelectedKeys={["overview"]}
          items={items}
          disabledOverflow={true}
        />
        <Button
          type="primary"
          style={{ marginLeft: "auto" }}
          icon={<UserOutlined />}
          onClick={() => setAccountModal(true)}
        />
      </Header>
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        <div
          className="site-layout-content"
          style={{
            background: colorBgContainer,
          }}
        >
          {children}
        </div>
        <Modal
          open={accountModal}
          onCancel={() => setAccountModal(false)}
          footer={<></>}
        >
          <AccountModal />
        </Modal>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        ©2023
      </Footer>
    </Layout>
  );
}
export default Navbar;
