// LIBRARY
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

// COMPONENTS
import {
  Template,
  ChatMain,
  SecondHeader,
  SecondSpinner,
  EmptyPost,
} from "../../components";

// REDUX
import { useDispatch } from "react-redux";
import { chatActions } from "../../redux/modules/chat";

// MOMENT
import moment from "moment";

const ChatMainPage = (props) => {
  const dispatch = useDispatch();
  const isLoaded = useSelector((state) => state.chat.isLoaded);
  const rooms = useSelector((state) => state.chat.roomlist);
  //채팅리스트가져오기
  useEffect(() => {
    dispatch(chatActions._getRooms());
  }, [dispatch]);

  return (
    <>
      <SecondSpinner visible={isLoaded} />
      <Template props={props} page="map">
        <SecondHeader title="채팅" />
        <div>
          {rooms && rooms.length > 0 ? (
            <>
              {rooms.map((room, idx) => {
                //header 마지막 활동 시간
                const LastActivity = moment(room.lastActivity).format(
                  "YYYY-MM-DD HH:MM"
                );
                const hourDiff = moment(LastActivity).diff(moment(), "hours");
                // format 1, 활동한 지 하루 경과했을 경우 : YYYY.MM.DD hh:mm
                const updated = moment(LastActivity).format("YYYY-MM-DD");
                // format 2, 활동한 지 하루 이내일 경우 : 'n 분 전, n 시간 전'
                const recentlyUpdated = moment(LastActivity).fromNow();
                //시간 경과에 따라 시간포맷변경(하루기준)
                const sendtime = hourDiff > -22 ? recentlyUpdated : updated;
                return (
                  <ChatMain
                    props={props}
                    sendtime={sendtime}
                    room={room}
                    key={idx}
                  />
                );
              })}
            </>
          ) : (
            <EmptyPost path="chat" />
          )}
        </div>
      </Template>
    </>
  );
};

export default ChatMainPage;
