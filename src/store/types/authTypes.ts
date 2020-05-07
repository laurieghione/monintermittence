export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
  isFetching: boolean;
  isAuthenticated: boolean;
  creds: any;
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
  | LogoutSuccessAction
  | LoginRequestAction;
