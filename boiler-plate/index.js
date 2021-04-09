const express = require("express");
const app = express();
const port = 8000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

// mongo DB 연결
mongoose.connect('db-info', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDb Connect..."))
  .catch((err) => console.log(err));

// /에 get요청시 전달할 내용
app.get('/', (req, res) => res.send("<h1>Welcome!!</h1><p>This is <mark>Kermit</mark> World!</p>"));

// 회원가입 라우터
app.post('/register', (req, res) => {
  
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

// express서버 실행
app.listen(port, () => console.log(`Start Kermit Server on port ${port}`));