const express = require('express');
const app = express();
const port = 8000;
const mongoose = require('mongoose');

// mongo DB 연결
mongoose.connect('DB-info', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDb Connect..."))
  .catch((err) => console.log(err));

// /에 get요청시 전달할 내용
app.get('/', (req, res) => res.send("<h1>Welcome!!</h1><p>This is <mark>Kermit</mark> World!</p>"));

// express서버 실행
app.listen(port, () => console.log(`Start Kermit Server on port ${port}`));