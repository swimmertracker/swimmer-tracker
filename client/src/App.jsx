import { useState } from "react";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Overview from "./pages/Overview";
import MyAccount from "./pages/MyAccount";
import Register from "./components/Register";
import Statistics from "./pages/Statistics";
import Navbar from "./components/Navbar";
import { useRecoilState } from "recoil";
import { navbar_status_atom } from "./atoms";
import { Button, Space } from "antd";

function App() {
  const [navbarState, setNavbarState] = useRecoilState(navbar_status_atom);

  const getContent = () => {
    const pages = {
      overview: <Overview />,
      statistics: <Statistics />,
      account: <MyAccount />,
    };
    return pages[[navbarState]];
  };

  return (
    <>
      <Navbar>{getContent()}</Navbar>
    </>
  );
}

export default App;
