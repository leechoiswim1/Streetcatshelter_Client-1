// LIBRARY
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import {
  Template,
  CatPost,
  SecondHeader,
  SecondSpinner,
  EmptyPost,
  Toast,
} from "../../components";

// ELEMENTS
import { Button } from "../../elements";

// ICON
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

// REDUX
import { history } from "../../redux/configureStore";
import {
  __getCatLocation,
  __getMoreCatLocation,
  resetList,
} from "../../redux/modules/cat";

const Home = (props) => {
  const dispatch = useDispatch();
  // 로딩 여부
  const isLoaded = useSelector((state) => state.cat.postLoaded);

  //토스트모달
  const [toastState, setToastState] = useState(false);

  //무한 스크롤
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const catList = useSelector((state) => state.cat.list);

  // 동네 이름
  const stateLocation = props.location.state?.location;
  const userLocation = useSelector((state) => state.map.keywordList[0]);
  const villageList = useSelector((state) => state.mypage.userVillage);
  let location = stateLocation ? stateLocation : villageList[0];
  if (villageList[0] && userLocation === villageList[0]?.split(" ")[2]) {
    location = villageList[0];
  } else if (villageList[1] && userLocation === villageList[1]?.split(" ")[2]) {
    location = villageList[1];
  } else if (villageList[2] && userLocation === villageList[2]?.split(" ")[2]) {
    location = villageList[2];
  }

  // 마이페이지의 첫번째 동네 이름
  const userVillage = useSelector((state) => state.mypage.userVillage[0]);

  // path에 사용할 동네 이름
  const pathLocation = userLocation ? userLocation : userVillage?.split(" ")[2];

  // 동네 이름이 없는 경우 유저 정보 수정 페이지로 이동
  const requestLocationInfo = () => {
    history.push("/userinfoedit");
    setToastState(true);
  };

  // 고양이 기본 정보 가져오기
  useEffect(() => {
    dispatch(resetList());
    if (location?.length !== 3 && location !== undefined) {
      setPage(1);
      dispatch(__getCatLocation(location));
    }
  }, [location, dispatch]);

  // 고양이 기본 정보 추가로 가져오기
  // 무한스크롤
  useEffect(() => {
    // 사용자가 마지막 요소를 보고 있고 catList의 length가 10의 배수인 경우
    if (inView) {
      setPage((prevState) => prevState + 1);
      dispatch(__getMoreCatLocation(location, page + 1));
    } else {
      return;
    }
  }, [inView]);

  // 토스트 모달
  useEffect(() => {
    if (toastState) {
      setTimeout(() => {
        setToastState(false);
      }, 1500);
    }
  }, [toastState]);

  return (
    <>
      {location !== undefined ? (
        <Template props={props} location={pathLocation}>
          {toastState && <Toast message="동네 정보를 입력해주세요!" />}
          <SecondHeader title={`${pathLocation} 고양이들을 소개합니다!`} />
          {catList && catList.length > 0 ? (
            catList.map((cat, idx) => {
              return idx > 0 && idx % 9 === 0 ? (
                <div style={{ width: "100%" }} key={idx} ref={ref}>
                  <CatPost
                    cat={cat}
                    pathLocation={pathLocation}
                    location={location}
                  />
                </div>
              ) : (
                <div style={{ width: "100%" }} key={idx}>
                  <CatPost
                    cat={cat}
                    pathLocation={pathLocation}
                    location={location}
                  />
                </div>
              );
            })
          ) : (
            <EmptyPost path="home" />
          )}
          <SecondSpinner visible={isLoaded} path="scroll" />
          <Button
            is_float="is_float"
            clickEvent={() => {
              history.push({
                pathname: `/map/${pathLocation}`,
                state: { location: pathLocation },
              });
            }}
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
          </Button>{" "}
        </Template>
      ) : (
        <Template props={props} location={pathLocation}>
          <SecondHeader title={"고양이들을 소개합니다!"} />
          <Button
            is_float="is_float"
            clickEvent={() => {
              requestLocationInfo();
            }}
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
      )}
    </>
  );
};

export default Home;
