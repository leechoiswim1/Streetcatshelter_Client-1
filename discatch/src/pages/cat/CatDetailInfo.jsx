// LIBRARY
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// STYLE
import { flexBox } from "../../shared/style";
import styled, { css } from "styled-components";

// ELEMENTS
import { Grid, Text, Button } from "../../elements";

// COMPONENTS
import {
  Template,
  CommentList,
  Spinner,
  ContentHeader,
  SecondHeader,
} from "../../components";

// ICON
import { CheckSquare } from "react-feather";
import FavoriteIcon from "@material-ui/icons/Favorite";

// REDUX
import {
  __getCatDetail,
  __deleteCatDetail,
  __catDiaryLike,
} from "../../redux/modules/cat";
import { __getDetailComment } from "../../redux/modules/comment";
import { history } from "../../redux/configureStore";

const CatDetailInfo = (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.mypage.userInfo);
  const isLoaded = useSelector((state) => state.mypage.isLoaded);
  const commentList = useSelector((state) => state.comment.list);
  const catDetailId = props.match.params.catDetailId;
  const village = props.match.params.village;
  const detail = useSelector((state) => state.cat.detail);

  // 동네 이름 설정
  let location;
  if (
    userInfo.locationList &&
    village === userInfo.locationList[0]?.split(" ")[2]
  ) {
    location = userInfo.locationList[0];
  } else if (
    userInfo.locationList &&
    village === userInfo.locationList[1]?.split(" ")[2]
  ) {
    location = userInfo.locationList[1];
  } else if (
    userInfo.locationList &&
    village === userInfo.locationList[2]?.split(" ")[2]
  ) {
    location = userInfo.locationList[2];
  }

  // 고양이 상세 정보 좋아요 토글
  const likeToggle = () => {
    const path = "diary";
    dispatch(__catDiaryLike(catDetailId, path));
  };

  // 고양이 상세 정보 가져오기
  useEffect(() => {
    dispatch(__getCatDetail(catDetailId));
  }, [catDetailId, dispatch]);

  // 댓글 가져오기
  useEffect(() => {
    dispatch(__getDetailComment(catDetailId));
  }, [catDetailId, commentList.length, dispatch]);

  // 고양이 상세 정보 삭제하기
  const deleteCatDetail = () => {
    dispatch(__deleteCatDetail(catDetailId));
  };

  // 고양이 상세 정보 수정 페이지로 이동
  const editCatDetail = () => {
    history.push({
      pathname: `/catdetailinfoedit/${catDetailId}`,
      state: { location },
    });
  };

  return (
    <>
      <Spinner visible={isLoaded} />
      <Template props={props}>
        <SecondHeader title="집사일기" />
        <ContentHeader
          path="catdetail"
          FirstBtn="수정"
          SecondBtn="삭제"
          FirstClick={editCatDetail}
          SecondClick={deleteCatDetail}
        />
        <ImageBox>
          {detail.catImages &&
            detail.catImages.map((catImage, idx) => {
              return (
                <CatImageBox key={idx}>
                  <CatImage src={catImage} alt="catImage" />
                </CatImageBox>
              );
            })}
        </ImageBox>

        <Grid
          margin="5% 0"
          addstyle={() => {
            return css`
              ${flexBox()}
            `;
          }}
        >
          <Grid
            addstyle={() => {
              return css`
                ${flexBox()}
              `;
            }}
          >
            <Text fontWeight="bold">급수</Text>
            <CheckSquare color={detail.water === false ? "black" : "#cbcf5e"} />
          </Grid>

          <Grid
            addstyle={() => {
              return css`
                ${flexBox()}
              `;
            }}
          >
            <Text fontWeight="bold">사료</Text>
            <CheckSquare color={detail.food === false ? "black" : "#cbcf5e"} />
          </Grid>

          <Grid
            addstyle={() => {
              return css`
                ${flexBox()}
              `;
            }}
          >
            <Text fontWeight="bold">간식</Text>
            <CheckSquare color={detail.snack === false ? "black" : "#cbcf5e"} />
          </Grid>
        </Grid>

        <Grid
          bgColor="diaryColor"
          padding="20px"
          addstyle={() => {
            return css`
              display: flex;
              flex-direction: column;
            `;
          }}
        >
          <Text margin="0 0 5% 0" fontWeight="500">
            {detail.diary}
          </Text>

          <Grid
            addstyle={() => {
              return css`
                width: 100%;
                display: flex;
                justify-content: space-between;
              `;
            }}
          >
            <Grid
              width="90%"
              display="flex"
              addstyle={() => {
                return css`
                  flex-wrap: wrap;
                `;
              }}
            >
              {detail.catTags && detail.catTags.length > 0 ? (
                detail.catTags.map((tag, idx) => {
                  return (
                    <Grid
                      key={idx}
                      width="auto"
                      bgColor="yellow"
                      height="25px"
                      radius="20px"
                      margin="5px 10px 5px 0px "
                      padding="0px 5px 3px 5px"
                      addstyle={() => {
                        return css`
                          font-size: 10px;
                          display: flex;
                          align-items: center;
                        `;
                      }}
                    >
                      <Text>#{tag}</Text>
                    </Grid>
                  );
                })
              ) : (
                <></>
              )}
            </Grid>
            <Grid
              width="10%"
              height="auto"
              addstyle={() => {
                return css`
                  display: flex;
                  justify-content: flex-end;
                  align-items: flex-end;
                `;
              }}
            >
              <Button
                bgColor="diaryColor"
                color={detail.userLiked ? "red" : "black"}
                clickEvent={likeToggle}
                addstyle={() => {
                  return css`
                    padding: 0px;
                    line-height: 20px;
                  `;
                }}
              >
                <FavoriteIcon />
              </Button>
              {detail.likeCnt ? (
                <Text
                  addstyle={() => {
                    return css`
                      line-height: 24px;
                      font-weight: bold;
                      margin: 0px 5px;
                    `;
                  }}
                >
                  {detail.likeCnt}
                </Text>
              ) : (
                ""
              )}
            </Grid>
          </Grid>
        </Grid>
        <CommentList
          props={commentList}
          path="CatDetailInfo"
          catId={catDetailId}
        />
      </Template>
    </>
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
  margin-bottom: 5px;
`;

export default CatDetailInfo;
