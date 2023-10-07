import React from "react";
import * as api from "../ApiCalls";
import UpdateUserForm from "../components/UpdateUserForm";
import { useRecoilState } from "recoil";
import { user_id_atom } from "../atoms";

export default function MyAccount() {
  const [userID, setUserID] = useRecoilState(user_id_atom);
  return (
    <div>
      <UpdateUserForm
        onSubmit={async (values) => {
          if (values.coachCheck) {
            delete values.coach_email;
          } else {
            values.coachCheck = false;
          }
          delete values.confirm;
          values["id"] = userID;
          console.log(values);
          var res = await api.updateUser(JSON.stringify(values));
          if (res.ok) {
            let json = await res.json();
            setAccountModal(false);
            alert("Updated successfully!");
          } else if (res.status === 403) {
            alert("Incorrect password, cannot update details");
          } else if (res.status === 412) {
            alert("Your coach has not registered");
          }
        }}
      />
    </div>
  );
}
