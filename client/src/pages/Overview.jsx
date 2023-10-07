import React, { useState, useEffect } from "react";
import { Chart, SummaryTable } from "../components";
import { useRecoilState } from "recoil";
import { is_coach_atom, user_id_atom, session_data_atom } from "../atoms";
import * as api from "../ApiCalls";
import LoggedOut from "../components/LoggedOut";
import Loading from "../components/Loading";

const Overview = () => {
  const [userID, setUserID] = useRecoilState(user_id_atom);
  const [sessionData, setSessionData] = useRecoilState(session_data_atom);
  const [isCoach, setIsCoach] = useRecoilState(is_coach_atom);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      if (userID == null) {
        setLoading(false);
        return;
      } else {
        const dataRes = await api.loadUserSessions(userID);
        console.log("UserID", userID);
        setSessionData(dataRes);
        setLoading(false);
      }
    })();
  }, []);

  const getContent = () => {
    if (userID == null) {
      return <LoggedOut />;
    }

    if (isCoach) {
      return (
        <div>
          <SummaryTable dataSource={sessionData}/>
        </div>
      );
    } else {
      return (
        <div>
          <SummaryTable dataSource={sessionData} />
        </div>
      );
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return <div>{getContent()}</div>;
};

export default Overview;
