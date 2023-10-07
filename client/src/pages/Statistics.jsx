import React from 'react'
import { useRecoilState } from "recoil";
import { is_coach_atom, session_data_atom, user_id_atom } from "../atoms";
import CoachStats from './CoachStats';
import SwimmerStats from './SwimmerStats';

const Statistics = () => {
  const [isCoach, setIsCoach] = useRecoilState(is_coach_atom)
  const [userID, setUserID] = useRecoilState(user_id_atom)
  const getContent = () => {
    if (isCoach){
      return <CoachStats />
    } else {
      return <SwimmerStats />
    }
  }

  return (
    <div>{getContent()}</div>
  )
}

export default Statistics