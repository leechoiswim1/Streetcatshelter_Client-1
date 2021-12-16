// LIBRARY
import React, { useState, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import { useDispatch } from "react-redux";

// COMPONENTS
import { Toast } from "..";

// STYLE
import styled from "styled-components";

// ICON
import { Search } from "react-feather";

// REDUX
import { saveVillage } from "../../redux/modules/mypage";

const SearchAddress = (props) => {
  const dispatch = useDispatch();
  const [isOpenPost, setIsOpenPost] = useState(false);

  //토스트모달
  const [toastState, setToastState] = useState(false);
  const [secondToastState, setSecondToastState] = useState(false);

  const onChangeOpenPost = () => {
    if (isOpenPost === false && props.Village.length === 3) {
      setToastState(true);
    } else {
      setIsOpenPost(!isOpenPost);
    }
  };

  // 주소 등록하기
  const onCompletePost = (data) => {
    let fullAddr = `${data.sido} ${data.sigungu} ${data.bname}`;
    // 시도 + 시군구 + 동

    if (fullAddr.split(" ").length === 4) {
      // 시도 + 시군구 + 동이 4단어이면 시군구 + 동으로 설정
      fullAddr = `${data.sigungu} ${data.bname}`;
    }
    let extraAddr = "";
    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddr += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddr +=
          extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== "" ? ` (${extraAddr})` : "";
    }

    // 등록된 주소인지 확인
    if (
      props.Village[0]?.split(" ")[2] !== data.bname &&
      props.Village[1]?.split(" ")[2] !== data.bname &&
      props.Village[2]?.split(" ")[2] !== data.bname
    ) {
      dispatch(saveVillage(`${fullAddr.split(" (")[0]}`));
    } else {
      setSecondToastState(true);
    }
    setIsOpenPost(false);
  };

  const postCodeStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: " translate(-50%, -50%)",
    boxShadow:
      "0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)",
    maxWidth: "420px",
    width: "100vw",
    height: "50vh",
    minHeight: " 450px",
    borderRadius: "20px",
  };

  // 토스트 모달
  useEffect(() => {
    if (setSecondToastState) {
      setTimeout(() => {
        setToastState(false);
      }, 1500);
    } else if (secondToastState) {
      setTimeout(() => {
        setSecondToastState(false);
      }, 1500);
    }
  }, [toastState, secondToastState]);

  return (
    <>
      <SearchButton onClick={onChangeOpenPost}>
        <p>동네검색하기</p>
        <Search />
      </SearchButton>
      {isOpenPost ? (
        <Background>
          <Overlay onClick={() => setIsOpenPost(!isOpenPost)} />
          <DaumPostcode
            style={postCodeStyle}
            autoClose
            onComplete={onCompletePost}
          />
        </Background>
      ) : null}
      {toastState ? (
        <Toast
          message="최대 3동네까지 등록하실 수 있습니다"
          message2="수정을 원하시면 동네 삭제 후 다시 시도해주세요!"
        />
      ) : secondToastState ? (
        <Toast message="이름이 같은 동은 한 곳만 등록 가능합니다." />
      ) : (
        ""
      )}
    </>
  );
};

const SearchButton = styled.div`
  background: #f9c852;
  width: 75%;
  height: 32px;
  border: none;
  border-radius: 10px;
  justify-content: center;
  margin: 10px auto 0px;
  display: flex;
  cursor: pointer;
  p {
    width: 100px;
    margin: auto;
    font-size: 16px;
    font-weight: 900;
    text-align: center;
  }
  svg {
    width: 16px;
    margin: auto;
  }
`;
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100%;
`;
const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

export default SearchAddress;