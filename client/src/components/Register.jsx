import React from "react";
import { RegistrationForm } from ".";
import * as api from "../ApiCalls";

export default function Register() {
  return (
    <div>
      <RegistrationForm
        onSubmit={async (values) => {
          if (values.coachCheck) {
            delete values.coach_email;
          } else {
            values.coachCheck = false;
          }
          delete values.confirm;
          console.log(values);
          var res = await api.register(JSON.stringify(values));
          if (res.ok) {
            let json = await res.json();
            setAccountModal(false);
            alert("Registered successfully!");
          } else if (res.status === 409) {
            alert("User with this email already exists");
          } else if (res.status === 412) {
            alert("Your coach has not registered");
          }
        }}
      />
    </div>
  );
}
