// LIBRARY
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import { Template } from "../components";

// STYLE
import styled, { css } from "styled-components";

// ELEMENTS
import { Grid, Button, Input, TextArea, Text, Image } from "../elements/index";

// REDUX
import { imgActions } from "../redux/modules/image";
import { editCommunityDB } from "../redux/modules/community";

// ROUTE
import { Link, useLocation } from "react-router-dom";

// ICON
import { Camera } from "react-feather";

// REDUX
import { history } from "../redux/configureStore";
import { getOneCommunityDB } from '../redux/modules/community';

const CommunityPostEdit = (props, community) => {
  // const communityId = community.match.params;
  // console.log(community);

  // React.useEffect(() => {
  //   dispatch(getOneCommunityDB(communityId));
  // }, []);

  // const { category, contents, image, location, title, username } = useSelector((state) => ({
  //   categoty: state.community.list.categoty,
  //   contents: state.community.list.contents,
  //   image: state.community.list.image,
  //   location: state.community.list.location,
  //   title: state.community.list.title,
  //   username: state.community.list.username,
  // }));

  const image = '수정 필요';
  // const image = null;
  const communityId = "수정 필요";
  const category = "수정 필요";
  const title = "수정 필요";
  const contents = "수정 필요"



  const imageList = useSelector((state) => state.image.file[0])
  console.log(imageList);
  const dispatch = useDispatch();

  const location = "망원동, 수정"; // Header에서 가져오기?
  // const location2 = "망원동"; // 유저 정보에서 가져오기??

  const [fileUrl, setFileUrl] = useState(image);
  const [fileNum, setFileNum] = useState(0);


  // S3
  const handleInputFile = (e) => {
    e.preventDefault();
    // if (fileNum < 5) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      dispatch(imgActions.setInitialState());
      dispatch(imgActions.setFile([file]));
      setFileUrl(imageUrl);
      setFileNum(1);

    // } else {
    //   alert('사진은 5장을 초과할 수 없어요!');
    // }
  };

  const [editTitle, setEditTitle] = React.useState(title);
  const $title = (e) => {
    setEditTitle(e.target.value);
  };

  const [editcontents, setEditContents] = React.useState(contents);
  const $contents = (e) => {
    setEditContents(e.target.value);
  };

  const editBtn = () => {
    dispatch(editCommunityDB(communityId, category, contents, location, title));
  };

  React.useEffect(() => {
      console.log(fileNum);
    },
    [fileNum],
  );

  return (
    <Template props={props}>
      <Grid
        bgColor="bgColor"
        margin="-10vh auto"
        addstyle={() => {
          return css`
            position: relative;
            top: 80px;
          `;
        }}
      >
        <CommunityEditStyle>
          <Grid width="335px" height="auto" margin="0 0 16px 0">
          <Input
              disabled
              value={category}
              width="103%"
              addstyle={() => {
                return css`
                  border-radius: 10px;
                  margin: 0 0 16px 2px;
                `;
              }}
            />
          </Grid>
          <Grid width="335px" height="10%">
            <Input
              onChange={$title}
              placeholder='제목을 입력해주세요.'
              value={editTitle}
              width="103%"
              addstyle={() => {
                return css`
                  border-radius: 10px;
                  margin: 0 0 16px 2px;
                `;
              }}
            />
            <Grid
              margin="0 0 0 12px"
              addstyle={() => {
                return css`
                  /* display:flex; */
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
                width={"90px"}
                height={"90px"}
                margin={"5.5px"}
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
                    {image && 1 || fileNum}/1
                  </Text>
                </Grid>
              </Grid>
              {fileUrl&& (
                <Grid
                  width={"90px"}
                  height={"90px"}
                  margin={"0 5.5px"}
                  addstyle={() => {
                    return css`
                      position:relative;
                      background: lightgray;
                      display: inline-block;
                      top:5px;
                    `;
                  }}
                >
                  <Image src={image || fileUrl} width="100%" height="100%" />
                </Grid>
              )}
            </Grid>
            <TextArea
              onChange={$contents}
              value={editcontents}
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

          <Grid width="325px"></Grid>
          <Grid
            width="225px"
            height="30px"
            addstyle={() => {
              return css`
                display: flex;
                margin: 60px 0 0 -70px;
              `;
            }}
          >
            <Button
              width="108px"
              margin="auto"
              fontSize="14px"
              bgColor="D_yellow"
              fontWeight="bold"
              onClick={editBtn}
              addstyle={() => {
                return css`
                  display: flex;
                  height: 24px;
                  border-radius: 10px;
                  align-items: center;
                  justify-content: center;
                  position: relative;
                  top: -65px;
                  left: 130px;
                `;
              }}
            >
              완료하기
            </Button>
            <Button
              width="108px"
              margin="auto"
              fontSize="14px"
              fontWeight="bold"
              bgColor="D_yellow"
              onClick={() => history.goBack()}
              addstyle={() => {
                return css`
                  display: flex;
                  height: 24px;
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
        </CommunityEditStyle>
      </Grid>
    </Template>
  );
};

const CommunityEditStyle = styled.div`
  width: 350px;
  height: 60vh;
  margin: 10px auto;
  border-radius: 30px;
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

export default CommunityPostEdit;
