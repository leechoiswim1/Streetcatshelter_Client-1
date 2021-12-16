// LIBRARY
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// STYLE
import styled from "styled-components";

// ICON
import { MoreHorizontal } from "react-feather";

// COMPONENTS
import { EditModalSlide, EmptyPost } from "../../components";

// REDUX
import { history } from "../../redux/configureStore";
import { chatActions } from "../../redux/modules/chat";

const ChatMain = ({ props, room, sendtime }) => {
  const dispatch = useDispatch();
  const location = props.location.state.location;
  const [openModal, setOpenModal] = useState(false);

  //방 삭제, 유저프로필 모달 버튼
  const OpenModal = () => {
    setOpenModal((openModal) => !openModal);
  };

  return (
    <React.Fragment>
      <ChatRoom>
        <InnerBox>
          <LeftBox>
            <ProfileImg
              onClick={() => {
                history.push({
                  pathname: `api/chat/enter/${room.roomId}`,
                  state: {
                    location: location,
                  },
                });
              }}
              src={room.opponentImage}
              alt={room.opponentImage}
            />
          </LeftBox>
          <ChatInfo>
            <InfoHead>
              <InfoInner
                onClick={() => {
                  history.push({
                    pathname: `api/chat/enter/${room.roomId}`,
                    state: {
                      location: location,
                    },
                  });
                }}
              >
                <p>{room.opponent}</p>
                {room.lastActivity ? <p>{sendtime}</p> : ""}
              </InfoInner>
              <EditBtn>
                <MoreHorizontalBtn onClick={OpenModal} />
              </EditBtn>
              {openModal && (
                <EditModalSlide
                  FirstBtn="상대방 프로필보기"
                  SecondBtn="채팅방 삭제하기"
                  Profile="profile"
                  FirstClick={() => {
                    history.push(`/user/${room.userRandomId}`);
                  }}
                  openModal={openModal}
                  SecondClick={() => {
                    dispatch(chatActions._deleteRoom(room.roomId));
                    setOpenModal(false);
                  }}
                />
              )}
            </InfoHead>

            <ChatMsg
              onClick={() => {
                history.push({
                  pathname: `api/chat/enter/${room.roomId}`,
                  state: {
                    location: location,
                  },
                });
              }}
            >
              {room.lastMessage === null
                ? `${room.opponent}와 채팅을 시작해보세요!`
                : room.lastMessage}
            </ChatMsg>
          </ChatInfo>
        </InnerBox>
      </ChatRoom>
    </React.Fragment>
  );
};
const EditBtn = styled.div`
  width: 15%;
  color: rgb(249, 200, 82);
  margin: auto;
`;
const MoreHorizontalBtn = styled(MoreHorizontal)`
  &:hover {
    color: #cbcf52;
  }
`;

const ChatRoom = styled.div`
  background: rgba(203, 207, 94, 0.3);
  width: 100%;
  height: 80px;
  display: flex;
  margin: 15px 0px;
  cursor: pointer;
  p {
    line-height: 2px;
  }
  &:hover {
    filter: brightness(90%);
  }
`;
const InnerBox = styled.div`
  display: flex;
  height: 70px;
  width: 95%;
  margin: auto;
`;
const LeftBox = styled.div`
  display: felx;
  justify-content: center;
  align-items: center;
  width: 20%;
`;
const ProfileImg = styled.img`
  border-radius: 50%;
  width: 40px;
  height: 40px;
`;
const ChatInfo = styled.div`
  width: 80%;
  height: 70px;
  display: flex;
  flex-direction: column;
`;
const InfoHead = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  line-height: 14px;
  align-items: center;
`;
const InfoInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 85%;
  height: 25px;
  align-items: center;
  p {
    :nth-child(1) {
      font-weight: 900;
      font-size: 14px;
      margin: auto 10px auto 0px;
      @media screen and (max-width: 320px) {
        font-size: 12px;
      }
    }
    :nth-child(2) {
      font-size: 12px;
      margin: 0px;
      @media screen and (max-width: 320px) {
        font-size: 10px;
      }
    }
  }
`;
const ChatMsg = styled.div`
  margin: auto 0px;
  display: flex;
  align-items: center;
  height: 2.4em;
  line-height: 1.2em;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export default ChatMain;
