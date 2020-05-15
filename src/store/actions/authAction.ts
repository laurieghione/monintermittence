import * as authTypes from "../types/authTypes";
import auth0 from "auth0-js";

const REDIRECT_ON_LOGIN = "redirect_on_login";
const ACCESS_TOKEN = "access_token";
const ID_TOKEN = "id_token";
const EXPIRE_AT = "expire_at";
const SCOPES = "scopes";

let requestedScopes = "openid profile email read:declarations";

let auth = new auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN!,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  responseType: "token id_token",
  scope: requestedScopes,
});

export function requestLogin(creds: any): authTypes.AuthActionTypes {
  return {
    type: authTypes.LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds,
  };
}
export function requestProfile(): authTypes.AuthActionTypes {
  return {
    type: authTypes.PROFILE_REQUEST,
    isFetching: true,
    isAuthenticated: false,
  };
}
export function receiveLogin(profile: any): authTypes.AuthActionTypes {
  return {
    type: authTypes.LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    profile,
  };
}
export function receiveProfile(profile: any): authTypes.AuthActionTypes {
  return {
    type: authTypes.PROFILE_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    profile,
  };
}

export function receiveLogout(): authTypes.AuthActionTypes {
  return {
    type: authTypes.LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
  };
}

export function login() {
  auth.authorize();
}

export function loginUser() {
  return (dispatch: any) => {
    auth.parseHash((err, authResult) => {
      dispatch(requestLogin(authResult));
      if (authResult && authResult.accessToken && authResult.idToken) {
        setSession(authResult);
        auth.client.userInfo(authResult.accessToken, (err, profile) => {
          if (err) {
            console.log(err);
          }
          dispatch(receiveLogin(profile));
        });
      } else {
        window.location.href = "/";
      }
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };
}

export function getUserInfo() {
  return (dispatch: any) => {
    dispatch(requestProfile());
    auth.client.userInfo(
      localStorage.getItem("access_token")!,
      (err, profile) => {
        if (err) {
          console.log(err);
        }
        dispatch(receiveProfile(profile));
      }
    );
  };
}

export function logout() {
  return (dispatch: any) => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(ID_TOKEN);
    localStorage.removeItem(SCOPES);
    localStorage.removeItem(EXPIRE_AT);
    auth.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      // returnTo: process.env.REACT_APP_AUTH0_CALLBACK_URL,
    });
    dispatch(receiveLogout());
  };
}

function setSession(authResult: any) {
  const expireAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  );

  const scopes = authResult.scope || requestedScopes || "";
  localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
  localStorage.setItem(ID_TOKEN, authResult.idToken);
  localStorage.setItem(EXPIRE_AT, expireAt);
  localStorage.setItem(SCOPES, JSON.stringify(scopes));
  scheduleTokenRenewal();
}

function scheduleTokenRenewal() {
  const delay = JSON.parse(localStorage.getItem(EXPIRE_AT)!) - Date.now();
  if (delay > 0) {
    setTimeout(() => renewToken(), delay);
  }
}

function renewToken(): Promise<any> {
  return new Promise((resolve, reject) => {
    auth.checkSession({}, (err, result) => {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        setSession(result);
        resolve();
      }
    });
  });
}
