// LIBRARY
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import {
  MyPageDetail,
  Profile,
  Template,
  MyPageCatPost,
  SecondSpinner,
  EmptyPost,
} from "../../components";

// STYLE
import styled from "styled-components";

// REDUX
import { mypageActions, resetList } from "../../redux/modules/mypage";

const MyPage = (props) => {
  const dispatch = useDispatch();
  const location = props.location.state?.location;
  const likedAllCat = useSelector((state) => state.mypage.likedAllCat);
  const isLoaded = useSelector((state) => state.mypage.itemLoaded);

  // 좋아요를 누른 고양이 가져오기
  useEffect(() => {
    dispatch(resetList());
    setPage(1);
    dispatch(mypageActions._getLikedAllCat());
  }, [dispatch]);

  // 무한스크롤
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    // 사용자가 마지막 요소를 볼때
    if (inView) {
      setPage((prevState) => prevState + 1);
      dispatch(mypageActions._getMoreLikedAllCat(page + 1));
    } else {
      return;
    }
  }, [inView]);

  return (
    <>
      <Template props={props}>
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ margin: "10px auto" }}>
            <Profile location={location} />
          </div>

          <MyPageDetail menu="myCat" location={location} />
          <CatPostStyle>
            <div>
              {likedAllCat && likedAllCat.length > 0 ? (
                likedAllCat.map((LikedCat, idx) => {
                  return idx === likedAllCat.length - 1 ? (
                    <div style={{ width: "100%" }} key={idx} ref={ref}>
                      <MyPageCatPost LikedCat={LikedCat} location={location} />
                    </div>
                  ) : (
                    <div style={{ width: "100%" }} key={idx}>
                      <MyPageCatPost LikedCat={LikedCat} location={location} />
                    </div>
                  );
                })
              ) : (
                <EmptyPost path="mypage" />
              )}
            </div>
          </CatPostStyle>
          <SecondSpinner visible={isLoaded} path="scroll" />
        </div>
      </Template>
    </>
  );
};

const CatPostStyle = styled.div`
  height: 80%;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

export default MyPage;
