// LIBRARY
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import { Toast } from "../";

// STYLE
import styled from "styled-components";

// ROUTE
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

// ICON
import { ArrowLeft, Bell, Search } from "react-feather";

// REDUX
import { history } from "../../redux/configureStore";
import { searchMap } from "../../redux/modules/map";
import { mypageActions } from "../../redux/modules/mypage";
import { changeToast } from "../../redux/modules/chat";

const Header = (props) => {
  const dispatch = useDispatch();
  const locationA = useLocation();
  const path = props.path;
  const token = localStorage.getItem("token");
  const userInfo = useSelector((state) => state.mypage.userInfo);
  let location;
  const firstLocation = locationA.state?.location;
  const category = locationA.pathname.split("/")[3];

  // 토스트 모달
  const [toastState, setToastState] = useState(false);
  const chatToastState = useSelector((state) => state.chat.toast);

  //동네 설정
  const userLocation = useSelector((state) => state.map.keywordList[0]);
  location = userLocation ? userLocation : firstLocation;

  if (
    path === "/catdetailinfo/:village/:catDetailId" ||
    path === "/catdetail/:menu/:village/:catId/1" ||
    path === "/community/:menu/:village/:category/postdetail/:communityId" ||
    path === "/catinfowrite/:location"
  ) {
    location = locationA.pathname.split("/")[2];
  } else if (path === "/catdetail/:menu/:village/:catId") {
    location = locationA.pathname.split("/")[3];
  }

  if (
    userInfo.locationList &&
    !userInfo.locationList.join("").includes(location)
  ) {
    location = userInfo?.locationList[0]?.split(" ")[2];
  }

  if (userInfo.locationList && location === undefined) {
    location = userInfo?.locationList[0]?.split(" ")[2];
  }

  if (location?.split(" ").length === 3) {
    location = location?.split(" ")[2];
  }

  const sameLocationList = userInfo.locationList?.filter(
    (v) => v.split(" ")[2] === location
  );

  const locationList = userInfo.locationList?.filter(
    (v) => v.split(" ")[2] !== location
  );

  let location2;
  let location3;
  if (userInfo.locationList !== undefined && sameLocationList.length === 1) {
    if (userInfo.locationList.length === 3) {
      location2 = locationList[0]?.split(" ")[2];
      location3 = locationList[1]?.split(" ")[2];
    } else if (userInfo.locationList.length === 2) {
      location2 = locationList[0]?.split(" ")[2];
    }
  } else if (
    userInfo.locationList !== undefined &&
    sameLocationList.length === 2
  ) {
    location = sameLocationList[0]?.split(" ")[2];
    location2 = sameLocationList[1]?.split(" ")[2];
    location3 = locationList[0]?.split(" ")[2];
  } else if (
    userInfo.locationList !== undefined &&
    sameLocationList.length === 3
  ) {
    location = sameLocationList[0]?.split(" ")[2];
    location2 = sameLocationList[1]?.split(" ")[2];
    location3 = sameLocationList[2]?.split(" ")[2];
  }

  const [place, setPlace] = useState(location);
  // const [openAlram, setOpenAlram] = useState(false);

  //랜더시 첫번째 로케이션을 가져온다
  useEffect(() => {
    dispatch(searchMap(firstLocation));
  }, [firstLocation, dispatch]);

  //랜더시 유저 인포를 가져온다.
  useEffect(() => {
    if (!token) {
      return;
    } else {
      dispatch(mypageActions._getUserInfo());
    }
  }, [dispatch]);

  let options;
  if (location !== undefined && location2 === undefined) {
    options = [{ key: 1, value: location }];
  } else if (
    location !== undefined &&
    location2 !== undefined &&
    location3 === undefined
  ) {
    options = [
      { key: 1, value: location },
      { key: 2, value: location2 },
    ];
  } else if (
    location !== undefined &&
    location2 !== undefined &&
    location3 !== undefined
  ) {
    options = [
      { key: 1, value: location },
      { key: 2, value: location2 },
      { key: 3, value: location3 },
    ];
  }
  //동네 변경 함수
  const onChangeHandler = (e) => {
    setPlace(e.target.value);
    const keyword = e.target.value;
    dispatch(searchMap(keyword));
  };
  //뒤로가기 함수
  const goBack = () => {
    if (path === "/community/:village/:category") {
      history.push({ pathname: "/community", state: { location } });
    } else if (
      path === "/community/:village/:category/postdetail/:communityId"
    ) {
      history.push({
        pathname: `/community/${location}/${category}`,
        state: { location },
      });
    } else if (path === "/catdetail/:menu/:village/:catId/2") {
      history.push({ pathname: `/map/${location}`, state: { location } });
    } else if (path === "/catdetail/:menu/:village/:catId/1") {
      history.push({ pathname: "/mypage", state: { location } });
    } else if (path === "/catdetail/:menu/:village/:catId") {
      history.push({ pathname: "/", state: { location } });
    } else if (path === "/community/:village/:category/write") {
      history.push({
        pathname: `/community/${location}/${category}`,
        state: { location },
      });
    } else {
      history.goBack();
    }
  };

  // 토스트 모달
  useEffect(() => {
    if (toastState) {
      setTimeout(() => {
        setToastState(false);
      }, 1500);
    }
  }, [toastState]);
  useEffect(() => {
    if (chatToastState) {
      setTimeout(() => {
        dispatch(changeToast(false));
      }, 1500);
    }
  }, [chatToastState, dispatch]);

  if (!userInfo) {
    return <div></div>;
  }

  return (
    <HeaderStyle>
      <HeaderInner>
        <SideBtnBox>
          {path === "/" || path === "/community" || path === "/map/:village" ? (
            <SelectStyle onChange={onChangeHandler} value={place}>
              {options &&
                options.map((pl, idx) => (
                  <option key={pl.key} value={pl.value}>
                    {pl.value}
                  </option>
                ))}
            </SelectStyle>
          ) : (
            <ArrowLeft
              style={{ margin: "18px", color: "gray" }}
              onClick={goBack}
            />
          )}
        </SideBtnBox>
        <Head>
          <Link
            to="/"
            style={{ margin: "0 auto", width: "60%", textDecoration: "none" }}
          >
            <p>
              dis<span>C</span>
              <span>A</span>
              <span>T</span>ch
            </p>{" "}
          </Link>
        </Head>
        <SideBtnBox>
          {/* <SearchBtn
            onClick={() => {
              // setSearchModal(!searchModal);
              alert("준비중입니다.");
            }}
          /> */}

          <Bell
            onClick={() => {
              setToastState(true);
            }}
          />
        </SideBtnBox>
      </HeaderInner>
      {/* {searchModal ? (
        <div width="100%" height="45px" background="#fefdf8">
          <SearchBar>
            <SearchInput />
            <SearchBarBtn>
              <p>검색</p>
            </SearchBarBtn>
          </SearchBar>
        </div>
      ) : (
        ""
      )} */}
      {toastState && <Toast message="버전2에서 준비중입니다." />}
      {chatToastState && (
        <Toast
          message="채팅방 만들기에 실패하였습니다."
          message2="다시 한번 시도해주세요."
        />
      )}
    </HeaderStyle>
  );
};

const HeaderInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const SideBtnBox = styled.div`
  margin: auto;
  width: 25%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  svg {
    color: gray;
    margin: 18px auto;
    cursor: pointer;
    @media screen and (max-width: 400px) {
      width: 20px;
      height: 20px;
    }
  }
  @media screen and (max-width: 320px) {
    width: 25%;
  }
`;
// const SearchInput = styled.input`
//   width: 90%;
//   height: 30px;
//   border: none;
//   margin-left: 10px;
// `;
// const SearchBarBtn = styled.div`
//   width: 50px;
//   height: 35px;
//   border-radius: 15px;
//   background: #fbd986;
//   margin: auto;
//   p {
//     margin: 5px;
//     font-weight: 900;
//   }
// `;
// const SearchBar = styled.div`
//   width: 90%;
//   height: 35px;
//   border-radius: 15px;
//   border: 1px solid #fbd986;
//   margin: auto;
//   display: flex;
//   background: #fefdf8;
// `;
// const SearchBtn = styled(Search)`
//   cursor: pointer;
// `;
const HeaderStyle = styled.header`
  max-width: 420px;
  width: 100%;
  height: 60px;
  background: #fefdf8;
  position: fixed;
  top: 0;
  z-index: 9;
`;
const SelectStyle = styled.select`
  width: 100%;
  height: 25px;
  margin: 20px 10px;
  border: none;
  color: gray;
  font-weight: bold;
  font-size: 12px;
  background: #fefdf8;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;
const Head = styled.div`
  width: 50%;
  margin: auto;
  text-align: center;
  p {
    height: 60px;
    line-height: 60px;
    margin: 0px auto;
    font-size: 35px;
    font-weight: 900;
    color: #fbd986;
    @media screen and (max-width: 359px) {
      font-size: 30px;
    }
    @media screen and (max-width: 320px) {
      font-size: 25px;
    }
  }
  span {
    font-size: 45px;
    font-weight: 900;
    color: #cbcf52;
    @media screen and (max-width: 359px) {
      font-size: 40px;
    }
    @media screen and (max-width: 320px) {
      font-size: 35px;
    }
    :nth-child(2) {
      color: #d19b61;
    }
  }
`;

export default Header;
