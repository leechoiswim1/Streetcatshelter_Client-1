// API
import { createSlice } from "@reduxjs/toolkit";
import instance, { communityApi } from "../../shared/axios";

// REDUX
import { imgActions } from "./image";

// 커뮤니티 글 등록
export const addCommunityDB = (
  category,
  contents,
  location,
  title,
  detailLocation,
  nickName
) => {
  return function (dispatch, getState, { history }) {
    const path = category.split(" ");
    let pathName = null;
    if (path[1] === "정보글") {
      pathName = "catinfo";
    } else if (path[2] === "모임") {
      pathName = "gathering";
    } else {
      pathName = "sharing";
    }
    dispatch(
      imgActions.uploadImagesDB(() => {
        const imageUrl = getState().image.imageUrls;
        const postInfo = {
          category: category,
          contents: contents,
          image: imageUrl,
          location: location,
          title: title,
          username: nickName,
        };
        instance
          .post("/community/create", postInfo)
          .then((res) => {
            history.push(`/community/${detailLocation}/${pathName}`);
            dispatch(imgActions.setInitialState());
          })
          .catch((err) => {});
      })
    );
  };
};

// 커뮤니티 글 가져오기
export const getCommunityDB =
  (category, location) =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(itemLoading(true));
      const data = await communityApi.getCommunity(category, location);
      if (category.split(" ")[1] === "정보글") {
        dispatch(getCatInfo(data.data));
      } else if (category.split(" ")[1] === "동네") {
        dispatch(getGathering(data.data));
      } else if (category.split(" ")[1] === "고양이") {
        dispatch(getSharing(data.data));
      }
    } catch (err) {
      dispatch(errorToast(true));
    }
  };

// 커뮤니티 글 추가 가져오기
export const getMoreCommunityDB =
  (category, location, page) =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(itemLoading(true));
      const data = await communityApi.getMoreCommunity(
        category,
        location,
        page
      );
      if (category.split(" ")[1] === "정보글") {
        dispatch(getMoreCatInfo(data.data));
      } else if (category.split(" ")[1] === "동네") {
        dispatch(getMoreGathering(data.data));
      } else if (category.split(" ")[1] === "고양이") {
        dispatch(getMoreSharing(data.data));
      }
    } catch (err) {
      dispatch(errorToast(true));
      console.error(err);
    }
  };

// 커뮤니티 글 상세 가져오기
export const getOneCommunityDB =
  (communityId = "") =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(itemDetailLoading(true));
      const data = await communityApi.getDetailCommunity(communityId);
      dispatch(getOneCommunity(data.data));
    } catch (err) {
      console.error(err);
    }
  };

// 커뮤니티 수정
export const editCommunityDB = (
  communityId,
  category,
  editcontents,
  location,
  editTitle,
  username,
  imageList
) => {
  return function (dispatch, getState, { history }) {
    const imgFile = getState().image.file;
    let path;
    if (category?.split(" ")[1] === "정보글") {
      path = "catinfo";
    } else if (category?.split(" ")[1] === "동네") {
      path = "gathering";
    } else if (category?.split(" ")[1] === "고양이") {
      path = "sharing";
    }
    let newImageUrl = [];
    let newImages = [];
    if (imgFile.length < 6) {
      dispatch(
        imgActions.uploadImagesDB(() => {
          let imageUrl = getState().image.imageUrls;
          if (imageList) {
            newImageUrl.push(
              imageList[0]?.image,
              imageList[1]?.image,
              imageList[2]?.image,
              imageList[3]?.image,
              imageList[4]?.image
            );
          }

          newImages = newImageUrl.filter((element, i) => element !== undefined);
          newImages.push(
            imageUrl[0],
            imageUrl[1],
            imageUrl[2],
            imageUrl[3],
            imageUrl[4]
          );
          const editImageList = newImages.filter(
            (element, i) => element !== undefined
          );
          instance
            .put(`/community/${communityId}`, {
              category: category,
              contents: editcontents,
              image: editImageList,
              location: location,
              title: editTitle,
              username: username,
            })
            .then((res) => {
              dispatch(imgActions.setInitialState());
              history.push(
                `/community/${location}/${path}/postdetail/${communityId}`
              );
            })
            .catch((err) => {
              console.log(err);
            });
        })
      );
    } else {
      return;
    }
  };
};

// 커뮤니티 글 삭제
export const deleteCommunityDB =
  (communityId, category, location) =>
  async (dispatch, getState, { history }) => {
    const path = category.split(" ");
    let pathName = null;
    if (path.length === 2) {
      pathName = "catinfo";
    } else if (path.length === 3) {
      pathName = "gathering";
    } else {
      pathName = "sharing";
    }
    try {
      const data = await communityApi.deleteCommunity(communityId);
      history.push({
        pathname: `/community/${location}/${pathName}`,
        state: { location },
      });
    } catch (err) {
      console.error(err);
    }
  };

