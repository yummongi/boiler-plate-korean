const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require("./server/middleware/auth");
const { User } = require("./server/models/User");

const config = require('./server/config/key');

//클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있도록 함
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//cookie-parser 사용
app.use(cookieParser());
//aplication/json
app.use(bodyParser.json());

//mongoose db 연결
const mongoose = require('mongoose');
const { Router } = require('express');
mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB 연결됨...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!안녕하세요~~')
});

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요 ~")
})

//회원가입 기능 라우터
app.post('/api/users/register', (req, res) => {

  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    //에러가 날 경우 success: false
    if (err) return res.json({ success: false, err })
    //성공할 경우 success: true
    return res.status(200).json({
      success: true
    });
  });
});

//로그인 기능 라우터
app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      //user에 없으면 json 형식으로 전달
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    //요청한 이메일이 데이터베이스에서 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
    //User.js의 userSchema.methods.comparePassword 부분부터 작동한 후 아래 메소드 작동
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        });

      //비밀번호까지 맞다면 토큰 생성하기.
      //User.js의 userSchema.methods.generateToken 부분부터 작동한 후 아래 메소드 작동

      user.generateToken((err, user) => {
        //에러가 나면 400 상태 메세지와 에러
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 둘 중 하나
        //x_auth의 이름으로 user.token 토큰이 쿠키에 저장
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

//auth 라우터
app.get('/api/users/auth', auth, (req,res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authenication이 True 라는 의미
  res.status(200).json({
    //id 
    _id: req.user._id,
    //0이 아니면 어드민 or 0이면 일반유저
    isAdmin: req.user.role == 0 ? false : true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image
  });
});

//로그아웃 라우터
app.get('/api/users/logout', auth, (req, res) => {
  //유저를 찾아서 Update
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""},
    (err, user) =>{
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})


const port = 5000;
app.listen(port, () =>
  console.log(`서버가 실행되었습니다. 포트: ${port}`))

