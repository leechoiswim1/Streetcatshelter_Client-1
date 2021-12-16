// API
import { createSlice } from "@reduxjs/toolkit";
import { chatApi } from "../../shared/axios";

const _getRooms =
  () =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(loading(true));
      const { data } = await chatApi.getRooms();
      dispatch(setRooms(data));
    } catch (e) {}
  };

const _createRoom =
  (chatuser) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await chatApi.createRoom(chatuser);
      history.push(`/api/chat/enter/${data.roomId}`);
    } catch (e) {
      dispatch(changeToast(true));
    }
  };

const _getMessage =
  (roomId, page) =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(loading(true));

      const { data } = await chatApi.getMessage(roomId, page);

      dispatch(setChatMessage(data));
    } catch (e) {}
  };

const _getMoreMessage =
  (roomId, page) =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(loading(true));

      const { data } = await chatApi.getMoreMessage(roomId, page);

      dispatch(setChatMessage(data));
    } catch (e) {}
  };

const _getRoomInfo =
  (roomId) =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(loading(true));
      const { data } = await chatApi.getRoomInfo(roomId);
      dispatch(setChatInfo(data));
    } catch (e) {}
  };

const _deleteRoom =
  (roomId, location) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await chatApi.deleteRoom(roomId);
      history.push({
        pathname: "/chat",
        state: { location },
      });
      dispatch(deleteRoom(roomId));
    } catch (e) {}
  };

const initialState = {
  roomlist: [],
  chatinfo: [],
  chatmessage: [],
  loading: [],
  isLoaded: false,
  toast: false,
};

// 리듀서
const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.roomlist = action.payload;
      state.isLoaded = false;
    },
    setChatInfo: (state, action) => {
      state.chatinfo = action.payload;
    },
    setChatMessage: (state, action) => {
      return {
        ...state,
        chatmessage: [...action.payload, ...state.chatmessage],
        isLoaded: false,
      };
    },
    pushChatMessage: (state, action) => {
      state.chatmessage.push(action.payload);
    },
    loading: (state, action) => {
      state.isLoaded = action.payload;
    },
    deleteRoom: (state, action) => {
      return {
        ...state,
        roomlist: state.roomlist.filter(
          (room) => room.roomId !== action.payload
        ),
      };
    },
    changeToast: (state, action) => {
      state.toast = action.payload;
    },
    resetAllMessage: (state, action) => {
      state.chatmessage = [];
    },
  },
});

export const chatActions = {
  _getRooms,
  _createRoom,
  _getRoomInfo,
  _getMessage,
  _getMoreMessage,
  _deleteRoom,
};
export const {
  setChatInfo,
  setRooms,
  setChatMessage,
  pushChatMessage,
  loading,
  deleteRoom,
  changeToast,
  resetAllMessage,
} = chat.actions;
export default chat;
