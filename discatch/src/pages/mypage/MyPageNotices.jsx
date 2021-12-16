// LIBRARY
import React, { useEffect } from "react";

// STYLE
import styled from "styled-components";

// COMPONENTS
import {
  MyPageDetail,
  Profile,
  Template,
  NoticeDesc,
  SecondSpinner,
} from "../../components";

// REDUX
import { mypageActions } from "../../redux/modules/mypage";
import { useDispatch, useSelector } from "react-redux";

const MyPageNotices = (props) => {
  const dispatch = useDispatch();
  const id = props.match.params.noticeId;
  const isLoaded = useSelector((state) => state.mypage.itemLoaded);

  // 공지사항 디테일 가져오기
  useEffect(() => {
    dispatch(mypageActions._getOneNotice(id));
  }, [id, dispatch]);

  return (
    <Template props={props}>
      <div
        style={{
          overflowX: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ margin: "10px auto" }}>
          <Profile />
        </div>
        <MyPageDetail menu="notice" />
        <Title>
          <p>📢NOTICE</p>
        </Title>
        <NoticeDesc />
      </div>
      <SecondSpinner visible={isLoaded} />
    </Template>
  );
};

const Title = styled.div`
  height: 40px;
  width: 100%;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  background: #fbd986;
  border-radius: 10px;
  p {
    text-align: center;
    font-weight: 900;
    font-size: 24px;
    color: #000000;
    margin: auto;
  }
`;

export default MyPageNotices;
