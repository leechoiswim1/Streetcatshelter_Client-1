// LIBRARY
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import { SecondHeader, Template, Toast } from "../../components";

// ELEMENTS
import { Grid, Image, Input, Button, Text } from "../../elements/index";

// STYLE
import styled, { css } from "styled-components";
import { flexBox } from "../../shared/style";

// ICON
import { Camera } from "react-feather";

// REDUX
import { imgActions } from "../../redux/modules/image";
import { history } from "../../redux/configureStore";
import {
  __createCatInfo,
  __editCatInfo,
  addHashTag,
  deleteHashTag,
  setInitialState,
} from "../../redux/modules/cat";

const CatInfoWrite = (props) => {
  const dispatch = useDispatch();
  const edit = props.match.path?.split("/")[1] === "catinfoedit" ? true : false;
  const catInfo = useSelector((state) => state.cat.catinfo);

  // 동네 이름
  const pathLocation = props.match.params.location;
  let location = pathLocation;
  const villageList = useSelector((state) => state.mypage.userVillage);
  if (location === villageList[0]?.split(" ")[2]) {
    location = villageList[0];
  } else if (location === villageList[1]?.split(" ")[2]) {
    location = villageList[1];
  } else if (location === villageList[2]?.split(" ")[2]) {
    location = villageList[2];
  }

  // 사진
  const [fileUrl, setFileUrl] = useState(null);

  // S3
  const handleInputFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    dispatch(imgActions.setInitialState(imageUrl));
    dispatch(imgActions.setFile(file));
    setFileUrl(imageUrl);
  };
  // 중성화 셀렉트박스
  const Options = [
    { key: 1, value: "중성화 여부" },
    { key: 2, value: "알수없음" },
    { key: 3, value: "YES" },
    { key: 4, value: "NO" },
  ];

  // 고양이 기본 정보 작성에 필요한 정보
  const [catName, setCatName] = useState(edit ? catInfo.catName : "");
  const nickName = useSelector((state) => state.mypage.userInfo.nickname);
  const hashTags = useSelector((state) => state.cat.hashtag);
  const [neutering, setNeutering] = useState(edit ? catInfo.neutering : "");
  const [catTag, setCatTag] = useState("");
  const latitude = props.history.location.state?.latitude;
  const longitude = props.history?.location.state?.longitude;
  const catId = catInfo.catId;

  const $neutering = (e) => {
    setNeutering(e.target.value);
  };
  const $catTag = (e) => {
    setCatTag(e.target.value);
  };

  // 토스트 모달
  const [maxTextState, setMaxTextState] = useState(false);
  const [photoState, setPhotoState] = useState(false);
  const [nameState, setNameState] = useState(false);
  const [neuteringState, setNeuteringState] = useState(false);
  const [tagState, setTagState] = useState(false);
  const [accessState, setAccessState] = useState(false);
  const [editToastState, setEditToastState] = useState(false);

  // 고양이 이름 정규표현식
  const $catName = (e) => {
    const regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi;
    if (regExp.test(e.target.value) || e.target.value.search(/\s/) !== -1) {
      setEditToastState(true);
    } else if (e.target.value.length > 8) {
      setMaxTextState(true);
    } else {
      setCatName(e.target.value);
    }
  };

  // 고양이 기본 정보 작성하기
  const createBtn = () => {
    if (!edit && fileUrl === null) {
      setPhotoState(true);
    } else if (catName === "") {
      setNameState(true);
    } else if (neutering === "" || neutering === "중성화 여부") {
      setNeuteringState(true);
    } else {
      edit
        ? dispatch(__editCatInfo(catName, hashTags, neutering, catId))
        : dispatch(
            __createCatInfo(
              catName,
              hashTags,
              neutering,
              location,
              nickName,
              latitude,
              longitude,
              pathLocation
            )
          );
    }
  };
  // 해쉬태그 입력하기
  const publish = (catTag) => {
    if (catTag !== "") {
      dispatch(addHashTag(catTag));
      setCatTag("");
    } else {
      setTagState(true);
    }
  };
  // 해쉬태그 삭제
  const DeleteHashTag = (hashtag) => {
    dispatch(deleteHashTag(hashtag));
  };
  // 수정모드시 태그 셋팅
  useEffect(() => {
    dispatch(setInitialState([]));
    if (edit) {
      if (catInfo.catTagList) {
        dispatch(imgActions.uploadImage(catInfo.catImage));
        let tag;
        for (let cattag of catInfo.catTagList) {
          tag = cattag.tag;
          if (tag !== "") {
            dispatch(addHashTag(tag));
          } else tag = [];
        }
      } else {
        setAccessState(true);
        history.push("/");
      }
    }
  }, [edit, catInfo.catTagList, catInfo.catImage, dispatch]);

  // 토스트 모달
  useEffect(() => {
    if (maxTextState) {
      setTimeout(() => {
        setMaxTextState(false);
      }, 1500);
    }
  }, [maxTextState]);

  useEffect(() => {
    if (photoState) {
      setTimeout(() => {
        setPhotoState(false);
      }, 1500);
    }
  }, [photoState]);

  useEffect(() => {
    if (nameState) {
      setTimeout(() => {
        setNameState(false);
      }, 1500);
    }
  }, [nameState]);

  useEffect(() => {
    if (neuteringState) {
      setTimeout(() => {
        setNeuteringState(false);
      }, 1500);
    }
  }, [neuteringState]);

  useEffect(() => {
    if (tagState) {
      setTimeout(() => {
        setTagState(false);
      }, 1500);
    }
  }, [tagState]);

  useEffect(() => {
    if (accessState) {
      setTimeout(() => {
        setAccessState(false);
      }, 1500);
    }
  }, [accessState]);
  useEffect(() => {
    if (editToastState) {
      setTimeout(() => {
        setEditToastState(false);
      }, 1500);
    }
  }, [editToastState]);

  return (
    <Template props={props}>
      {edit ? (
        <SecondHeader title={`${catInfo.catName} 고양이정보수정`} />
      ) : (
        <SecondHeader title={`${pathLocation}  고양이등록`} />
      )}
      <Grid>
        <Grid
          width="80%"
          bgColor="yellow"
          padding="12px"
          margin="5% auto"
          radius="20px"
          addstyle={() => {
            return css`
              cursor: pointer;
              ${flexBox()}
              flex-direction:column;
            `;
          }}
        >
          <label htmlFor="imgFile">
            <Camera
              width="100%"
              height="100px"
              color="white"
              style={{ cursor: "pointer" }}
            />
          </label>
          <Text>이곳을 클릭하여 사진을 등록해 주세요!</Text>
          <Input
            id="imgFile"
            name="imgFile"
            multiple
            type="file"
            accept="image/png, image/jpeg"
            changeEvent={handleInputFile}
            addstyle={() => {
              return css`
                display: none;
              `;
            }}
          />
        </Grid>

        {edit ? (
          <Grid
            width="60%"
            height="200px"
            margin="3% auto"
            addstyle={() => {
              return css`
                ${flexBox()}
              `;
            }}
          >
            <Grid>
              {fileUrl ? (
                <Image src={fileUrl} width="100%" height="100%" />
              ) : (
                <Image src={catInfo.catImage} width="100%" height="100%" />
              )}
            </Grid>
          </Grid>
        ) : (
          <Grid>
            {fileUrl ? (
              <Grid
                width="60%"
                height="200px"
                margin="3% auto"
                addstyle={() => {
                  return css`
                    ${flexBox()}
                  `;
                }}
              >
                <Image src={fileUrl} width="100%" height="100%" />
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        )}

        <Grid width="90%" margin="10px auto">
          <Grid margin="10px auto">
            <Text fontWeight="bold">1. 고양이 이름을 지어주세요.</Text>
            <Input
              addstyle={() => {
                return css`
                  ${flexBox()}
                `;
              }}
              margin="5px auto"
              padding="5px 10px"
              width="90%"
              radius="10px"
              bgColor="#ffffff"
              placeholder="고양이 이름"
              changeEvent={$catName}
              value={catName}
            />
          </Grid>
          <Grid margin="10px auto">
            <Text fontWeight="bold"> 2. 중성화 여부 </Text>
            <Select value={neutering} onChange={$neutering}>
              {Options.map((item, index) => {
                return (
                  <option key={item.key} value={item.value}>
                    {item.value}
                  </option>
                );
                // }
              })}
            </Select>
          </Grid>
          <Grid margin="10px auto">
            <Text fontWeight="bold"> 3. 해쉬태그 </Text>
            <Text margin="0px 5px" size="12px">
              "빈칸"없이 입력 후 엔터를 치세요.
              <br /> 해쉬태그를 삭제하고싶으시면 생성된 태그를 클릭해주세요!
            </Text>
            <Input
              addstyle={() => {
                return css`
                  ${flexBox()}
                `;
              }}
              margin="5px auto"
              padding="5px 10px"
              width="90%"
              radius="10px"
              bgColor="#ffffff"
              placeholder="태그는 5개까지 입력할 수 있습니다!"
              type="text"
              value={catTag}
              changeEvent={$catTag}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  publish(catTag);
                }
              }}
            />

            {hashTags ? (
              <Grid
                display="flex"
                width="95%"
                margin="10px auto"
                addstyle={() => {
                  return css`
                    display: flex;
                    flex-wrap: wrap;
                  `;
                }}
              >
                {hashTags.map((hashtag, idx) => {
                  return (
                    <Grid
                      key={idx}
                      width="auto"
                      bgColor="yellow"
                      height="25px"
                      radius="20px"
                      margin="5px "
                      padding="0px 5px 3px 5px"
                      style={{ fontSize: "12px" }}
                      addstyle={() => {
                        return css`
                          display: flex;
                          align-items: center;
                        `;
                      }}
                      onClick={() => DeleteHashTag(hashtag)}
                    >
                      {hashtag}
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              ""
            )}
          </Grid>
          <Button
            clickEvent={createBtn}
            bgColor="olive"
            color="black"
            width="120px"
            radius="15px"
            fontWeight="800"
            fontSize="18px"
            addstyle={() => {
              return css`
                display: block;
                margin: 10% auto;
              `;
            }}
          >
            작성하기
          </Button>
        </Grid>
      </Grid>
      {maxTextState && <Toast message="최대 8글자까지 입력가능해요!" />}
      {photoState && <Toast message="고양이 사진을 등록해주세요!" />}
      {nameState && <Toast message="고양이 이름을 지어주세요!" />}
      {neuteringState && <Toast message="중성화 여부를 선택해주세요!" />}
      {tagState && <Toast message="해쉬태그를 입력해주세요!" />}
      {accessState && <Toast message="잘못된 접근입니다." />}
      {editToastState && (
        <Toast message="특수문자 및 공백을 사용할 수 없습니다." />
      )}
    </Template>
  );
};

const Select = styled.select`
  border: 1px solid rgb(${(props) => props.theme.palette.olive});
  display: flex;
  justify-content: center;
  margin: 5px auto;
  padding: 5px 10px;
  width: 96%;
  border-radius: 10px;
  background: white;
  outline: none;
`;

export default CatInfoWrite;
