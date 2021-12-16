// LIBRARY
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import { SecondHeader, Template, Toast } from "../../components";

// ELEMENTS
import { Grid, TextArea, Button, Input, Image, Text } from "../../elements";

// STYLE
import styled, { css } from "styled-components";
import { flexBox } from "../../shared/style";

// ICON
import { Camera } from "react-feather";

// REDUX
import { history } from "../../redux/configureStore";
import { imgActions } from "../../redux/modules/image";
import {
  __createCatDetailInfo,
  __editCatDetailInfo,
  addHashTag,
  deleteHashTag,
  setInitialState,
} from "../../redux/modules/cat";

const CatDetailInfoWrite = (props) => {
  const dispatch = useDispatch();
  const edit =
    props.match.path?.split("/")[1] === "catdetailinfoedit" ? true : false;
  const detail = useSelector((state) => state.cat.detail);
  const catName = useSelector((state) => state.cat.catinfo.catName);
  const CatId = useSelector((state) => state.cat.catinfo.catId);
  const hashTags = useSelector((state) => state.cat.hashtag);
  const preview = useSelector((state) => state.image.preview);
  const catId = edit ? CatId : props.match.params.catId;
  const [fileNum, setFileNum] = useState(0);

  // S3 (사진 추가)
  const handleInputFile = (e) => {
    e.preventDefault();
    if (fileNum < 3) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      dispatch(imgActions.setPreview(imageUrl, fileNum));
      dispatch(imgActions.setFiles(file, fileNum));
      setFileNum(fileNum + 1);
    } else {
      setMaxPhotoState(true);
    }
  };

  // 고양이 상세 정보 작성에 필요한 정보
  const [tag, setTag] = useState("");
  const [diary, setDiary] = useState(edit ? detail.diary : "");
  const [food, setFood] = useState(edit ? detail.food : false);
  const [snack, setSnack] = useState(edit ? detail.snack : false);
  const [water, setWater] = useState(edit ? detail.water : false);
  const catDetailId = detail.catDetailId;
  const catImages = detail.catImages;
  const latitude = edit ? "" : props.location.state.latitude;
  const longitude = edit ? "" : props.location.state.longitude;

  const $tag = (e) => {
    setTag(e.target.value);
  };
  const $diary = (e) => {
    setDiary(e.target.value);
  };

  // 토스트 모달
  const [maxPhotoState, setMaxPhotoState] = useState(false);
  const [diaryState, setDiaryState] = useState(false);
  const [tagState, setTagState] = useState(false);
  const [accessState, setAccessState] = useState(false);

  // 동네 이름
  let location = edit
    ? props.location.state?.village
    : props.location.state.location;
  location = location?.split(" ")[2];

  // 고양이 상세 정보 작성하기
  const createBtn = () => {
    if (diary === "") {
      setDiaryState(true);
    } else {
      edit
        ? dispatch(
            __editCatDetailInfo(
              hashTags,
              diary,
              food,
              snack,
              water,
              catDetailId,
              catImages,
              catId
            )
          )
        : dispatch(
            __createCatDetailInfo(
              hashTags,
              diary,
              food,
              latitude,
              longitude,
              snack,
              water,
              catId
            )
          );
      history.push(`/catdetail/diary/${location}/${catId}`);
    }
  };
  // 태그 입력
  const publish = (catTag) => {
    if (catTag !== "") {
      dispatch(addHashTag(catTag));
      setTag("");
    } else {
      setTagState(true);
    }
  };
  // 태그 삭제
  const DeleteHashTag = (hashtag) => {
    dispatch(deleteHashTag(hashtag));
  };

  // 사진 정보 초기화
  useEffect(() => {
    dispatch(imgActions.setInitialState());
  }, [dispatch]);

  // 수정모드시 태그 가져오기
  useEffect(() => {
    dispatch(setInitialState([]));
    if (edit) {
      if (detail.catTags) {
        let tag;
        for (let cattag of detail.catTags) {
          tag = cattag;
          if (tag !== "") {
            dispatch(addHashTag(tag));
          } else tag = [];
        }
      } else {
        setAccessState(true);
        history.push("/");
      }
    }
  }, [edit, detail.catTags, dispatch]);

  // 토스트 모달
  useEffect(() => {
    if (maxPhotoState) {
      setTimeout(() => {
        setMaxPhotoState(false);
      }, 1500);
    }
  }, [maxPhotoState]);

  useEffect(() => {
    if (diaryState) {
      setTimeout(() => {
        setDiaryState(false);
      }, 1500);
    }
  }, [diaryState]);

  useEffect(() => {
    if (setTagState) {
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

  return (
    <Template props={props}>
      {edit ? (
        <SecondHeader title={`${catName}의 집사일기 수정`} />
      ) : (
        <Grid
          width="80%"
          bgColor="yellow"
          padding="12px"
          margin="5px auto"
          radius="20px"
          addstyle={() => {
            return css`
              ${flexBox()}
              flex-direction:column;
            `;
          }}
        >
          <label htmlFor="imgFile">
            <Camera width="100%" height="80" color="white" />
          </label>
          <Text>이곳을 클릭하여 사진을 등록해주세요!</Text>
          <Input
            id="imgFile"
            name="imgFile"
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
      )}
      {edit && detail.catImages ? (
        <Grid
          padding="5px 20px"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          margin="auto"
        >
          {detail.catImages.map((catImage, idx) => {
            return (
              <Grid
                display="flex"
                justifyContent="center"
                margin="auto"
                key={idx}
              >
                <Image
                  src={catImage}
                  alt="CatImage"
                  width="100px"
                  height="100px"
                />
              </Grid>
            );
          })}
          <Text size="12px" style={{ textAlign: "center", marginTop: "10px" }}>
            ❌집사일기는 사진을 수정할 수 없습니다❌
          </Text>
        </Grid>
      ) : (
        <Grid
          padding="5px 20px"
          display="flex"
          justifyContent="center"
          margin="auto"
        >
          {preview && preview[0] && (
            <Grid width="33%" margin="auto">
              <Image
                borderRadius="10px"
                src={preview[0].preview}
                width="100px"
                height="100px"
                margin="auto"
              />
            </Grid>
          )}

          {preview && preview[1] && (
            <Grid width="33%" margin="auto">
              <Image
                borderRadius="10px"
                src={preview[1].preview}
                width="100px"
                height="100px"
                margin="auto"
              />
            </Grid>
          )}

          {preview && preview[2] && (
            <Grid width="33%" margin="auto">
              <Image
                borderRadius="10px"
                src={preview[2].preview}
                width="100px"
                height="100px"
                margin="auto"
              />
            </Grid>
          )}
        </Grid>
      )}
      {!edit && (
        <Text margin="5px auto 10px auto" fontWeight="bold">
          {fileNum}/3
        </Text>
      )}

      <Grid
        display="flex"
        justifyContent="space-around"
        margin="0px auto 10px auto"
        width="90%"
      >
        <CheckGrid>
          <CheckBox
            type="checkbox"
            checked={water}
            onChange={(e) => {
              setWater(e.target.checked);
            }}
          />
          <CheckText>급수</CheckText>
        </CheckGrid>
        <CheckGrid>
          <CheckBox
            type="checkbox"
            checked={food}
            onChange={(e) => {
              setFood(e.target.checked);
            }}
          />
          <CheckText>사료</CheckText>
        </CheckGrid>

        <CheckGrid>
          <CheckBox
            type="checkbox"
            checked={snack}
            onChange={(e) => {
              setSnack(e.target.checked);
            }}
          />
          <CheckText>간식</CheckText>
        </CheckGrid>
      </Grid>
      <Grid width="85%" margin="auto">
        <Text size="14px" fontWeight="bold">
          1. 캣 활동 다이어리
        </Text>
        <TextArea
          changeEvent={$diary}
          margin="5px auto"
          padding="5px 10px"
          width="90%"
          height="20vh"
          type="text"
          value={diary}
          placeholder="다이어리를 입력해주세요."
          addstyle={() => {
            return css`
              border: 1px solid rgb(${(props) => props.theme.palette.olive});
              border-radius: 10px;
              resize: none;
              display: flex;
              justify-content: center;
            `;
          }}
        ></TextArea>
        <Grid width="100%" margin="auto">
          <Text size="14px" fontWeight="bold">
            2. 해쉬태그{" "}
          </Text>
          <Text margin="0px 5px" size="10px">
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
            placeholder="태그를 입력해주세요!"
            type="text"
            value={tag}
            changeEvent={$tag}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                publish(tag);
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
          width="120px"
          height="20px"
          margin="5px auto"
          padding="5px"
          color="#000000"
          bgColor="olive"
          fontSize="18px"
          fontWeight="800"
          radius="15px"
          addstyle={() => {
            return css`
              display: flex;
              justify-content: center;
            `;
          }}
        >
          작성하기
        </Button>
      </Grid>
      {maxPhotoState && (
        <Toast message="사진은 최대 3장까지 등록할 수 있어요!" />
      )}
      {diaryState && <Toast message="다이어리를 입력해 주세요!" />}
      {tagState && <Toast message="해쉬태그를 입력해주세요!" />}
      {accessState && <Toast message="잘못된 접근입니다." />}
    </Template>
  );
};

const CheckGrid = styled.div`
  display: flex;
  justify-content: center;
`;
const CheckText = styled.p`
  font-weight: 800;
  font-size: 16px;
  margin: 0px 5px;
`;
const CheckBox = styled.input`
  width: 20x;
  height: 20px;
`;

export default CatDetailInfoWrite;
