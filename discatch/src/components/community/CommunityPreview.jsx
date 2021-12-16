// LIBRARY
import React from 'react'

// ELEMENTS
import { Grid, Image } from "../../elements/index";

// STYLE
import { css } from "styled-components";

// ROUTE
import { useLocation } from "react-router-dom";

const CommunityPreview = (preview) => {
    const path = useLocation();
    // pathLength가 5인 경우 작성 페이지, 6인 경우 수정 페이지
    const pathLength = path.pathname.split('/').length;

    let previewImage; 
    let newImage = preview?.preview[preview?.previewNum]?.preview;

    if (pathLength === 6) {
      newImage = preview?.preview[preview?.previewNum - preview.imageNum]?.preview;
      // 글 작성 또는 수정 시 새로 추가되는 사진의 프리뷰

      previewImage = preview?.imageList[preview?.previewNum]?.image;
      // 글 수정 시 이전에 추가한 사진의 프리뷰
    }
    return (
        <>
        {pathLength === 5 ? (<Grid
                  width={"90px"}
                  height={"90px"}
                  margin={"0 5.5px"}
                  addstyle={() => {
                    return css`
                      position:relative;
                      background: lightgray;
                      display: inline-block;
                      overflow-x: hidden;
                      top: 5.5px;
                    `;
                  }}
                >
                  <Image src={newImage} width="100%" height="100%"/>
                </Grid>) : (<Grid
            width="90px"
            height="90px"
            margin="0 5.5px"
            addstyle={() => {
                return css`
                position:relative;
                background: lightgray;
                display: inline-block;
                overflow-x: hidden;
                top: 5.5px;
                `;
            }}
            >
            <Image 
                src={previewImage || newImage} 
                width="100%" 
                height="100%" 
                addstyle={() => {
                return css`
                    position:relative;
                `;
                }}
            />
        </Grid>)}
        </>
    )
}

export default CommunityPreview;