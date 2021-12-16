// LIBRARY
import React from "react";

// COMPONENTS
import { Template, GoogleLoginBtn } from "../../components";

// STYLE
import styled from "styled-components";

// AUTH
import {
  dev_oauthKaKaoURL,
  dev_oauthNaverURL,
  oauthKaKaoURL,
  oauthNaverURL,
} from "../../shared/oauthenv";

// IMAGES
import Kakao from "../../styles/images/icon-Kakao.png";
import Naver from "../../styles/images/icon-Naver(G).png";

const Login = (props) => {
  return (
    <Template props={props} page="login">
      <Wrapper>
        <Inner>
          <Head>
            <p>
              dis<span>C</span>
              <span>A</span>
              <span>T</span>ch
            </p>
          </Head>
          <Header>
            <p>1초만에 우리동네 집사되기 !</p>
          </Header>
          <Body>
            <LoginWrap>
              <LoginBtn
                background="#F7E600"
                onClick={() => {
                  window.location.href = oauthKaKaoURL;
                }}
              >
                <Img
                  src={Kakao}
                  alt={Kakao}
                  width="50px"
                  height="50px"
                  borderRadius="10px"
                />
                <p>카카오로 로그인하기</p>
              </LoginBtn>
              <LoginBtn
                background="#03c75a"
                onClick={() => {
                  window.location.href = oauthNaverURL;
                }}
              >
                <Img
                  src={Naver}
                  alt={Naver}
                  width="50px"
                  height="50px"
                  borderRadius="10px"
                />
                <p style={{ color: "#ffffff" }}>네이버로 로그인하기</p>
              </LoginBtn>

              <GoogleLoginBtn />
            </LoginWrap>
          </Body>
        </Inner>
      </Wrapper>
    </Template>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  background: #fef7ea;
`;
const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fefdf8;
  width: 90%;
  height: 600px;
  margin: auto;
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
  @media screen and (max-height: 568px) {
    height: 500px;
  }
`;
const Head = styled.div`
  height: 35%;
  margin: auto;
  p {
    font-size: 45px;
    font-weight: 700;
    color: #fbd986;
    margin-top: 55%;
    @media screen and (max-height: 568px) {
      margin-top: 50%;
    }
  }
  span {
    font-size: 50px;
    font-weight: 800;
    color: #cbcf52;
    :nth-child(2) {
      color: #d19b61;
    }
  }
`;
const Header = styled.div`
  width: 180px;
  height: 20px;
  margin-bottom: 10px;
  border-radius: 10px;
  border: 1px solid #b5bb19;
  p {
    color: #b5bb19;
    font-weight: 600;
    font-size: 12px;
    text-align: center;
    margin: auto;
  }
`;
const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin: ${(props) => props.margin};
  border-radius: ${(props) => props.borderRadius};
`;
const LoginWrap = styled.div`
  display: flex;
  flex-direction: column;
`;
const LoginBtn = styled.div`
  display: flex;
  width: 250px;
  height: 50px;
  margin: 10px 0px;
  background: ${(props) => props.background};
  border-radius: 10px;
  filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.25));
  cursor: pointer;
  &:hover {
    filter: brightness(90%);
  }
  p {
    font-size: 15px;
    font-weight: 800;
    color: #191919;
  }
`;
const Body = styled.div`
  height: 65%;
`;

export default Login;
