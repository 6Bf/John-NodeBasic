const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/key");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");

const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

// mongo DB 연결
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDb Connect..."))
  .catch((err) => console.log(err));

// 엔트포인트 /, get요청시 전달할 내용
app.get('/', (req, res) => res.send("<h1>Welcome!!</h1><p>This is <mark>Hacker</mark> World!</p>"));

// register router
app.post('api/users/register', (req, res) => {
  
  // 회원가입할때 필요한 정보들을 client에서 가져오면
  // 가져온 정보들을 DB에 넣어준다.
  
  // User 인스턴스 생성
  const user = new User(req.body);
  
  // mongo에 데이터 저장
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err});
    
    return res.status(200).json({
      success: true
    });
  });
});

// login register
app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }
    
    // 유저가 db에 존재한다면
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) {
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다!!!"});
      }
      
      // 비밀번호가 맞다면 토큰 생성하기!
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // 토큰을 쿠키에 저장
        res.cookie("x_auth", user.token)
          .status(200)
          .json({
            loginSuccess: true,
            userId: user._id
          });
      });
    });
  });
});

// auth router
// add "auth" middleware
app.get('api/users/auth', auth, (req, res) => {
  // 여기까지 middleware를 통과해왔다는 말은
  // Authentication이 True라는 의미
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false: true,
    isAuth: true,
    email: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  });
});

// express서버 실행
app.listen(port, () => console.log(`Start Kermit Server on port ${port}`));