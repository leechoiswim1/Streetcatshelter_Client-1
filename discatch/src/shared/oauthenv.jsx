/* == API KEY */
const KAKAO_LOGIN_API_KEY = process.env.REACT_APP_KAKAO_LOGIN_JAVASCRIPT;

const NAVER_API_KEY = process.env.REACT_APP_NAVER_CLIENT_ID;
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_CLIENT_ID;

/* == dev.environment  - kakao oauth url - 로그인 시 이동하게 되는 소셜 로그인 동의 페이지 */
const dev_redirect_kakao_uri = "http://localhost:3000/user/kakao/callback";
const dev_redirect_naver_uri = "http://localhost:3000/user/naver/callback";
const dev_redirect_google_uri = "https://localhost:3000/user/google/callback";
/* == production       - kakao oauth url */
const redirect_kakao_uri = "https://discatch.site/user/kakao/callback";
const redirect_naver_uri = "https://discatch.site/user/naver/callback";
const redirect_google_uri = "https://discatch.site/user/google/callback";

/* == dev.environment  - Redirect URI */
const dev_oauthKaKaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_LOGIN_API_KEY}&redirect_uri=${dev_redirect_kakao_uri}&response_type=code`;
const dev_oauthNaverURL = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_API_KEY}&redirect_uri=${dev_redirect_naver_uri}&response_type=code`;

/* == production       - Redirect URI  */
const oauthKaKaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_LOGIN_API_KEY}&redirect_uri=${redirect_kakao_uri}&response_type=code`;
const oauthNaverURL = `https://nid.naver.com/oauth2.0/authorize?client_id=${NAVER_API_KEY}&redirect_uri=${redirect_naver_uri}&response_type=code`;

export {
  dev_oauthKaKaoURL,
  dev_oauthNaverURL,
  GOOGLE_API_KEY,
  oauthKaKaoURL,
  oauthNaverURL,
  dev_redirect_google_uri,
  redirect_google_uri,
};
