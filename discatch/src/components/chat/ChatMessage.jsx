// LIBRARY
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// MOMENT
import "moment/locale/ko";
import moment from "moment";

// STYLE
import styled from "styled-components";

// REDUX
import { chatActions } from "../../redux/modules/chat";
import { resetAllMessage } from "../../redux/modules/chat";

const ChatMessage = ({ roomId, cntChat }) => {
  const dispatch = useDispatch();
  const lastMessages = useSelector((state) => state.chat.chatmessage);
  const isLoaded = useSelector((state) => state.chat.isLoaded);
  const nickName = useSelector((state) => state.mypage.userInfo.nickname);
  //스크롤 마지막으로 고정하기위한 ref
  const commentsEndRef = useRef(null);
  //전체 메세지 수를 통해 전체 페이지를 구함
  const Page =
    cntChat > 0 && cntChat % 20 === 0
      ? parseInt(cntChat / 20)
      : cntChat > 0 && cntChat % 20 > 0
      ? parseInt(cntChat / 20) + 1
      : 1;
  const [page, setPage] = useState(Page);

  // 스크롤 마지막으로 고정
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [lastMessages]);

  // 마지막 페이지 요청
  //페이지가 없을경우 undefined로 요청가는것을 방지하기위한 조건문 추가
  useEffect(() => {
    dispatch(resetAllMessage());
    if (Page) {
      setPage(Page);
      dispatch(chatActions._getMessage(roomId, Page));
    }
  }, [roomId, Page, dispatch]);

  //채팅 무한 스크롤
  const observerRef = useRef();
  //ref연결되어있는 node가 보이면 -1 페이지 요청
  const observer = (node) => {
    if (isLoaded) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(([entry]) => {
      //페이지가 1이면 요청 중지
      if (entry.isIntersecting && page !== 1) {
        setPage((page) => page - 1);
        dispatch(chatActions._getMessage(roomId, page - 1));
      }
    });
    node && observerRef.current.observe(node);
  };

  return (
    <div>
      {lastMessages && (
        <ChatBox>
          <div ref={observer} />
          {lastMessages.map((lastmessage, idx) => {
            //시간 수정
            const createdAt = moment(lastmessage.time).format(
              "YYYY-MM-DD HH:MM"
            );
            const hourDiff = moment(createdAt).diff(moment(), "hours");
            // format 1, 보낸지 하루 경과했을 경우 : YYYY.MM.DD hh:mm
            const updated = moment(createdAt).format("YYYY-MM-DD HH:MM");
            // format 2, 보낸지 하루 이내일 경우 : 'n 분 전, n 시간 전'
            const recentlyUpdated = moment(createdAt).fromNow();
            //시간 경과에 따라 시간포맷변경(하루기준)
            const sendtime = hourDiff > -22 ? recentlyUpdated : updated;

            return (
              <div key={idx}>
                {lastmessage.sender === nickName ? (
                  <div>
                    <BubbleTop user="my">{lastmessage.sender}</BubbleTop>
                    <BubbleBox user="my">
                      <p>{sendtime}</p>
                      <Bubble user="my">{lastmessage.message} </Bubble>
                    </BubbleBox>
                  </div>
                ) : (
                  <div>
                    <BubbleTop>{lastmessage.sender}</BubbleTop>
                    <BubbleBox user="friend">
                      <Bubble user="friend">{lastmessage.message} </Bubble>
                      <p>{sendtime}</p>
                    </BubbleBox>
                  </div>
                )}
              </div>
            );
          })}
        </ChatBox>
      )}
      <div ref={commentsEndRef} />
    </div>
  );
};

const ChatBox = styled.div`
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 60%;
  margin-top: 65px;
`;
const BubbleTop = styled.div`
  ${(props) =>
    props.user === "my"
      ? `
    text-align:right;
  `
      : ` text-align:left`}

  margin: 0px;
  font-weight: 900;
  font-size: 12px;
`;
const BubbleBox = styled.div`
  margin-bottom: 5px;
  display: flex;
  ${(props) =>
    props.user === "my"
      ? `
      justify-content:flex-end;
    `
      : ``}
  p {
    display: flex;
    font-size: 10px;
    margin: 10px 5px;
    align-items: end;
    @media screen and (max-width: 320px) {
      font-size: 8px;
    }
  }
`;
const Bubble = styled.div`
  margin: 5px 0;
  display: inline-block;
  max-width: 70%;
  font-size: 12px;
  @media screen and (max-width: 320px) {
    font-size: 10px;
  }
  position: relative;
  ${(props) =>
    props.user === "my"
      ? `
      background-color: #cbcf52;
      border-radius: 14px 14px 14px 0;
      padding: 7px 15px 7px 15px;
      float: right;
      clear: both;
      color: #000000;`
      : `
      background-color: #fbd986;
      border-radius: 14px 14px 14px 0;
      padding: 7px 15px 7px 15px;
      float: left;
      clear: both;
      color: #000000;`}
  @keyframes fadeIn {
    from {
      tranform: translateX(10px);
      opacity: 0;
    }
    to {
      transfrom: none;
      opacity: 1;
    }
  }
  animation: fadeIn 0.3s linear;
`;

export default ChatMessage;