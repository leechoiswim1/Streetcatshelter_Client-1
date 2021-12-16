// API
import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../shared/axios";

// TOKEN
import { setToken, removeToken } from "../../shared/token";

const _loginKakao =
  (authorization_code) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await userApi.getKakao(authorization_code);
      const userInfo = {
        userId: data.userId,
        name: data.username,
        picture: data.profileImage,
      };
      dispatch(loginKakao(userInfo));
      setToken(data.token);

      history.push("/");
    } catch (e) {
      history.push("/login");
    }
  };

const _loginNaver =
  (authorization_code) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await userApi.getNaver(authorization_code);
      const userInfo = {
        userId: data.userId,
        name: data.username,
        picture: data.profileImage,
      };
      dispatch(loginNaver(userInfo));
      setToken(data.token);

      history.push("/");
    } catch (e) {
      history.push("/login");
    }
  };

const _loginGoogle =
  (authorization_code) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await userApi.getGoogle(authorization_code);
      const userInfo = {
        userId: data.userId,
        name: data.username,
        picture: data.profileImage,
      };
      dispatch(loginGoogle(userInfo));
      setToken(data.token);

      history.push("/");
    } catch (e) {
      history.push("/login");
    }
  };

const _logout =
  () =>
  (dispatch, getState, { history }) => {
    try {
      removeToken("TOKEN");
      dispatch(logout());
      history.push("/login");
    } catch (e) {}
  };

const _setLogin =
  () =>
  (dispatch, getState, { history }) => {
    const token = localStorage.getItem("token");
    if (token !== "") {
      dispatch(setLogin());
    }
  };

// INITIAL STATE
const initialState = {
  name: "",
  userId: "",
  picture: "",
  isLoggedIn: false,
};

// REDUCER
const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginKakao: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId,
        name: action.payload.name,
        picture: action.payload.picture,
      };
    },
    loginNaver: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId,
        name: action.payload.name,
        picture: action.payload.picture,
      };
    },
    loginGoogle: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId,
        name: action.payload.name,
        picture: action.payload.picture,
      };
    },

    logout: (state, action) => {
      return {
        ...state,
        isLoggedIn: false,
      };
    },
    setLogin: (state, action) => {
      return {
        ...state,
        isLoggedIn: true,
      };
    },
  },
});

export const userActions = {
  _loginKakao,
  _setLogin,
  _logout,
  _loginNaver,
  _loginGoogle,
};

export const { setLogin, logout, loginKakao, loginNaver, loginGoogle } =
  user.actions;
export default user;
