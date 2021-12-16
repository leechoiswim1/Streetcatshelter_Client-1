/*global kakao*/
import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchKeywordMap } from "../../redux/modules/map";

// COMPONENTS
import { Toast } from "../";

// ROUTE
import { useLocation } from "react-router-dom";

// STYLE
import styled, { css } from "styled-components";

// ELEMENTS
import { Button, Grid } from "../../elements";

// ICON
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { X } from "react-feather";
import { RefreshCcw } from "react-feather";

// REDUX
import { history } from "../../redux/configureStore";
import { __getAllCatLocation } from "../../redux/modules/cat";

const Location = (props) => {
  const dispatch = useDispatch();
  const path = useLocation();
  const catId = props.props.match.params.id;
  const pathLength = path.pathname.split("/").length;
  const catList = useSelector((state) => state.cat.list);

  // 동네 이름
  let location;
  const villageKeyword = useSelector((state) => state.map.keywordList[0]);
  location = villageKeyword;
  const villageList = useSelector((state) => state.mypage.userVillage);
  if (location === villageList[0]?.split(" ")[2]) {
    location = villageList[0];
  } else if (location === villageList[1]?.split(" ")[2]) {
    location = villageList[1];
  } else if (location === villageList[2]?.split(" ")[2]) {
    location = villageList[2];
  }

  // 고양이 정보 작성 페이지로 이동할 때 넘겨줄 위도와 경도
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  // 토스트 모달
  const [toastState, setToastState] = useState(false);
  const [searchToastState, setSearchToastState] = useState(false);
  const [keywordToastState, setKeywordToastState] = useState(false);

  // 고양이 지도에 표시하기
  const showCats = () => {
    const mapContainer = document.getElementById("myMap"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(0, 0), // 지도의 중심좌표
        level: 2, // 지도의 확대 레벨
      };
    const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
    const mapTypeControl = new kakao.maps.MapTypeControl();

    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    // 지도 마커 표시하기
    const marker = new kakao.maps.Marker({ position: map.getCenter() });

    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

    for (let i = 0; i < position.length; i++) {
      // 마커 이미지의 이미지 크기 입니다
      const imageSize = new kakao.maps.Size(24, 35);
      // 마커 이미지를 생성합니다
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다

      const iwContent = `
        <div style="display:flex">
          <div style="width: 80px; height: 80px; border-radius:80px;">
            <img width="80" 
                 height="80"
                 border-radius="80"
                 src="${position[i].catImage}" 
                 alt="고양이 사진">
          </div>
          <div style="display: flex; 
                      width: 80px; 
                      height: 80px; 
                      justify-content: center; 
                      align-items: center;">
            <button 
              onclick="location.href='/catdetail/calendar/${villageKeyword}/${position[i].catId}/2'" 
              style="width: 70px;
                     height: 70px;
                     box-shadow: 3px 3px lightgray;
                     border: 0;
                     border-radius: 10px;
                     background-color: #fbd986;
                     cursor: pointer;">
                    ${position[i].catName}
                    <div>보러 가기</div>
            </button>
          </div>
        </div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
        iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

      // 인포윈도우를 생성합니다
      const infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable,
      });

      // 마커를 생성합니다
      const markers = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: position[i].latlng, // 마커를 표시할 위치
        title: catList[i].catName, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image: markerImage, // 마커 이미지
      });

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(markers, "click", function () {
        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map, markers);
      });

      // 지도에 마커를 표시합니다.
      kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        //클릭한 위도, 경도 정보를 가져옵니다.
        const latlng = mouseEvent.latLng;
        //위도 경도 값을 useState를 이용해서 useEffect 밖으로 빼냅니다.
        setLatitude(latlng.getLat());
        setLongitude(latlng.getLng());
        //마커 위치를 클릭한 위치로 옮깁니다.
        marker.setPosition(latlng);
        //마커를 지도상에 보여줍니다.
        marker.setMap(map);
        // 지도에 마커를 표시하면 인포윈도우 닫기
        infowindow.close();
      });
    }

    // 사용자의 주소 지도에 표시
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(location, placesSearchCB);

    // 고양이 마커 가져오기
    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();

        for (let i = 0; i < data.length; i++) {
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
      }
    }
  };

  // 고양이 정보를 이용해 마커를 표시할 때 사용하는 배열 생성
  const positions = [];
  const makePosition = () => {
    for (let i = 0; i < catList.length; i++) {
      positions.push({
        catName: catList[i].catName,
        latlng: new kakao.maps.LatLng(
          catList[i].latitude,
          catList[i].longitude
        ),
        catId: catList[i].catId,
        catImage: catList[i].catImage,
      });
    }
    return positions;
  };
  const position = useMemo(() => makePosition(), [catList]);

  // 검색에 필요한 정보
  const [searchKeyword, setSearchKeyword] = useState("");
  const [Pagination, SetPagination] = useState("");
  const [Places, setPlaces] = useState([]);
  const PlaceVisible = Places.length === 0 ? 0 : 1;
  const [listvisible, setListVisible] = useState(0);
  const [modal, setModal] = useState(0);
  const typeVillageKeyword = location + searchKeyword;

  const ChangeKeyword = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 검색하기
  const CreateKeyword = () => {
    setSearchKeyword("");
    if (searchKeyword === "") {
      setSearchToastState(true);
      return;
    }
    dispatch(searchKeywordMap(searchKeyword));
    const iwRemoveable = true;
    var infowindow = new kakao.maps.InfoWindow({
      zIndex: 1,
      removable: iwRemoveable,
    });
    const container = document.getElementById("myMap");
    const options = {
      center: new kakao.maps.LatLng(0, 0),
      level: 2,
    };
    const map = new kakao.maps.Map(container, options);
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(typeVillageKeyword, placesSearchCB);

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        // 페이지 목록 보여주는 displayPagination() 추가
        displayPagination(pagination);
        setPlaces(data);
      } else {
        setModal(0);
        setTimeout(() => {
          setKeywordToastState(true);
        }, 100);
        showCats();
      }
    }

    // 검색결과 목록 하단에 페이지 번호 표시
    function displayPagination(pagination) {
      SetPagination(pagination);
      var paginationEl = document.getElementById("pagination"),
        fragment = document.createDocumentFragment(),
        i;
      // 기존에 추가된 페이지 번호 삭제
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }
      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement("a");
        el.innerHTML = i;
        if (i === pagination.current) {
          el.className = "on";
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            };
          })(i);
        }
        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    }
    function displayMarker(place) {
      // 지도 마커 표시하기
      const catMarker = new kakao.maps.Marker({ position: map.getCenter() });

      const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

      for (let i = 0; i < position.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        const imageSize = new kakao.maps.Size(24, 35);

        // 마커 이미지를 생성합니다
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
        let iwContent = `
          <div style="display:flex">
            <div style="width: 80px; height: 80px; border-radius:80px;">
              <img width="80" 
                  height="80"
                  border-radius="80"
                  src="${position[i].catImage}" 
                  alt="고양이 사진">
            </div>
            <div style="display: flex; 
                        width: 80px; 
                        height: 80px; 
                        justify-content: center; 
                        align-items: center;">
              <button 
                onclick="location.href='/catdetail/calendar/${villageKeyword}/${position[i].catId}/2'" 
                style="width: 70px;
                      height: 70px;
                      box-shadow: 3px 3px lightgray;
                      border: 0;
                      border-radius: 10px;
                      background-color: #fbd986;
                      cursor: pointer;">
                      ${position[i].catName}
                      <div>보러 가기</div>
              </button>
            </div>
          </div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
          iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

        // 인포윈도우를 생성합니다
        let infowindow = new kakao.maps.InfoWindow({
          content: iwContent,
          removable: iwRemoveable,
        });

        // 마커를 생성합니다
        const markers = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: position[i].latlng, // 마커를 표시할 위치
          title: catList[i].catName, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
        });

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(markers, "click", function () {
          // 마커 위에 인포윈도우를 표시합니다
          infowindow.open(map, markers);
        });
        markers.setMap(map);
      }

      // 지도에 마커를 표시합니다.
      kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        //클릭한 위도, 경도 정보를 가져옵니다.
        const latlng = mouseEvent.latLng;
        //위도 경도 값을 useState를 이용해서 useEffect 밖으로 빼냅니다.
        setLatitude(latlng.getLat());
        setLongitude(latlng.getLng());
        //마커 위치를 클릭한 위치로 옮깁니다.
        catMarker.setPosition(latlng);
        //마커를 지도상에 보여줍니다.
        catMarker.setMap(map);
      });

      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(location, placesSearchCB);

      function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
          let bounds = new kakao.maps.LatLngBounds();

          for (let i = 0; i < data.length; i++) {
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          map.setBounds(bounds);
        }
      }

      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      });

      kakao.maps.event.addListener(marker, "click", function () {
        infowindow.setContent(
          '<div style="padding:5px;font-size:12px;">' +
            place.place_name +
            "</div>"
        );
        infowindow.open(map, marker);
      });
    }
    setModal(1);
    setListVisible(1);
    setSearchKeyword("");
  };

  // 모든 고양이 기본 정보 가져오기
  useEffect(() => {
    setModal(0);
    dispatch(__getAllCatLocation(location));
  }, [location, dispatch]);

  // 고양이 지도에 표시하기
  useEffect(() => {
    if (catList && position && location) {
      showCats();
    }
  }, [catList, position, location, dispatch]);

  // 토스트 모달
  useEffect(() => {
    if (toastState) {
      setTimeout(() => {
        setToastState(false);
      }, 1500);
    } else if (keywordToastState) {
      setTimeout(() => {
        setKeywordToastState(false);
      }, 1500);
    } else if (searchToastState) {
      setTimeout(() => {
        setSearchToastState(false);
      }, 1500);
    }
  }, [toastState, keywordToastState, searchToastState]);

  return (
    <MapWrap>
      <Grid
        addstyle={() => {
          return css`
            display: flex;
            width: 300px;
            border: 1px solid #fbd986;
            height: 30px;
            border-radius: 15px;
            margin: 10px auto;
            @media screen and (max-width: 280px) {
              width: 250px;
            }
          `;
        }}
      >
        <RefreshCcw
          onClick={() => history.go(0)}
          size="50"
          style={{
            position: "relative",
            top: "50px",
            zIndex: "2",
            width: "40px",
            cursor: "pointer",
          }}
        />
        <input
          style={{
            width: "250px",
            border: "none",
            marginRight: "20px",
            outline: "none",
          }}
          type="text"
          placeholder="검색어를 입력하세요."
          value={searchKeyword}
          onChange={ChangeKeyword}
        />
        <button
          style={{
            border: 0,
            backgroundColor: "#FBD986",
            width: "50px",
            borderRadius: "15px",
            cursor: "pointer",
          }}
          type="submit"
          onClick={CreateKeyword}
        >
          <p
            style={{
              margin: "5px auto",
              textAlign: "center",
              fontWeight: "900",
            }}
          >
            검색
          </p>
        </button>
      </Grid>
      <div id="myMap" style={{ width: "100%", height: "500px" }} />

      {modal ? (
        <Window>
          <ListWrap visible={PlaceVisible}>
            {Pagination === "" ? (
              ""
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <TotalPage>
                  총<span> {Pagination.totalCount}</span> 개의 결과
                </TotalPage>{" "}
                <CloseModal
                  listvisible={listvisible}
                  onClick={() => {
                    setModal(!modal);
                  }}
                />
              </div>
            )}
            <div id="result-list">
              {Places.map((item, i) => (
                <List
                  onClick={() =>
                    (function () {
                      const mapContainer = document.getElementById("myMap"),
                        mapOption = {
                          center: new kakao.maps.LatLng(item.y, item.x),
                          level: 2,
                        };
                      const map = new kakao.maps.Map(mapContainer, mapOption);
                      for (let i = 0; i < position.length; i++) {
                        const imageSrc =
                          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";
                        const imageSize = new kakao.maps.Size(24, 35);
                        const markerImage = new kakao.maps.MarkerImage(
                          imageSrc,
                          imageSize
                        );
                        const markers = new kakao.maps.Marker({
                          map: map, // 마커를 표시할 지도
                          position: position[i].latlng, // 마커를 표시할 위치
                          title: catList[i].catName, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                          image: markerImage, // 마커 이미지
                        });
                        const iwContent = `
                    <div style="display:flex">
                      <div style="width: 80px; height: 80px; border-radius:80px;">
                        <img width="80" 
                            height="80"
                            border-radius="80"
                            src="${position[i].catImage}" 
                            alt="고양이 사진">
                      </div>
                      <div style="display: flex; 
                                  width: 80px; 
                                  height: 80px; 
                                  justify-content: center; 
                                  align-items: center;">
                        <button 
                          onclick="location.href='/catdetail/calendar/${villageKeyword}/${position[i].catId}/2'" 
                          style="width: 70px;
                                height: 70px;
                                box-shadow: 3px 3px lightgray;
                                border: 0;
                                border-radius: 10px;
                                background-color: #fbd986;
                                cursor: pointer;">
                                ${position[i].catName}
                                <div>보러 가기</div>
                        </button>
                      </div>
                    </div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                          iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

                        // 인포윈도우를 생성합니다
                        const infowindow = new kakao.maps.InfoWindow({
                          content: iwContent,
                          removable: iwRemoveable,
                        });
                        kakao.maps.event.addListener(
                          markers,
                          "click",
                          function () {
                            // 마커 위에 인포윈도우를 표시합니다
                            infowindow.open(map, markers);
                          }
                        );
                        markers.setMap(map);
                      }
                      let bounds = new kakao.maps.LatLngBounds();
                      bounds.extend(new kakao.maps.LatLng(item.y, item.x));

                      const catMarker = new kakao.maps.Marker({
                        position: map.getCenter(),
                      });
                      let marker = new kakao.maps.Marker({
                        map: map,
                        position: new kakao.maps.LatLng(item.y, item.x),
                      });
                      const iwRemoveable = true;
                      var infowindow = new kakao.maps.InfoWindow({
                        zIndex: 1,
                        removable: iwRemoveable,
                      });
                      kakao.maps.event.addListener(
                        marker,
                        "click",
                        function () {
                          infowindow.setContent(
                            '<div style="padding:5px;font-size:12px;">' +
                              item.place_name +
                              "</div>"
                          );
                          infowindow.open(map, marker);
                        }
                      );
                      marker.setMap(map);
                      kakao.maps.event.addListener(
                        map,
                        "click",
                        function (mouseEvent) {
                          const latlng = mouseEvent.latLng;
                          setLatitude(latlng.getLat());
                          setLongitude(latlng.getLng());
                          catMarker.setPosition(latlng);
                          catMarker.setMap(map);
                        }
                      );
                    })()
                  }
                  props={Places}
                  key={i}
                >
                  <ListNum>{i + 1}</ListNum>
                  <ListDesc>
                    <p>{item.place_name}</p>
                    {item.road_address_name ? (
                      <div>
                        <span>{item.road_address_name}</span>
                        <span>{item.address_name}</span>
                      </div>
                    ) : (
                      <span>{item.address_name}</span>
                    )}
                    <span>{item.phone}</span>
                  </ListDesc>
                </List>
              ))}
              <PagenationWrap id="pagination"></PagenationWrap>
            </div>
          </ListWrap>
        </Window>
      ) : (
        ""
      )}
      <Button
        addstyle={() => {
          return css``;
        }}
        is_float="is_float"
        clickEvent={() => {
          if (
            latitude !== undefined &&
            longitude !== undefined &&
            pathLength === 3
          ) {
            history.push({
              pathname: `/catinfowrite/${location?.split(" ")[2]}`,
              state: { latitude, longitude, location },
            });
          } else if (
            latitude !== undefined &&
            longitude !== undefined &&
            pathLength === 4
          ) {
            history.push({
              pathname: `/catdetailinfowrite/${catId}`,
              state: { latitude, longitude, location },
            });
          } else if (
            latitude === undefined &&
            longitude === undefined &&
            pathLength === 4
          ) {
            history.push({
              pathname: `/catdetailinfowrite/${catId}`,
              state: { location },
            });
          } else if (
            latitude === undefined &&
            longitude === undefined &&
            pathLength === 3
          ) {
            setToastState(true);
          }
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
      {keywordToastState ? (
        <Toast message="검색 결과가 없습니다." />
      ) : toastState ? (
        <Toast message="지도에 위치를 표시해 주세요!" />
      ) : searchToastState ? (
        <Toast message="검색어를 입력해 주세요!" />
      ) : (
        ""
      )}
    </MapWrap>
  );
};

const CloseModal = styled(X)`
  display: ${(props) => (props.listvisible ? "block" : "none")};
  cursor: pointer;
  z-index: 1000;
`;
const Window = styled.div`
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  max-width: 200px;
  position: fixed;
  width: 50vw;
  min-width: 200px;
  height: 450px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-name: fadeIn;
  animation-fill-mode: forwards;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1000;
  overflow: auto;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @media screen and (max-height: 568px) {
    height: 400px;
    margin-top: 40px;
  }
`;
const ListWrap = styled.div`
  display: ${(props) => (props.visible ? "block" : "none")};
  width: 90%;
  height: 95%;
  margin: 10px auto;
  padding: 5px;
  overflow-y: auto;
  z-index: 1;
  font-size: 12px;
  border-radius: 10px;
`;
const MapWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 80vh;
  @media screen and (max-height: 568px) {
    margin: 10px 0;
  }
`;
const List = styled.div`
  margin-top: 20px;
  display: flex;
  cursor: pointer;
  &:hover {
    background: rgba(251, 216, 134, 0.7);
    border-radius: 10px;
  }
`;
const ListNum = styled.span`
  font-weight: 900;
  margin: 0px 10px;
`;
const ListDesc = styled.div`
  p {
    margin: 0px;
    font-weight: 900;
    font-size: 12px;
  }
  span {
    font-size: 10px;
  }
`;
const TotalPage = styled.p`
  display: flex;
  font-weight: 900;
  margin: 5px 0px;
  span {
    background: #fbd986;
    display: block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    padding: 1px 1px 2px 1px;
  }
`;
const PagenationWrap = styled.div`
  margin: 10px auto;
  text-align: center;
  a {
    display: inline-block;
    margin: 2px;
    text-decoration: none;
    color: #000000;
    width: 15px;
    height: 15px;
  }
  .on {
    font-weight: 900;
    cursor: pointer;
    background: #fbd986;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
`;

export default Location;
