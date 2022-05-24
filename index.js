const express = require('express')
const app = express()
const port = 5000


//mongoose db 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://user:abcd1234@webproject-final.lmlui.mongodb.net/?retryWrites=true&w=majority', {
    //에러 뜨지 않게 하기 위한 설정
    //useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB 연결됨...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!안녕하세요')
})

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. 포트: ${port}`)
})
