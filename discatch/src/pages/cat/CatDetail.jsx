// LIBRARY
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// STYLE
import { css } from "styled-components";
import { flexBox } from "../../shared/style";

// COMPONENTS
import {
  Template,
  CatCalendar,
  CatDiary,
  CatGallery,
  CommentList,
  CatPost,
  Toast,
} from "../../components";

// ELEMENTS
import { Button, Grid } from "../../elements";

// ICON
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

// REDUX
import { history } from "../../redux/configureStore";
import { __getCatInfo, _deleteToast } from "../../redux/modules/cat";
import { __getComment } from "../../redux/modules/comment";

const CatDetail = (props) => {
  const dispatch = useDispatch();
  let location = props.location.state?.location;
  const catId = props.match.params?.catId;
  const menu = props.match.params?.menu;
  const village = props.match.params?.village;
  const cat = useSelector((state) => state.cat.catinfo);
  const commentList = useSelector((state) => state.comment.list);
  const deleteToast = useSelector((state) => state.cat.deleteToast);
  const userInfo = useSelector((state) => state.mypage.userInfo);

  // 동네 이름 설정
  if (location === undefined) {
    location = props.match.params.village;
  }
  if (
    userInfo.locationList &&
    location === userInfo?.locationList[0]?.split(" ")[2]
  ) {
    location = userInfo?.locationList[0];
  } else if (
    userInfo.locationList &&
    location === userInfo?.locationList[1]?.split(" ")[2]
  ) {
    location = userInfo?.locationList[1];
  } else if (
    userInfo.locationList &&
    location === userInfo?.locationList[2]?.split(" ")[2]
  ) {
    location = userInfo?.locationList[2];
  }

  // 고양이 정보 가져오기
  useEffect(() => {
    dispatch(__getCatInfo(catId));
  }, [catId, dispatch]);

  // 댓글 가져오기
  useEffect(() => {
    dispatch(__getComment(catId));
  }, [catId, commentList.length, dispatch]);

  // 삭제 시 확인 토스트
  useEffect(() => {
    if (deleteToast) {
      setTimeout(() => {
        dispatch(_deleteToast(false));
      }, 1500);
    }
  }, [deleteToast, dispatch]);
  
  return (
    <>
      <Template props={props}>
        {deleteToast && <Toast message="게시물 삭제 완료!" />}
        <CatPost cat={cat} location={location} path="detail" />
        <Grid
          alignItems="center"
          addstyle={() => {
            return css`
              border-bottom: 2px solid #cbcf5e;
              margin-bottom: 5px;
              ${flexBox("flex-start")}
            `;
          }}
        >
          <Button
            clickEvent={() => {
              history.push(`/catdetail/calendar/${village}/${catId}`);
            }}
            color={menu === "calendar" ? "olive" : "black"}
            margin="0 8%"
            fontSize="1em"
            fontWeight="800"
          >
            캘린더
          </Button>

          <Button
            clickEvent={() => {
              history.push(`/catdetail/diary/${village}/${catId}`);
            }}
            color={menu === "diary" ? "olive" : "black"}
            fontSize="1em"
            fontWeight="800"
          >
            집사일기
          </Button>

          <Button
            clickEvent={() => {
              history.push(`/catdetail/gallery/${village}/${catId}`);
            }}
            color={menu === "gallery" ? "olive" : "black"}
            margin="0 0 0 8%"
            fontSize="1em"
            fontWeight="800"
          >
            갤러리
          </Button>
        </Grid>

        {menu === "calendar" ? (
          <CatCalendar catId={catId} location={location} />
        ) : menu === "diary" ? (
          <CatDiary catId={catId} location={location} />
        ) : menu === "gallery" ? (
          <CatGallery catId={catId} location={location} />
        ) : null}
        {userInfo.locationList &&
        (location === userInfo?.locationList[0] ||
          location === userInfo?.locationList[1] ||
          location === userInfo?.locationList[2]) ? (
          <Button
            is_float="is_float"
            clickEvent={() => {
              history.push({
                pathname: `/map/${location?.split(" ")[2]}/${catId}`,
                state: { catId, location: location?.split(" ")[2] },
              });
            }}
          >
            <FontAwesomeIcon icon={faPencilAlt} style={{ width: "20px" }} />
          </Button>
        ) : null}

        <CommentList props={commentList} path="CatDetail" catId={catId} />
      </Template>
    </>
  );
};

export default CatDetail;
