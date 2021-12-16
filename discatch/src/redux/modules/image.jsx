// AWS S3
import AWS from "aws-sdk";

AWS.config.update({
  region: "ap-northeast-2",
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "ap-northeast-2:668d98f4-0b26-4a2d-b594-f3ac6da473fc",
  }),
});

// ACTION
const UPLOAD_IMAGE = "IMAGE";
const UPLOAD_IMAGES = "IMAGES";
const SET_FILE = "SET_FILE";
const SET_FILES = "SET_FILES";
const DEL_FILE = "DEL_FILE";
const DEL_PREVIEW = "DEL_PREVIEW";
const SET_INITIAL_STATE = "SET_INITIAL_STATE";
const SET_PREVIEW = "SET_PREVIEW";

// ACTION CREATOR
const uploadImage = (imageUrl) => ({ type: UPLOAD_IMAGE, imageUrl });
const uploadImages = (imageUrls) => ({ type: UPLOAD_IMAGES, imageUrls });
const setFile = (file, fileId) => ({ type: SET_FILE, file: file, fileId });
const setFiles = (file, fileId) => ({ type: SET_FILE, file: { file, fileId } });
const delFile = (fileId) => ({ type: DEL_FILE, fileId });
const delPreview = (previewId) => ({ type: DEL_PREVIEW, previewId });
const setInitialState = () => ({ type: SET_INITIAL_STATE });
const setPreview = (preview, previewId) => ({
  type: SET_PREVIEW,
  preview: { preview, previewId },
});

// INITIAL STATE
const initialState = {
  imageUrl: [],
  file: [],
  preview: [],
  imageUrls: [],
};

// MIDDLEWARE
// 이미지 여러 개
const uploadImagesDB = (callNext) => {
  return async function (dispatch, getState) {
    const imgList = getState().image.file;
    const imgUrl = getState().image.imageUrls;

    for (let i = 0; i < imgList.length; i++) {
      const img = imgList[i].file;
      const url = imgUrl[i];

      if (typeof img !== "object") {
        dispatch(uploadImages(img));
        dispatch(uploadImages(url));
        continue;
      }

      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: "discatch.site",
          Key: img.name,
          Body: img,
        },
      });

      const promise = upload.promise();

      await promise
        .then((data) => {
          dispatch(uploadImages(data.Location));
        })
        .catch((error) => {});
    }
    callNext();
  };
};

// 이미지 한 개
const uploadImageDB = (callNext) => {
  return async function (dispatch, getState) {
    const imgList = getState().image.file;
    const imgUrl = getState().image.imageUrl;
    for (let i = 0; i < imgList.length; i++) {
      const img = imgList[i];
      const url = imgUrl[i];

      if (typeof img !== "object") {
        dispatch(uploadImage(img));
        dispatch(uploadImage(url));
        continue;
      }

      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: "discatch",
          Key: img.name,
          Body: img,
        },
      });

      const promise = upload.promise();

      await promise
        .then((data) => {
          dispatch(uploadImage(data.Location));
        })
        .catch((error) => {});
    }
    callNext();
  };
};

// REDUCER
function image(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_IMAGES:
      return { ...state, imageUrls: [...state.imageUrls, action.imageUrls] };
    case UPLOAD_IMAGE:
      return { ...state, imageUrl: action.imageUrl };
    case SET_FILE:
      return { ...state, file: [...state.file, action.file] };
    case SET_FILES:
      return { ...state, file: [...state.file, action.file] };
    case DEL_FILE:
      const fileList = state.file.filter(
        (i, idx) => i.fileId !== action.fileId
      );
      return { ...state, file: fileList };
    case DEL_PREVIEW:
      const previewList = state.preview.filter(
        (p, idx) => p.previewId !== action.previewId
      );
      return { ...state, preview: previewList };
    case SET_INITIAL_STATE:
      return { imageUrl: [], file: [], imageUrls: [], preview: [] };
    case SET_PREVIEW:
      return { ...state, preview: [...state.preview, action.preview] };
    default:
      return state;
  }
}

export default image;

export const imgActions = {
  uploadImage,
  uploadImages,
  setFile,
  setFiles,
  delFile,
  setInitialState,
  uploadImagesDB,
  uploadImageDB,
  setPreview,
  delPreview,
};
