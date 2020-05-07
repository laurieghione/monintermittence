import * as authTypes from "../types/authTypes";

export interface AuthState {
  isFetching: boolean;
  profile: any | null;
  isAuthenticated: boolean;
  creds: any;
}

let initialState = {
  isAuthenticated: localStorage.getItem("id_token") ? true : false,
  profile: null,
  creds: null,
  isFetching: false,
};

export default function folderReducer(
  state: AuthState = initialState,
  action: authTypes.AuthActionTypes
): AuthState {
  console.log("Auth reducer : ", state, action);

  switch (action.type) {
    case authTypes.LOGIN_REQUEST: {
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        creds: action.creds,
      };
    }
    case authTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        profile: action.profile,
      };
    case authTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        profile: null,
      };

    default:
      return state;
  }
}