// 커뮤니티 댓글 작성
export const addCommunityCommentDB =
  (contents, communityId) =>
  async (dispatch, getState, { history }) => {
    try {
      const data = await communityApi.createCommunityComment(
        contents,
        communityId
      );
      dispatch(getOneCommunityDB(communityId));
    } catch (err) {
      console.error(err);
    }
  };

// 커뮤니티 댓글 삭제
export const deleteCommunityCommentDB =
  (commentId, communityId) =>
  async (dispatch, getState, { history }) => {
    try {
      const data = await communityApi.deleteCommunityComment(commentId);
      dispatch(deleteComment(commentId));
    } catch (err) {
      console.error(err);
    }
  };

// 커뮤니티 디테일 정보 좋아요
export const communityLikeToggleDB =
  (communityId) =>
  async (dispatch, getState, { history }) => {
    try {
      const data = await communityApi.communityLikeToggle(communityId);
      dispatch(likeToggle());
    } catch (err) {
      console.error(err);
    }
  };

// INITIAL STATE
const initialState = {
  catInfo: [],
  gathering: [],
  sharing: [],
  communityDetail: [],
  page: 0,
  pageLoaded: false,
  itemLoaded: false,
  itemDetailLoaded: false,
  toast: false,
};

// REDUCER
const community = createSlice({
  name: "community",
  initialState,
  reducers: {
    addCatInfo: (state, action) => {
      const category = action.payload.category;
      const contents = action.payload.contents;
      const image = action.payload.image;
      const location = action.payload.location;
      const title = action.payload.title;
      const username = action.payload.username;
      const detailLocation = action.payload.username;
      state.catInfo.push(
        category,
        contents,
        image,
        location,
        title,
        username,
        detailLocation
      );
    },
    addGathering: (state, action) => {
      const category = action.payload.category;
      const contents = action.payload.contents;
      const image = action.payload.image;
      const location = action.payload.location;
      const title = action.payload.title;
      const username = action.payload.username;
      const detailLocation = action.payload.username;
      state.gathering.push(
        category,
        contents,
        image,
        location,
        title,
        username,
        detailLocation
      );
    },
    addSharing: (state, action) => {
      const category = action.payload.category;
      const contents = action.payload.contents;
      const image = action.payload.image;
      const location = action.payload.location;
      const title = action.payload.title;
      const username = action.payload.username;
      const detailLocation = action.payload.username;
      state.sharing.push(
        category,
        contents,
        image,
        location,
        title,
        username,
        detailLocation
      );
    },
    getCatInfo: (state, action) => {
      state.catInfo = action.payload;
      state.itemLoaded = false;
    },
    getGathering: (state, action) => {
      state.gathering = action.payload;
      state.itemLoaded = false;
    },
    getSharing: (state, action) => {
      state.sharing = action.payload;
      state.itemLoaded = false;
    },
    getMoreCatInfo: (state, action) => {
      return {
        ...state,
        catInfo: [...state.catInfo, ...action.payload],
        itemLoaded: false,
      };
    },
    getMoreGathering: (state, action) => {
      return {
        ...state,
        gathering: [...state.gathering, ...action.payload],
        itemLoaded: false,
      };
    },
    getMoreSharing: (state, action) => {
      return {
        ...state,
        sharing: [...state.sharing, ...action.payload],
        itemLoaded: false,
      };
    },
    pageLoading: (state, action) => {
      state.pageLoaded = action.payload;
    },
    itemLoading: (state, action) => {
      state.itemLoaded = action.payload;
    },
    itemDetailLoading: (state, action) => {
      state.itemDetailLoaded = action.payload;
    },
    resetList: (state, action) => {
      state.catInfo = [];
      state.gathering = [];
      state.sharing = [];
    },
    errorToast: (state, action) => {
      state.toast = action.payload;
    },
    getOneCommunity: (state, action) => {
      state.communityDetail = action.payload;
      state.itemDetailLoaded = false;
    },
    deleteComment: (state, action) => {
      const idx = state.communityDetail.commentList.findIndex(
        (c) => c.commentId === action.payload
      );
      if (idx !== -1) {
        state.communityDetail.commentList.splice(idx, 1);
      }
    },
    // 커뮤니티 디테일 정보 좋아요
    likeToggle: (state, action) => {
      if (!state.communityDetail.liked) {
        state.communityDetail.liked = true;
        state.communityDetail.cntLikeit = state.communityDetail.cntLikeit + 1;
      } else {
        state.communityDetail.liked = false;
        state.communityDetail.cntLikeit = state.communityDetail.cntLikeit - 1;
      }
    },
  },
});

export const {
  addCatInfo,
  addGathering,
  addSharing,
  getCatInfo,
  getGathering,
  getSharing,
  getMoreCatInfo,
  getMoreGathering,
  getMoreSharing,
  pageLoading,
  startReset,
  itemLoading,
  itemDetailLoading,
  resetList,
  errorToast,
  getOneCommunity,
  deleteComment,
  likeToggle,
} = community.actions;

export default community;
