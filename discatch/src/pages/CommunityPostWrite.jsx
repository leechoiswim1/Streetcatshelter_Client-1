// LIBRARY
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import { Template } from "../components";
import { CommunityPreview } from "../components/index";

// STYLE
import styled, { css } from "styled-components";

// ELEMENTS
import { Grid, Button, Input, TextArea, Text } from "../elements/index";

// REDUX
import { imgActions } from "../redux/modules/image";
import { addCommunityDB } from "../redux/modules/community";

// ROUTE
import { useLocation } from "react-router-dom";

// ICON
import { Camera } from "react-feather";

const CommunityPostWrite = (props) => {
  const path = useLocation();
  const pathName = path.pathname.split("/");
  const backPath = `/${pathName[1]}/${pathName[2]}/${pathName[3]}`;
  const location = pathName[2];
  const preview = useSelector((state) =>
    state.image.preview ? state.image.preview : Array()
  );
  const dispatch = useDispatch();

  let firstCategory = null;
  if (pathName[3] === "catinfo") {
    firstCategory = "고양이 정보글";
  } else if (pathName[3] === "gathering") {
    firstCategory = `${location} 동네 모임`;
  } else {
    firstCategory = `${location} 고양이 용품 나눔`;
  }

  const [fileNum, setFileNum] = useState(0);

  // S3
  const handleInputFile = (e) => {
    e.preventDefault();
    if (fileNum < 5) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      dispatch(imgActions.setPreview(imageUrl, fileNum));
      dispatch(imgActions.setFiles(file, fileNum));
      setFileNum(fileNum + 1);
    } else {
      alert("사진은 최대 5장까지 등록할 수 있어요!");
    }
  };

  const [category, setCategory] = React.useState(firstCategory);

  const Options = [
    { key: 1, value: "고양이 정보글" },
    { key: 2, value: `${location} 동네 모임` },
    { key: 3, value: `${location} 고양이 용품 나눔` },
  ];

  const onChangeHandler = (e) => {
    setCategory(e.currentTarget.value);
  };

  const [title, setTitle] = React.useState();
  const $title = (e) => {
    setTitle(e.target.value);
  };

  const [contents, setContents] = React.useState();
  const $contents = (e) => {
    setContents(e.target.value);
  };

  const writeBtn = () => {
    dispatch(addCommunityDB(category, contents, location, title));
  };

  const delLastImageBtn = () => {
    if (preview.lentgh === 5) {
      dispatch(imgActions.delPreview(4));
      dispatch(imgActions.delFile(4));
      setFileNum(fileNum - 1);
    } else if (preview.length === 4) {
      dispatch(imgActions.delPreview(3));
      dispatch(imgActions.delFile(3));
      setFileNum(fileNum - 1);
    } else if (preview.length === 3) {
      dispatch(imgActions.delPreview(2));
      dispatch(imgActions.delFile(2));
      setFileNum(fileNum - 1);
    } else if (preview.length === 2) {
      dispatch(imgActions.delPreview(1));
      dispatch(imgActions.delFile(1));
      setFileNum(fileNum - 1);
    } else if (preview.length === 1) {
      dispatch(imgActions.delPreview(0));
      dispatch(imgActions.delFile(0));
      setFileNum(fileNum - 1);
    } else {
      alert("삭제할 사진이 없어요!");
    }
  };

  return (
    <Template props={props}>
      <Grid
        bgColor="bgColor"
        margin="-5vh auto"
        addstyle={() => {
          return css`
            position: relative;
            top: 80px;
            @media screen and (max-width: 414px) {
              margin: -10vh auto;
            }
          `;
        }}
      >
        <CommunityWriteStyle>
          <Grid height="auto" margin="0 0 16px 0">
            <Select
              onChange={onChangeHandler}
              value={category}
              style={{ height: "32px" }}
            >
              {Options.map((item, index) => (
                <option key={item.key} value={item.value}>
                  {item.value}
                </option>
              ))}
            </Select>
          </Grid>
          <Grid width="335px" height="10%">
            <Input
              onChange={$title}
              placeholder="제목을 입력해주세요."
              width="103%"
              addstyle={() => {
                return css`
                  border-radius: 10px;
                  margin: 0 0 10px 0;
                `;
              }}
            />
            <Button
              bgColor="olive"
              fontWeight="bold"
              onClick={() => delLastImageBtn()}
              addstyle={() => {
                return css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 20px;
                  width: 120px;
                  position: relative;
                  top: 3px;
                  left: 4vw;
                `;
              }}
            >
              마지막 사진 삭제
            </Button>

            <Grid
              margin="0 0 0 12px"
              addstyle={() => {
                return css`
                  white-space: nowrap;
                  overflow-x: auto;
                  height: 120px;
                  -ms-overflow-style: none;
                  &::-webkit-scrollbar {
                    display: none;
                  }
                `;
              }}
            >
              <Grid
                width="90px"
                height="90px"
                margin="5.5px"
                addstyle={() => {
                  return css`
                    position: relative;
                    background: lightgray;
                    display: inline-block;
                    text-align: center;
                    cursor: pointer;
                  `;
                }}
              >
                <Grid
                  addstyle={() => {
                    return css`
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    `;
                  }}
                >
                  <Grid width="95%">
                    <UploadButton htmlFor="imgFile">
                      <Camera width="50%" height=" 50%" color="white" />
                    </UploadButton>
                  </Grid>

                  <Upload
                    id="imgFile"
                    name="imgFile"
                    multiple
                    type="file"
                    accept="image/png, image/jpeg"
                    style={{ display: "none" }}
                    onChange={handleInputFile}
                  />
                  <Text
                    size="9px"
                    fontWeight="bold"
                    addstyle={() => {
                      return css`
                        position: relative;
                        top: -12px;
                      `;
                    }}
                  >
                    {fileNum}/5
                  </Text>
                </Grid>
              </Grid>
              {preview[0] && (
                <CommunityPreview preview={preview} previewNum={0} />
              )}
              {preview[1] && (
                <CommunityPreview preview={preview} previewNum={1} />
              )}
              {preview[2] && (
                <CommunityPreview preview={preview} previewNum={2} />
              )}
              {preview[3] && (
                <CommunityPreview preview={preview} previewNum={3} />
              )}
              {preview[4] && (
                <CommunityPreview preview={preview} previewNum={4} />
              )}
            </Grid>
            <TextArea
              onChange={$contents}
              placeholder="내용을 입력해주세요."
              height="221px"
              width="90%"
              addstyle={() => {
                return css`
                  resize: none;
                  margin: -4px 10px;
                `;
              }}
            />
          </Grid>

          <Grid 
            width="325px" 
            height="500px"
            addstyle={() => {
              return css`
                @media screen and (max-width: 414px) {
                  height: 400px;
                }
              `;
            }}></Grid>
          <Grid
            width="225px"
            height="30px"
            addstyle={() => {
              return css`
                display: flex;
                margin: -50px 0 0 -80px;
                @media screen and (max-width: 414px) {
                  margin: 50px 0 0 -70px;
                }
              `;
            }}
          >
            <Button
              width="108px"
              margin="0 auto"
              bgColor="olive"
              fontSize="18px"
              fontWeight="800"
              onClick={writeBtn}
              addstyle={() => {
                return css`
                  display: flex;
                  height: 44px;
                  border-radius: 10px;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  top: -65px;
                  left: 130px;
                `;
              }}
            >
              작성하기
            </Button>
            <Button
              width="108px"
              margin="0 auto"
              fontSize="18px"
              fontWeight="800"
              bgColor="olive"
              onClick={() => window.location.replace(`${backPath}`)}
              addstyle={() => {
                return css`
                  display: flex;
                  height: 44px;
                  border-radius: 10px;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  top: -65px;
                  left: 137px;
                `;
              }}
            >
              취소하기
            </Button>
          </Grid>
        </CommunityWriteStyle>
      </Grid>
    </Template>
  );
};

const CommunityWriteStyle = styled.div`
  width: 350px;
  height: 60vh;
  margin: 10px auto;
  border-radius: 30px;
`;

const Select = styled.select`
  background: rgb(${(props) => props.theme.palette.bgColor});
  height: 50px;
  border: 1px solid rgb(${(props) => props.theme.palette.olive});
  width: 350px;
  border-radius: 10px;
`;

const Upload = styled.input`
  background-color: white;
  width: 100%;
  border: 2px solid white;
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;

const UploadButton = styled.label`
  position: relative;
  top: 16px;
  left: 16px;
  width: 120px;
  text-align: center;
  background-color: rgb(${(props) => props.theme.palette.buttonColor});
  color: white;
  cursor: pointer;
  outline: none;
  display: block;
  float: right;
  margin-bottom: 40px;
`;

export default CommunityPostWrite;
