// LIBRARY
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// STYLE
import { css } from "styled-components";

// COMPONENTS
import {
  CommunityCategoryCard,
  Template,
  SecondSpinner,
  Toast,
} from "../../components";

// ELEMENTS
import { Grid } from "../../elements/index";

// REDUX
import { history } from "../../redux/configureStore";

// IMAGES
import Community1 from "../../styles/images/Community1.png";
import Community2 from "../../styles/images/Community2.png";
import Community3 from "../../styles/images/Community3.png";

const Community = (props) => {
  // 페이지 로딩 여부
  const isLoaded = useSelector((state) => state.community.pageLoaded);

  // 동네 이름
  const userLocation = useSelector((state) => state.map.keywordList[0]);
  const village = userLocation ? userLocation : props.location.state?.location;

  // 동네 이름이 없는 경우 유저 정보 수정 페이지로 이동
  const requestLocationInfo = () => {
    setVillageState(true);
    setTimeout(() => {
      history.push("/userinfoedit");
    }, 1000);
  };

  // 토스트 모달
  const [villageState, setVillageState] = useState(false);

  useEffect(() => {
    if (villageState) {
      setTimeout(() => {
        setVillageState(false);
      }, 1500);
    }
  }, [villageState]);

  return (
    <>
      <SecondSpinner visible={isLoaded} />
      <Template props={props}>
        {village !== undefined ? (
          <Grid
            addstyle={() => {
              return css`
                width: 100%;
                max-width: 420px;
                height: 80vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                overflow: hidden;
                @media screen and (max-height: 736px) {
                  height: 78vh;
                }
              `;
            }}
          >
            <CommunityCategoryCard
              src={Community1}
              clickEvent={() =>
                history.push({
                  pathname: `/community/${village}/catinfo`,
                  state: { location: village },
                })
              }
              width="100px"
              height="100px"
              title="고양이 정보글!"
              subtitle="고양이는 무엇을 좋아할까?"
            />

            <CommunityCategoryCard
              src={Community2}
              clickEvent={() =>
                history.push({
                  pathname: `/community/${village}/gathering`,
                  state: { location: village },
                })
              }
              width="100px"
              height="100px"
              title={`${village} 동네 모임`}
              subtitle="우리 동네에 대해 이야기해봐요!"
            />
            <CommunityCategoryCard
              src={Community3}
              clickEvent={() =>
                history.push({
                  pathname: `/community/${village}/sharing`,
                  state: { location: village },
                })
              }
              width="100px"
              height="100px"
              title={`${village} 고양이 물건 나눔`}
              subtitle="고양이를 위한 물건을 나눠봐요!"
            />
          </Grid>
        ) : (
          <Grid margin="10vh 0 0 0">
            <CommunityCategoryCard
              src={Community1}
              clickEvent={() => requestLocationInfo()}
              width="100px"
              height="100px"
              title="고양이 정보글"
              subtitle="고양이는 무엇을 좋아할까~"
            />
            <CommunityCategoryCard
              src={Community2}
              clickEvent={() => requestLocationInfo()}
              width="100px"
              height="100px"
              title={`동네 모임`}
              subtitle="우리 동네에 대해 이야기해봐요!"
            />
            <CommunityCategoryCard
              src={Community3}
              clickEvent={() => requestLocationInfo()}
              width="100px"
              height="100px"
              title={`고양이 물건 나눔`}
              subtitle="고양이를 위한 물건을 나눠봐요!"
            />
          </Grid>
        )}
        {villageState && <Toast message="동네 정보를 입력해주세요!" />}
      </Template>
    </>
  );
};

export default Community;
