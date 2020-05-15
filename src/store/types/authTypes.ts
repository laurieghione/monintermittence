export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const PROFILE_REQUEST = "PROFILE_REQUEST";
export const PROFILE_SUCCESS = "PROFILE_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  isFetching: boolean;
  isAuthenticated: boolean;
  creds: any;
}

interface ProfileRequestAction {
  type: typeof PROFILE_REQUEST;
  isFetching: boolean;
  isAuthenticated: boolean;
}

interface ProfileSuccessAction {
  type: typeof PROFILE_SUCCESS;
  isFetching: boolean;
  isAuthenticated: boolean;
  profile: any;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  isFetching: boolean;
  isAuthenticated: boolean;
  profile: any;
}

interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
  isFetching: false;
  isAuthenticated: false;
}

export type AuthActionTypes =
  | LoginSuccessAction
  | ProfileRequestAction
  | ProfileSuccessAction
  | LogoutSuccessAction
  | LoginRequestAction;
