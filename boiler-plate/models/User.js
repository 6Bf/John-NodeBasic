const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  // token 유효기간
  tokenExp: {
    type: Number
  },
});

// save()실행전에 먼저 실행된다.
// callback으로 반드시 function키워드를 사용한 함수를 전달해야한다.
userSchema.pre('save', function(next) {
  var user = this;
  
  // pw를 변경할 경우에만 암호화 로직 실행
  if(user.isModified("password")) {
  
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function (err, hash) {
        if(err) return next(err)

        user.password = hash;
        next();
      });
    });
  } else {
      next();
  }
});

// pw검증 메소드 작성
userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
    
    cb(null, isMatch);
  });
}

// generate Token logic
userSchema.methods.generateToken = function(cb) {
  var user = this;
  // jsonwebtoken을 이용해서 토큰생성
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  
  user.token = token;
  user.save(function(err, user) {
    if(err) return cb(err);
    
    cb(null, user);
  });
};

// 작성한 mongoDB 스키마 생성
const User = mongoose.model('User', userSchema);

module.exports = { User };