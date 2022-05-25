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

//회원가입 기능
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