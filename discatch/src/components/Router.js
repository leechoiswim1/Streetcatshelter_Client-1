// LIBRARY
import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { history } from "../redux/configureStore";

// AUTH
import Auth from "../shared/auth";

// PAGES
import {
  Home,
  Slider,
  MyPageCat,
  MyPageWork,
  MyPageNoticeList,
  MyPageNotices,
  UserInfoWrite,
  CatInfoWrite,
  CatDetailInfoWrite,
  CatDetail,
  CatDetailInfo,
  CommunityPostWrite,
  CommunityPostEdit,
  CommunityDetail,
  NotFound,
  CommunityPostDetail,
  Community,
  Login,
  Map,
  ChatMainPage,
  ChatRoomPage,
  LoginRedirectKakao,
  LoginRedirectNaver,
  LoginRedirectGoogle,
  RandomUserProfile,
} from "../pages";

// * == ( Router ) -------------------- * //
const Router = () => {
  useEffect(() => {
    const Onboarding = localStorage.getItem("onboarding");
    if (!Onboarding || Onboarding === null) history.push("/slider");
  }, []);

  return (
    <Switch>
      {/* == Login */}
      <Route path="/login" component={Auth(Login, false)} exact />
      <Route
        path="/user/kakao/callback"
        component={Auth(LoginRedirectKakao, false)}
        exact
      />
      <Route
        path="/user/naver/callback"
        component={Auth(LoginRedirectNaver, false)}
        exact
      />
      <Route
        path="/user/google/callback"
        component={Auth(LoginRedirectGoogle, false)}
        exact
      />

      {/* == Home */}
      <Route path="/" component={Auth(Home, true)} exact />

      {/* == Slider */}
      <Route path="/slider" exact component={Slider} />

      {/* == MyPage */}
      <Route path="/mypage" component={Auth(MyPageCat, true)} exact />
      <Route
        path="/user/:userRandomId"
        component={Auth(RandomUserProfile, true)}
        exact
      />
      <Route
        path="/mypage/notice"
        component={Auth(MyPageNoticeList, true)}
        exact
      />
      <Route
        path="/mypage/notice/:noticeId"
        component={Auth(MyPageNotices, true)}
        exact
      />
      <Route path="/mypage/work" component={Auth(MyPageWork, true)} exact />
      <Route path="/userinfowrite" exact component={UserInfoWrite} />
      <Route path="/userinfoedit" exact component={UserInfoWrite} />
      <Route
        path="/userinfowrite"
        component={Auth(UserInfoWrite, true)}
        exact
      />
      <Route path="/userinfoedit" component={Auth(UserInfoWrite, true)} exact />

      {/* == Cat */}
      <Route path="/catinfowrite" component={Auth(CatInfoWrite, true)} exact />
      <Route
        path="/catinfoedit/:catId"
        component={Auth(CatInfoWrite, true)}
        exact
      />
      <Route
        path="/catinfowrite/:location"
        component={Auth(CatInfoWrite, true)}
        exact
      />
      <Route
        path="/catdetailinfowrite"
        component={Auth(CatDetailInfoWrite, true)}
        exact
      />
      <Route
        path="/catdetailinfowrite/:catId"
        component={Auth(CatDetailInfoWrite, true)}
        exact
      />
      <Route
        path="/catdetailinfoedit/:catDetailId"
        component={Auth(CatDetailInfoWrite, true)}
        exact
      />

      <Route
        path="/catdetail/:menu/:village/:catId"
        component={Auth(CatDetail, true)}
        exact
      />

      <Route
        path="/catdetail/:menu/:village/:catId/1"
        component={Auth(CatDetail, true)}
        exact
      />
      <Route
        path="/catdetail/:menu/:village/:catId/2"
        component={Auth(CatDetail, true)}
        exact
      />
      <Route
        path="/catdetail/:menu/:village/:catId/3"
        component={Auth(CatDetail, true)}
        exact
      />
      <Route
        path="/catdetailinfo"
        component={Auth(CatDetailInfo, true)}
        exact
      />
      <Route
        path="/catdetailinfo/:village/:catDetailId"
        exact
        component={Auth(CatDetailInfo, true)}
      />

      {/* == Community */}
      <Route
        path="/community/:village/:category/write"
        component={Auth(CommunityPostWrite, true)}
        exact
      />
      <Route
        path="/communitypostedit"
        component={Auth(CommunityPostEdit, true)}
        exact
      />
      <Route
        path="/community/:village/:category/postedit/:communityId"
        component={Auth(CommunityPostEdit, true)}
        exact
      />
      <Route
        path="/community/:village/:category"
        component={Auth(CommunityDetail, true)}
        exact
      />
      <Route
        path="/communitypostdetail"
        component={Auth(CommunityPostDetail, true)}
        exact
      />
      <Route
        path="/community/:village/:category/postdetail/:communityId"
        component={Auth(CommunityPostDetail, true)}
        exact
      />
      <Route path="/community" component={Auth(Community, true)} exact />

      {/* Map */}
      <Route path="/map/:village" component={Auth(Map, true)} exact />
      <Route path="/map/:village/:id" component={Auth(Map, true)} exact />

      {/* Chat */}
      <Route path="/chat" component={Auth(ChatMainPage, true)} exact />
      <Route
        path="/api/chat/enter/:roomId"
        component={Auth(ChatRoomPage, true)}
        exact
      />
      <Route path={"*"} exact component={NotFound} />
    </Switch>
  );
};

export default Router;
