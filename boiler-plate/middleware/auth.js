const { User } = require("../models/User");

let auth = (req, res, next) => {
  
  // 인증 처리를 하는곳
  
  // client쿠키에서 토큰을 파싱한다.
  let token = req.cookies.x_auth;
  
  // 토큰을 복호화 한후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({ isAuth: false, error: true });
    
    // req에 넣어줌으로 인해 다음 cb에서 해당정보 사용
    req.token = token;
    req.user = user;

    // middleware다음으로 이동
    next();
  });
  // 유저가 있으면 인증 okay
  
  // 유저가 없으면 인증 No!
}

module.exports = { auth };