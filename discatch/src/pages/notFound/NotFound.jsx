// LIBRARY
import React from "react";

// COMPONENTS
import { Template } from "../../components";

// STYLE
import { css } from "styled-components";

// ELEMENTS
import { Button, Text, Grid, Image } from "../../elements";

// IMAGE
import NotFoundCatImage from "../../styles/images/NotFoundCat.png";

// REDUX
import { history } from "../../redux/configureStore";

const NotFound = (props) => {
  return (
    <Template props={props}>
      <Grid
        addstyle={() => {
          return css`
            width: 100%;
            max-width: 420px;
            height: 80vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            @media screen and (max-height: 736px) {
              height: 78vh;
            }
          `;
        }}
      >
        {" "}
        <Text
          size="20px"
          fontWeight="700"
          textAlign="center"
          addstyle={() => {
            return css`
              background: #fdf0e7;
              border-radius: 10px;
            `;
          }}
        >
          404 Error
        </Text>
        <Text size="45px" fontWeight="700" textAlign="center">
          앗!
        </Text>
        <Text size="35px" fontWeight="700" textAlign="center">
          잘못된 접근입니다.
        </Text>
        <Image
          margin="20px auto"
          width="200px"
          height="200px"
          src={NotFoundCatImage}
          alt={NotFoundCatImage}
        />
        <Button
          width="200px"
          height="50px"
          borderRadius="20px"
          bgColor="yellow"
          hoverBackground=" #cbcf52"
          clickEvent={() => {
            history.push("/");
          }}
        >
          <Text fontWeight="700" size="20px">
            홈으로 돌아가기
          </Text>
        </Button>
      </Grid>
    </Template>
  );
};

export default NotFound;
