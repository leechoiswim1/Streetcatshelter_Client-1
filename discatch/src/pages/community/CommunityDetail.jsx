// LIBRARY
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import {
  Template,
  CommunityPost,
  SecondHeader,
  SecondSpinner,
  EmptyPost,
  Toast,
} from "../../components";

// STYLE
import styled from "styled-components";

// ELEMENTS
import { Button } from "../../elements/index";

// ROUTE
import { useLocation, useParams } from "react-router-dom";

//ICON
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

// REDUX
import {
  getCommunityDB,
  getMoreCommunityDB,
  resetList,
  errorToast,
} from "../../redux/modules/community";
import { history } from "../../redux/configureStore";

const CommunityDetail = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const path = useLocation();

  // 카테고리에 따른 커뮤니티 리스트
  const communityList = useSelector((state) =>
    params.category === "catinfo"
      ? state.community.catInfo
      : params.category === "gathering"
      ? state.community.gathering
      : state.community.sharing
  );
  // 로딩 여부
  const loading = useSelector((state) => state.community.itemLoaded);

  // 토스트 모달
  const toastState = useSelector((state) => state.community.toast);

  // 무한 스크롤
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  // 동네 이름
  const location = props.match.params.village;

  // pathname에 따른 카테고리 분류
  let category = null;
  let nextPath = null;
  if (path.pathname === `/community/${location}/catinfo`) {
    category = "고양이 정보글";
    nextPath = "catinfo";
  } else if (path.pathname === `/community/${location}/gathering`) {
    category = `${location} 동네 모임`;
    nextPath = "gathering";
  } else if (path.pathname === `/community/${location}/sharing`) {
    category = `${location} 고양이 용품 나눔`;
    nextPath = "sharing";
  }

  // 커뮤니티 글 가져오기
  useEffect(() => {
    dispatch(resetList());
    setPage(1);
    dispatch(getCommunityDB(category, location, page));
  }, [category, location, dispatch]);

  // 커뮤니티 글 추가로 가져오기
  useEffect(() => {
    if (
      inView &&
      communityList.length > 9 &&
      communityList.length / 10 === page
    ) {
      setPage((prevState) => prevState + 1);
      dispatch(getMoreCommunityDB(category, location, page + 1));
    } else {
      return;
    }
  }, [inView, dispatch]);

  // 토스트 모달
  useEffect(() => {
    if (toastState) {
      setTimeout(() => {
        dispatch(errorToast(false));
      }, 1500);
    }
  }, [toastState, dispatch]);

  return (
    <Template props={props}>
      {toastState && <Toast message="페이지에 오류가있어요" />}
      <SecondHeader title={category} path="scroll" />
      <CommunityDetailStyle>
        {communityList && communityList.length > 0 ? (
          communityList.map((community, idx) => {
            return (
              <div style={{ width: "100%" }} key={idx} ref={ref}>
                <CommunityPost community={community} />
              </div>
            );
          })
        ) : (
          <EmptyPost path="community" />
        )}
      </CommunityDetailStyle>
      <SecondSpinner visible={loading} path="scroll" />
      <Button
        clickEvent={() =>
          history.push(`/community/${location}/${nextPath}/write`)
        }
        is_float="is_float"
      >
        <FontAwesomeIcon
          icon={faPencilAlt}
          style={{
            position: "relative",
            width: "20px",
            cursor: "pointer",
            height: "20px",
            marginBottom: "10px",
          }}
        />
      </Button>
    </Template>
  );
};

const CommunityDetailStyle = styled.div`
  height: 80%;
  width: 100%;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default CommunityDetail;
