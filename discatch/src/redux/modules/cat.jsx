// API
import { createSlice } from "@reduxjs/toolkit";
import instance, { catApi } from "../../shared/axios";

// REDUX
import { imgActions } from "./image";

// 기본 정보 작성
export const __createCatInfo = (
  catName,
  catTag,
  neutering,
  location,
  nickName,
  latitude,
  longitude,
  pathLocation
) => {
  return function (dispatch, getState, { history }) {
    const imgFile = getState().image.file;
    if (imgFile.length) {
      dispatch(
        imgActions.uploadImageDB(() => {
          const imageUrl = getState().image.imageUrl;
          const catInfo = {
            catImage: imageUrl,
            catName: catName,
            catTag: catTag,
            latitude: latitude,
            location: location,
            longitude: longitude,
            neutering: neutering,
            username: nickName,
          };
          instance
            .post("/cat/create", catInfo)
            .then((res) => {
              dispatch(imgActions.setInitialState());
              dispatch(setInitialState([]));
              history.push({
                pathname: "/",
                state: { location: pathLocation },
              });
            })
            .catch((err) => {
              console.error(err);
            });
        })
      );
    }
  };
};

// 기본 정보 수정
export const __editCatInfo =
  (catName, hashTags, neutering, catId) =>
  async (dispatch, getState, { history }) => {
    const imgFile = getState().image.file;
    if (imgFile.length) {
      dispatch(
        imgActions.uploadImageDB(() => {
          const imageUrl = getState().image.imageUrl;
          const catInfo = {
            catImage: imageUrl,
            catName: catName,
            catTag: hashTags,
            neutering: neutering,
          };
          instance
            .put(`/cat/${catId}`, catInfo)
            .then((res) => {
              dispatch(imgActions.setInitialState());
              dispatch(setInitialState([]));
            })
            .catch((err) => {
              console.error(err);
            });
        })
      );
    } else {
      const imageUrl = getState().image.imageUrl;
      const catInfo = {
        catImage: imageUrl,
        catName: catName,
        catTag: hashTags,
        neutering: neutering,
      };
      try {
        const { data } = await catApi.editCatInfo(catInfo, catId);
        dispatch(imgActions.setInitialState());
        dispatch(setInitialState([]));
        history.goBack();
      } catch (err) {
        console.error(err);
      }
    }
  };

// 상세 정보 작성
export const __createCatDetailInfo = (
  hashTags,
  diary,
  food,
  latitude,
  longitude,
  snack,
  water,
  catId
) => {
  return function (dispatch, getState, { history }) {
    const imgFile = getState().image.file;
    if (imgFile.length < 4) {
      dispatch(
        imgActions.uploadImagesDB(() => {
          const imageUrl = getState().image.imageUrls;

          const detailInfo = {
            catImages: imageUrl,
            catTags: hashTags,
            diary: diary,
            food: food,
            latitude: latitude,
            longitude: longitude,
            snack: snack,
            water: water,
            catId: catId,
          };
          instance
            .post(`/cat/detail/${catId}`, detailInfo)
            .then((res) => {
              dispatch(imgActions.setInitialState());
              dispatch(setInitialState([]));
              dispatch(__getDiary(catId));
            })
            .catch((err) => {
              console.error(err);
            });
        })
      );
    } else {
      return;
    }
  };
};

// 상세 정보 수정
export const __editCatDetailInfo =
  (hashTags, diary, food, snack, water, catDetailId, catImages, catId) =>
  async (dispatch, getState, { history }) => {
    try {
      const detailInfo = {
        catImages: catImages,
        catTags: hashTags,
        diary: diary,
        food: food,
        snack: snack,
        water: water,
      };
      const { data } = await catApi.editCatDetailInfo(detailInfo, catDetailId);
      dispatch(setInitialState([]));
      dispatch(__getDiary(catId));
    } catch (err) {
      console.error(err);
    }
  };

// 지역에 따라 모든 게시물 불러오기
export const __getAllCatLocation =
  (location) =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(postLoading(true));
      const { data } = await catApi.getCatAllLocation(location);
      dispatch(getCatAllLocation(data, null));
    } catch (err) {
      console.error(err);
    }
  };

// 지역에 따라 게시물 불러오기
export const __getCatLocation =
  (location) =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(postLoading(true));
      const { data } = await catApi.getCatLocation(location);
      dispatch(getCatLocation(data, null));
    } catch (err) {
      console.error(err);
    }
  };

// 지역에 따라 게시물 불러오기
export const __getMoreCatLocation =
  (location, page) =>
  async (dispatch, getState, { history }) => {
    try {
      dispatch(postLoading(true));
      const { data } = await catApi.getMoreCatLocation(location, page);
      dispatch(getMoreCatLocation(data, null));
    } catch (err) {
      console.error(err);
    }
  };

// 상세 정보
export const __getCatDetail =
  (catDetailId) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.getCatDetail(catDetailId);
      dispatch(getCatDetail(data));
    } catch (err) {
      console.error(err);
    }
  };

export const __getCatInfo =
  (catId) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.getCatInfo(catId);
      dispatch(getCatInfo(data));
    } catch (err) {
      console.error(err);
    }
  };

