// LIBRARY
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// STYLE
import styled from "styled-components";

// ICON
import { X, CheckSquare } from "react-feather";

// REDUX
import { mypageActions } from "../../redux/modules/mypage";
import { __getCalendarDetail } from "../../redux/modules/cat";
import { history } from "../../redux/configureStore";

const CalendarModal = (props) => {
  const { elm, month, year, setOpenModal, path } = props;
  const dispatch = useDispatch();
  const workDetail = useSelector((state) =>
    path === "mypage" ? state.mypage.calendardetail : state.cat.calendardetail
  );
  const catId = useSelector((state) => state.cat.catinfo?.catId);
  const catName = useSelector((state) => state.cat.catinfo?.catName);

  useEffect(() => {
    path === "mypage"
      ? dispatch(mypageActions._getCalenderDetail(year, month, elm))
      : dispatch(__getCalendarDetail(catId, elm, month, year));
  }, [year, month, elm, catId, path, dispatch]);

  return (
    <>
      <Background>
        <Overlay
          onClick={() => {
            setOpenModal(false);
          }}
        />
        <Window>
          <Wrapper>
            <Head>
              <ViewDate>
                {path === "mypage" ? (
                  <p>
                    집사일기
                    <span>
                      ({year}년{month}월{elm}일)
                    </span>
                  </p>
                ) : (
                  <p>
                    {catName} 를 위한 집사일기
                    <br />
                    <span>
                      ({year}년{month}월{elm}일)
                    </span>
                  </p>
                )}
              </ViewDate>
              <CancleBox>
                <X
                  onClick={() => {
                    setOpenModal(false);
                  }}
                />
              </CancleBox>
            </Head>
            <Events>
              {workDetail.map((eachCatWork, idx) => {
                return (
                  <EventBox
                    key={idx}
                    path={path}
                    onClick={() => {
                      if (path === "mypage") {
                        history.push({
                          pathname: `/catdetail/calendar/${eachCatWork.location}/${eachCatWork.catId}/1`,
                          state: { location: eachCatWork.location },
                        });
                      } else {
                        return;
                      }
                    }}
                  >
                    <CatLeft>
                      <img src={eachCatWork.catImage} alt="catImage" />
                    </CatLeft>
                    <CatRight>
                      {path === "mypage" ? (
                        <p>이름: {eachCatWork.catName}</p>
                      ) : (
                        ""
                      )}
                      <p>동네: {eachCatWork.location}</p>

                      <CatWorkBox>
                        <p>활동: </p>
                        {eachCatWork.food ? (
                          <CheckBox>
                            <CheckSquare />
                            <p>밥주기</p>
                          </CheckBox>
                        ) : (
                          ""
                        )}
                        {eachCatWork.water ? (
                          <CheckBox>
                            <CheckSquare />
                            <p>급수하기</p>
                          </CheckBox>
                        ) : (
                          ""
                        )}
                        {eachCatWork.snack ? (
                          <CheckBox>
                            <CheckSquare />
                            <p>간식주기</p>
                          </CheckBox>
                        ) : (
                          ""
                        )}
                      </CatWorkBox>
                    </CatRight>
                  </EventBox>
                );
              })}
            </Events>
          </Wrapper>
        </Window>
      </Background>
    </>
  );
};

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100%;
`;
const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Window = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  max-width: 420px;
  width: 100vw;
  height: 50vh;
  min-height: 450px;
  border-radius: 20px;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-name: fadeIn;
  animation-fill-mode: forwards;
  background: #fefdf8;
  z-index: 1000;
  overflow: auto;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const Head = styled.div`
  height: 15%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ViewDate = styled.div`
  p {
    width: 100%;
    font-size: 16px;
    font-weight: 900;
    margin: auto;
    text-align: center;
    span {
      font-size: 12px;
    }
  }
`;
const CancleBox = styled.div`
  position: fixed;
  top: 4%;
  left: 85%;
  svg {
    width: 20px;
    height: 20px;
    margin: auto;
    padding: 5px;
    border-radius: 50%;
    background: #fbd986;
  }
`;
const Events = styled.div`
  height: 85%;
  width: 100%;
  margin: auto;
`;
const EventBox = styled.div`
  width: 90%;
  height: 100px;
  margin: auto;
  display: flex;
  border-bottom: 0.2px solid rgba(203, 207, 94, 1);
  cursor:${(props) => props.path === "mypage" && " pointer"} ;
  &:hover {
    background: ${(props) => props.path === "mypage" && "#fff4d9"} 
  }
`;
const CatLeft = styled.div`
  width: 20%;
  min-width: 60px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    @media screen and (max-width: 320px) {
      width: 60px;
      height: 60px;
    }
  }
`;
const CatRight = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 5px;
  p {
    margin: 5px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 500;
  }
`;
const CatWorkBox = styled.div`
  width: 100%;
  display: flex;
`;
const CheckBox = styled.div`
  display: flex;
  svg {
    width: 18px;
    height: 18px;
    margin: 5px 0px;
  }
  p {
    font-size: 12px;
    margin: 5px 0px;
  }
`;

export default CalendarModal;