import React, { useEffect } from "react";
import * as api from "../ApiCalls";
import { useRecoilState } from "recoil";
import { account_modal_atom, is_coach_atom, user_id_atom } from "../atoms";
import { Button } from "antd";

const Logout = () => {
  const [userID, setUserID] = useRecoilState(user_id_atom);
  const [isCoach, setIsCoach] = useRecoilState(is_coach_atom);
  const [accountModal, setAccountModal] = useRecoilState(account_modal_atom);
  function logout() {
    return async () => {
      var res = await api.logout();
      if (res == 200) {
        setUserID(null);
        setIsCoach(false);
        setAccountModal(false);
        console.log(userID);
      }
    };
  }

  return (
    <div>
      <p>Do you want to logout?</p>
      <div>
        <Button onClick={logout()}>Yes</Button>
        <Button onClick={() => setAccountModal(false)}>No</Button>
      </div>
    </div>
  );
};

export default Logout;
