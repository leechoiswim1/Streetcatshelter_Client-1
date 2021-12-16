// LIBRARY
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import {
  Template,
  CommentList,
  ContentHeader,
  SecondSpinner,
  Toast,
} from "../../components";

// ELEMENTS
import { Grid, Text } from "../../elements";

// STYLE
import styled, { css } from "styled-components";

// REDUX
import { history } from "../../redux/configureStore";
import {
  getOneCommunityDB,
  deleteCommunityDB,
} from "../../redux/modules/community";

const CommunityPostDetail = (props) => {
  const dispatch = useDispatch();

  // 동네 이름
  const pathLocation = props.location.pathname.split("/")[2];

  // 로딩 여부
  const isLoaded = useSelector((state) => state.community.itemDetailLoaded);

  // 토스트 모달
  const [deleteState, setDeleteState] = useState(false);

  // 커뮤니티 글 정보
  const communityId = props.match.params.communityId;
  const communityDetail = useSelector(
    (state) => state.community.communityDetail
  );
  const category = communityDetail.category;
  const location = props.match.params.village;

  // 커뮤니티 글 삭제
  const deleteCommunity = () => {
    setDeleteState(true);
    setTimeout(() => {
      dispatch(deleteCommunityDB(communityId, category, location));
    }, 1000);
  };

  // path에 사용할 카테고리 설정
  let pathCategory;
  if (communityDetail.category?.split(" ")[1] === "정보글") {
    pathCategory = "catinfo";
  } else if (communityDetail.category?.split(" ")[1] === "동네") {
    pathCategory = "gathering";
  } else {
    pathCategory = "sharing";
  }

  // 커뮤니티 상세 정보 가져오기
  useEffect(() => {
    dispatch(getOneCommunityDB(communityId));
  }, [communityId, dispatch]);

  return (
    <Template props={props}>
      <SecondSpinner visible={isLoaded} />
      <ContentHeader
        FirstBtn="수정"
        SecondBtn="삭제"
        FirstClick={() => {
          history.push({
            pathname: `/community/${pathLocation}/${pathCategory}/postedit/${communityId}`,
            state: { location: pathLocation },
          });
        }}
        SecondClick={deleteCommunity}
      />

      <div>
        <Text
          addstyle={() => {
            return css`
              margin: 12px;
              font-size: 16px;
              font-weight: 900;
            `;
          }}
        >
          {communityDetail.title}
        </Text>

        <ImageBox>
          {communityDetail.communityImageList?.map((catImage, idx) => {
            return (
              <CatImageBox key={idx}>
                <CatImage src={catImage.image} alt="catImage" key={idx} />
              </CatImageBox>
            );
          })}
        </ImageBox>

        <Text margin="15px">{communityDetail.contents}</Text>

        <div style={{ margin: "10px 0px" }}>
          <CommentList props={props} communityId={communityId} />
        </div>
      </div>

      {deleteState && <Toast message="게시물 삭제 완료!" />}
    </Template>
  );
};

const CatImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgb(251, 216, 134);
`;
const ImageBox = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;
const CatImageBox = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: rgb(251, 216, 134);
`;

export default CommunityPostDetail;
