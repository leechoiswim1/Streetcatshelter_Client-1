// LIBRARY
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// SOCKET
import * as SockJS from "sockjs-client";
import Stomp from "stompjs";

// STYLE
import styled from "styled-components";

// ELEMENTS
import { Grid, Image } from "../../elements/index";

// COMPONENTS
import {
  Template,
  ChatMessage,
  SecondSpinner,
  EditModalSlide,
  ChatSend,
} from "../../components";

// REDUX
import { history } from "../../redux/configureStore";
import { chatActions } from "../../redux/modules/chat";
import { pushChatMessage } from "../../redux/modules/chat";

// MOMENT
import moment from "moment";

const ChatRoomPage = (props) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const chatInfo = useSelector((state) => state.chat.chatinfo);
  const nickname = useSelector((state) => state.mypage.userInfo.nickname);
  const isLoaded = useSelector((state) => state.chat.isLoaded);
  const location = props.location.state?.location;
  const cntChat = useSelector((state) => state.chat.chatinfo?.cntChat);
  const roomId = props.match.params.roomId;

  //header 마지막 활동 시간
  const LastActivity = moment(chatInfo.lastActivity).format("YYYY-MM-DD HH:MM");
  const hourDiff = moment(LastActivity).diff(moment(), "hours");
  // format 1, 활동한 지 하루 경과했을 경우 : YYYY.MM.DD hh:mm
  const updated = moment(LastActivity).format("YYYY-MM-DD HH:MM");
  // format 2, 활동한 지 하루 이내일 경우 : 'n 분 전, n 시간 전'
  const recentlyUpdated = moment(LastActivity).fromNow();
  //시간 경과에 따라 시간포맷변경(하루기준)
  const sendtime = hourDiff > -22 ? recentlyUpdated : updated;

  //채팅방 정보 가져오기
  useEffect(() => {
    dispatch(chatActions._getRoomInfo(roomId));
  }, [roomId, dispatch]);

  //소켓연결
  const sock = new SockJS("https://discatchserver.shop/ws-stomp");
  const ws = Stomp.over(sock);

  //랜더시 구독시작 뒤로가기시 소켓연결 구독해제
  useEffect(() => {
    wsConnectSubscribe();
    return () => {
      wsDisConnectUnsubscribe();
    };
  }, []);

  // 채팅방시작하기, 채팅방 클릭 시 roomId에 해당하는 방을 구독
  const wsConnectSubscribe = () => {
    try {
      ws.debug = null;
      ws.connect(
        {
          token: token,
        },
        () => {
          ws.subscribe(
            `/sub/chat/room/${roomId}`,
            (data) => {
              const res = JSON.parse(data.body);
              const submessage = {
                message: res.message,
                sender: res.sender.nickname,
                time: res.time,
                mine: null,
              };
              if (data) {
                dispatch(pushChatMessage(submessage));
              }
            },

            {
              token: token,
            }
          );
        }
      );
    } catch (e) {}
  };

  // 다른 방을 클릭하거나 뒤로가기 버튼 클릭시 연결해제 및 구독해제
  const wsDisConnectUnsubscribe = () => {
    try {
      ws.debug = null;
      ws.disconnect(
        () => {
          ws.unsubscribe("sub-0");
          clearTimeout(waitForConnection);
        },
        { token: token }
      );
    } catch (e) {}
  };

  // 웹소켓이 연결될 때 까지 실행하는 함수
  const waitForConnection = (ws, callback) => {
    setTimeout(() => {
      if (ws.ws.readyState === 1) {
        callback();
      } else {
        waitForConnection(ws, callback);
      }
    }, 0.1);
  };

  //메세지 발신시 구독 요청
  const sendMessage = (message) => {
    try {
      // send할 데이터
      const data = {
        type: 2,
        message: message,
        roomId: roomId,
        nickname: nickname,
      };

      waitForConnection(ws, () => {
        ws.debug = null;

        ws.send(
          "/pub/api/chat/message",
          { token: token },
          JSON.stringify(data)
        );
      });
    } catch (e) {}
  };

  return (
    <Template props={props} page="map">
      <ChatWrap>
        <Header>
          <InfoBox>
            <Image
              width="40px"
              height="40px"
              borderRadius="20px"
              src={chatInfo.opponentImage}
              alt={chatInfo.opponentImage}
            />
            <InfoBlock>
              <p>{chatInfo.opponent}</p>
              {chatInfo.lastActivity ? <p>{sendtime}에 활동</p> : ""}
            </InfoBlock>
          </InfoBox>

          <CallBox>
            <EditModalSlide
              FirstBtn="상대방 프로필보기"
              SecondBtn="채팅방 삭제하기"
              FirstClick={() => {
                history.push(`/user/${chatInfo.userRandomId}`);
              }}
              SecondClick={() => {
                dispatch(chatActions._deleteRoom(roomId, location));
              }}
            />
          </CallBox>
        </Header>
        <Grid style={{ height: "60%" }}>
          <ChatMessage roomId={roomId} cntChat={cntChat} />
          <SecondSpinner visible={isLoaded} />
        </Grid>
        <ChatSend sendMessage={sendMessage} />
      </ChatWrap>
    </Template>
  );
};

