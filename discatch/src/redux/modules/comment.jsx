// API
import { createSlice } from "@reduxjs/toolkit";
import { catApi } from "../../shared/axios";

// detail 댓글 작성
export const __createCatComment =
  (catId, contents) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.createCatComment(catId, contents);

      dispatch(createCatComment({ contents }));
    } catch (err) {
      console.error(err);
    }
  };

// catDetailInfo 댓글 작성
export const __createCatDetailComment =
  (catDetailId, contents) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.createCatDetailComment(
        catDetailId,
        contents
      );
      dispatch(createCatDetailComment({ contents }));
    } catch (err) {
      console.error(err);
    }
  };

// detail 댓글 불러오기
export const __getComment =
  (catId, size = 9999) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.getComment(catId, size);
      dispatch(getComment(data));
    } catch (err) {
      console.error(err);
    }
  };

// catDetailInfo 댓글 불러오기
export const __getDetailComment =
  (catDetailId, size = 9999) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.getDetailComment(catDetailId, size);
      dispatch(getDetailComment(data));
    } catch (err) {
      console.error(err);
    }
  };

// 댓글 삭제
export const __deleteComment =
  (commentId) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.deleteCatComment(commentId);
      dispatch(deleteCatComment(commentId));
    } catch (err) {
      console.error(err);
    }
  };

const initialState = {
  list: [],
};

const comment = createSlice({
  name: "comment",
  initialState,
  reducers: {
    createCatComment: (state, action) => {
      const contents = action.payload.contents;
      state.list.push({ contents });
    },
    createCatDetailComment: (state, action) => {
      const contents = action.payload.contents;
      state.list.push({ contents });
    },
    getComment: (state, action) => {
      state.list = action.payload;
    },
    getDetailComment: (state, action) => {
      state.list = action.payload;
    },
    deleteCatComment: (state, action) => {
      return {
        ...state,
        list: state.list.filter(
          (comment) => comment.commentId !== action.payload
        ),
      };
    },
  },
});

export const {
  createCatComment,
  createCatDetailComment,
  getComment,
  getDetailComment,
  deleteCatComment,
} = comment.actions;

export default comment;
