// LIBRARY
import React from "react";
import { useDispatch, useSelector } from "react-redux";

// ELEMENTS
import { Grid, Text } from "../../elements/index";

// ROUTE
import { useLocation } from "react-router-dom";

// STYLE
import styled, { css } from "styled-components";

// ICON
import FavoriteIcon from "@material-ui/icons/Favorite";

// REDUX
import { communityLikeToggleDB } from "../../redux/modules/community";

const Comment = ({ path }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const commentList = useSelector((state) => state.comment.list);
  const communityDetail = useSelector(
    (state) => state.community.communityDetail
  );
  const communityId = communityDetail.communityId;

  // 커뮤니티 좋아요 토글
  const updateLikes = () => {
    dispatch(communityLikeToggleDB(communityId));
  };

  return (
    <Grid
      margin="30px auto 15px auto"
      addstyle={() => {
        return css`
          position: relative;
          bottom: 15px;
          display: flex;
          border-bottom: 1px solid rgb(${(props) => props.theme.palette.olive});
        `;
      }}
    >
      <Grid
        addstyle={() => {
          return css`
            display: flex;
            margin: 0px 0px 10px 10px;
            height: 20px;
          `;
        }}
      >
        <Text
          fontWeight="700"
          size="16px"
          margin="0px 5px 0px 0px"
          addstyle={() => {
            return css`
              line-height: 20px;
            `;
          }}
        >
          댓글
        </Text>
        <Count>
          {path === "CatDetail" || path === "CatDetailInfo"
            ? String(commentList.length).length > 3
              ? `${String(commentList.length)[0]}${"0".repeat(
                  String(commentList.length).length - 4
                )}K`
              : commentList.length
            : communityDetail.commentList?.length}
        </Count>
      </Grid>

      {location.pathname.split("/")[1] === "community" && (
        <Grid
          addstyle={() => {
            return css`
              display: flex;
            `;
          }}
        >
          <Grid></Grid>
          <Grid
            addstyle={() => {
              return css`
                display: flex;
                margin: 0 0 0 60px;
              `;
            }}
          >
            <Grid>
              <FavoriteIcon
                onClick={updateLikes}
                style={{
                  color: communityDetail.liked ? "red" : "gray",
                  position: "relative",
                  bottom: "2px",
                  cursor: "pointer",
                }}
              />
            </Grid>
            <Text
              fontWeight="bold"
              margin="0 0 0 -25px"
              width="40px"
              addstyle={() => {
                return css`
                  @media screen and (max-width: 280px) {
                    margin: 0 0 0 -10px;
                  }
                  @media screen and (max-height: 568px) {
                    margin: 0;
                  }
                `;
              }}
            >
              {communityDetail.cntLikeit}
            </Text>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

const Count = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  line-height: 20px;
  background: #f9c852;
`;

export default Comment;