const ChatWrap = styled.div`
  position: relative;
  left: 7px;
  width: 95%;
  height: 76vh;
  margin: -1vh 0 0;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1280px) {
    height: 70vh;
  }
  @media screen and (max-width: 1024px) {
    height: 85vh;
  }
  @media screen and (max-width: 1024px) and (min-height: 800px) {
    height: 75vh;
  }
  @media screen and (max-width: 1024px) and (min-height: 1366px) {
    height: 83vh;
  }
  @media screen and (max-width: 1024px) and (max-height: 600px) {
    height: 65vh;
  }
  @media screen and (max-width: 768px) {
    height: 78vh;
  }
  @media screen and (max-width: 768px) and (min-height: 800px) {
    height: 74vh;
  }
  @media screen and (max-height: 800px) {
    height: 70vh;
  }
  @media screen and (max-height: 710px) {
    height: 65vh;
  }
  @media screen and (max-height: 610px) {
    height: 60vh;
  }
  @media screen and (max-height: 540px) {
    height: 55vh;
  }
  @media screen and (max-height: 500px) {
    height: 52vh;
  }
  @media screen and (max-width: 540px) {
    height: 70vh;
  }
  @media screen and (max-width: 375px) {
    height: 68vh;
  }
  @media screen and (max-width: 375px) and (min-height: 812px) {
    height: 71vh;
  }
  @media screen and (max-width: 360px) {
    height: 65vh;
  }
  @media screen and (max-width: 320px) {
    height: 63vh;
  }
  @media screen and (max-width: 280px) {
    height: 65vh;
  }
`;

const Header = styled.div`
  position: fixed;
  background: #fefdf8;
  width: 390px;
  display: flex;
  height: 60px;
  padding: 5px;
  z-index: 500;
  justify-content: space-between;
  border-bottom: 0.2px solid #d19b61;
  @media screen and (max-width: 420px) {
    width: 100%;
  }
  @media screen and (max-width: 320px) {
    width: 100%;
    height: 40px;
  }
`;
const InfoBox = styled.div`
  display: flex;
  align-items: center;
  :nth-child(1) {
    margin: 0 0 3px;
    font-size: 14px;
    font-weight: 900;
  }
  :nth-child(2) {
    margin: 0;
    font-size: 12px;
    color: #999999;
  }
`;
const InfoBlock = styled.div`
  margin-left: 12px;
  margin-right: 95px;
  p {
    :nth-child(1) {
      margin: 0 0 3px;
      font-size: 14px;
      font-weight: 900;
    }
    :nth-child(2) {
      margin: 0;
      font-size: 12px;
      font-weight: 700;
      color: #999999;
    }
  }
  @media screen and (max-width: 320px) {
    p {
      :nth-child(1) {
        font-size: 12px;
      }
      :nth-child(2) {
        font-size: 10px;
      }
    }
  }
`;
const CallBox = styled.div`
  display: flex;
  width: 60px;
  align-items: center;
  @media screen and (max-width: 375px) {
    position: relative;
    right: 15px;
  }
`;
export default ChatRoomPage;
