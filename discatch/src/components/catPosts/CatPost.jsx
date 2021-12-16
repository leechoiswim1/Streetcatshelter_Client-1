// LIBRARY
import React from "react";
import { useDispatch } from "react-redux";

// STYLE
import styled from "styled-components";

// ICON
import FavoriteIcon from "@material-ui/icons/Favorite";
import { MoreHorizontal } from "react-feather";

// REDUX
import { history } from "../../redux/configureStore";
import { __catLike } from "../../redux/modules/cat";

const CatPost = ({ cat, path, location }) => {
  const dispatch = useDispatch();
  const catId = cat.catId;
  const userLiked = cat.userLiked;

  // 고양이 기본 정보 게시물 좋아요 토글
  const likeToggle = () => {
    dispatch(__catLike(catId, path));
  };

  // 고양이 게시물 상세보기
  const catDetailBtn = () => {
    if (path !== "detail") {
      history.push({
        pathname: `/catdetail/calendar/${location.split(" ")[2]}/${cat.catId}`,
        state: { location },
      });
    } else return;
  };

  return (
    <CatPostStyle>
      <LeftBox>
        <CatImage
          src={cat.catImage}
          alt={cat.catImage}
          onClick={catDetailBtn}
        />
      </LeftBox>

      <RightBox>
        <Header>
          <div style={{ display: "flex" }}>
            <p onClick={catDetailBtn}>
              이름: {cat.catName ? cat.catName : "이름을 지어주세요!"}
            </p>

            <p onClick={catDetailBtn}> 중성화: {cat.neutering}</p>
          </div>
          {path === "detail" && (
            <MoreHorizontalBtn
              style={{
                color: "rgb(249, 200, 82)",
                marginRight: "15px",
                cursor: "pointer",
              }}
              onClick={() =>
                history.push({
                  pathname: `/catinfoedit/${catId}`,
                  state: { location },
                })
              }
            />
          )}
        </Header>
        <BodyBox>
          <TagOutBox onClick={catDetailBtn}>
            {cat.catTagList?.map((tag, idx) => {
              return <TagBox key={idx}>#{tag.tag}</TagBox>;
            })}
          </TagOutBox>
          <LikeBox>
            {" "}
            <FavoriteIcon
              onClick={likeToggle}
              style={{
                position: "relative",
                left: "12px",
                color: userLiked ? "red" : "gray",
                cursor: "pointer",
              }}
            />
          </LikeBox>
        </BodyBox>
      </RightBox>
    </CatPostStyle>
  );
};

const MoreHorizontalBtn = styled(MoreHorizontal)`
  &:hover {
    color: #cbcf52;
  }
`;
const CatPostStyle = styled.div`
  background: rgb(${(props) => props.theme.palette.diaryColor});
  width: 100%;
  height: 80px;
  display: flex;
  margin: 5px auto;
  cursor: pointer;
  p {
    margin: 0px;
    line-height: 20px;
  }
  &:hover {
    filter: brightness(90%);
  }
`;
const LeftBox = styled.div`
  width: 20%;
  min-width: 80px;
  @media screen and (max-width: 320px) {
    width: 25%;
  }
`;
const CatImage = styled.img`
  width: 80px;
  height: 80px;
`;
const RightBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 80px;
  cursor: auto;
  @media screen and (max-width: 400px) {
    width: 75%;
  }
  div {
    p {
      font-size: 14px;
      font-weight: 500;
      @media screen and (max-width: 320px) {
        font-size: 12px;
      }
    }
  }
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  margin: auto;
  p {
    cursor: pointer;
    font-size: 14px;
    margin-left: 5px;
    :nth-child(2) {
      margin-left: 10px;
    }
  }
`;
const BodyBox = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: auto;
  height: 40px;
`;
const TagOutBox = styled.div`
  display: flex;
  width: 85%;
  flex-wrap: wrap;
  overflow: hidden;
  margin-left: 5px;
  @media screen and (max-width: 320px) {
    width: 80%;
  }
`;
const TagBox = styled.div`
  height: 25px;
  width: auto;
  border-radius: 20px;
  margin: 5px 10px 5px 0px;
  padding: 0px 5px 3px 5px;
  font-size: 10px;
  display: flex;
  align-items: center;
  background: #fbd986;
`;
const LikeBox = styled.div`
  width: 24px;
  cursor: auto;
  margin: auto;
  width: 15%;
  @media screen and (max-width: 320px) {
    width: 20%;
  }
`;

export default CatPost;
