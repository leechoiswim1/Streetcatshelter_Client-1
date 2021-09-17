import React from "react";
import { useDispatch, useSelector } from 'react-redux';

// COMPONENTS
import { Template, CommunityPostList, CommunityPost } from "../components";

// STYLE
import styled, { css } from "styled-components";

// ELEMENTS
import { Grid, Button, Text } from "../elements/index";

// ROUTE
import { Link, useLocation } from "react-router-dom";

//ICON
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

// FUNCTION
import InfinityScroll from '../shared/InfinityScroll';
import { getCommunityDB } from '../redux/modules/community';

// REDUX
import { history } from "../redux/configureStore";

const CommunityDetail = (props) => {
  const location2 = useLocation()
  console.log(location2.state);
  const dispatch = useDispatch();
  // const category1 = 'category1';
  // const category2 = 'category2';
  // const category3 = 'category3';
  //
  const location = '망원동';

  // const communityList = useSelector((state) =>
  //   state.community.list ? state.community.list : Array(0, 2, 34),
  // );

  const path = useLocation();
  let category = null;
  if (path.pathname === "/community/catinfo") {
    category = "고양이 정보글";
  } else if (path.pathname === "/community/gathering") {
    category = `${location} 동네 모임`;
  } else if (path.pathname === "/community/sharing") {
    category = `${location} 고양이 용품 나눔`;
  }

  // React.useEffect(() => {
  //   dispatch(getCommunityDB(category, location));
  // }, []);

  return (
    <Template props={props}>
      <Grid
        bgColor="bgColor"
        margin="-10vh 0 0 0"
        addstyle={() => {
          return css`
            position: relative;
            top: 80px;
          `;
        }}
      >
        <CommunityDetailStyle>
          <Grid
            width="350px"
            addstyle={() => {
              return css`
                position: relative;
                margin: 10px auto;
                font-size: 18px;
                font-weight: bold;
                top: 90px;
              `;
            }}
          >
            <Text size="18px" margin="-80px 0 0 0">
              {category}
            </Text>
          </Grid>
          <Grid margin="-570px 0 0 0">

          {/* {communityList.length ? (
          communityList.map((community, idx) => {
            return <CommunityPost key={idx} {...community} />;
          })
        ) : (
          <></>
        )} */}
            <CommunityPost category={category}/>
            <CommunityPost category={category}/>
            <CommunityPost category={category}/>
            
          </Grid>
        </CommunityDetailStyle>
        {/* <Link to="/communitypostwrite"> */}
          <Button 
            clickEvent={()=>history.push({
              pathname: '/communitypostwrite',
              category: category,
            })} 
            is_float="is_float">
            <FontAwesomeIcon icon={faPencilAlt} style={{ width: "20px" }} />
          </Button>
        {/* </Link> */}
      </Grid>
    </Template>
  );
};

const CommunityDetailStyle = styled.div`
  width: 100%;
  overflow-x: hidden;
  height:90vh;
  /* overflow-y: scroll;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  } */
`;

export default CommunityDetail;
