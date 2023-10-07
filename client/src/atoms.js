import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

export const session_data_atom = atom({
  key: "session_data",
  default: [],
});

export const user_id_atom = atom({
  key: "user_id",
  default: null,
});

export const is_coach_atom = atom({
  key: "is_coach",
  default: false,
});

export const navbar_status_atom = atom({
  key: "navbar_state",
  default: "overview",
});

export const account_modal_atom = atom({
  key: "account_modal_state",
  default: false,
});

export const pressed_delete_atom = atom({
  key: "deleted_session",
  default: false,
});
