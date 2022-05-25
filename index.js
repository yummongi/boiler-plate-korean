const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require("./models/User");

const config = require('./config/key');

//클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있도록 함
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//aplication/json
app.use(bodyParser.json());

//mongoose db 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB 연결됨...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!안녕하세요~~')
})

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 포트: ${port}`)
})

//회원가입 기능 라우터
app.post('/register', (req, res) => {

  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    //에러가 날 경우 success: false
    if(err) return res.json({ success: false, err})
    //성공할 경우 success: true
    return res.status(200).json({
      success: true
    })
  })
})

//로그인 기능 라우터
app.post('/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      //user에 없으면 json 형식으로 전달
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
  })
  //요청한 이메일이 데이터베이스에서 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
  //User.js의 userSchema.methods.comparePassword 부분부터 작동한 후 아래 메소드 작동
  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

    //비밀번호까지 맞다면 토큰 생성하기.
    user.generateToken((err, user) => {

    })
    
  })
})