// 상세 페이지(캘린더)
export const __getCalendar =
  (catId, year, month) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.getCatCalendar(catId, month, year);
      dispatch(getCalendar(data.date));
    } catch (err) {
      console.error(err);
    }
  };

// 상세 페이지(캘린더디테일)
export const __getCalendarDetail =
  (catId, day, month, year) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.getCalendarDetail(catId, day, month, year);
      dispatch(getDetailCalendar(data));
    } catch (err) {
      console.error(err);
    }
  };

// 상세 페이지(집사일기)
export const __getDiary =
  (catId, size = 30) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.getCatDiary(catId, size);
      dispatch(getDiary(data));
    } catch (err) {
      console.error(err);
    }
  };

// 상세 페이지(갤러리)
export const __getGallery =
  (catId, size = 30) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.getCatGallery(catId, size);
      dispatch(getGallery(data));
    } catch (err) {
      console.error(err);
    }
  };

// 기본 정보 좋아요
export const __catLike =
  (catId, path) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.catLike(catId);
      dispatch(likeToggle({ catId: catId, path: path }));
    } catch (err) {
      console.error(err);
    }
  };

// 상세 정보 좋아요
export const __catDiaryLike =
  (catDetailId, path) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.catDiaryLike(catDetailId);
      dispatch(likeToggle(path));
    } catch (err) {
      console.error(err);
    }
  };

// Cat 상세정보 삭제
export const __deleteCatDetail =
  (catDetailId) =>
  async (dispatch, getState, { history }) => {
    try {
      const { data } = await catApi.deleteCatDetail(catDetailId);
      history.goBack();
      dispatch(_deleteToast(true));
    } catch (err) {
      console.error(err);
    }
  };

const initialState = {
  list: [],
  detail: [],
  calendar: [],
  gallery: [],
  diary: [],
  page: 0,
  start: 0,
  catinfo: [],
  hashtag: [],
  postLoaded: false,
  calendardetail: [],
  deleteToast: false,
};

const cat = createSlice({
  name: "cat",
  initialState,
  reducers: {
    createCatInfo: (state, action) => {
      const catInfo = {
        image: action.payload.catImage,
        catName: action.payload.catName,
        catTag: action.payload.catTag,
        latitude: action.payload.latitude,
        location: action.payload.location,
        longitude: action.payload.longitude,
        neutering: action.payload.neutering,
        username: action.payload.username,
      };
      state.list.push(catInfo);
    },

    createCatDetailInfo: (state, action) => {
      const detailInfo = {
        image: action.payload.catImages,
        catTag: action.payload.catTags,
        diary: action.payload.diary,
        food: action.payload.food,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        snack: action.payload.snack,
        water: action.payload.water,
      };
      state.detail.push(detailInfo);
    },

    getCatLocation: (state, action) => {
      state.list = action.payload;
      state.postLoaded = false;
    },
    getCatAllLocation: (state, action) => {
      state.list = action.payload;
      state.postLoaded = false;
    },
    getMoreCatLocation: (state, action) => {
      return {
        ...state,
        list: [...state.list, ...action.payload],
        postLoaded: false,
      };
    },

    getCatDetail: (state, action) => {
      state.detail = action.payload;
    },
    getCatInfo: (state, action) => {
      state.catinfo = action.payload;
    },

    getCalendar: (state, action) => {
      state.calendar = action.payload;
    },

    getDetailCalendar: (state, action) => {
      state.calendardetail = action.payload;
    },

    getDiary: (state, action) => {
      state.diary = action.payload;
    },

    getGallery: (state, action) => {
      state.gallery = action.payload;
    },

    addHashTag: (state, action) => {
      state.hashtag.push(action.payload);
    },

    deleteHashTag: (state, action) => {
      return {
        ...state,
        hashtag: state.hashtag.filter((tag) => tag !== action.payload),
      };
    },
    setInitialState: (state, action) => {
      state.hashtag = initialState.hashtag;
    },
    postLoading: (state, action) => {
      state.postLoaded = action.payload;
    },
    resetList: (state, action) => {
      state.list = [];
    },

    likeToggle: (state, action) => {
      if (action.payload === "diary") {
        state.detail.userLiked = !state.detail.userLiked;
      } else if (action.payload.path === "detail") {
        state.catinfo.userLiked = !state.catinfo.userLiked;
      } else {
        const idx = state.list.findIndex(
          (c) => c.catId === action.payload.catId
        );
        state.list[idx].userLiked = !state.list[idx].userLiked;
      }
    },
    _deleteToast: (state, action) => {
      state.deleteToast = action.payload;
    },
  },
});

export const {
  createCatInfo,
  createCatDetailInfo,
  createCatDetailComment,
  getCatAllLocation,
  getCatLocation,
  getMoreCatLocation,
  getCatDetail,
  getCatInfo,
  getCalendar,
  getDetailCalendar,
  getDiary,
  getGallery,
  deleteCatDetail,
  addHashTag,
  deleteHashTag,
  setInitialState,
  postLoading,
  resetList,
  likeToggle,
  _deleteToast,
} = cat.actions;

export default cat;
