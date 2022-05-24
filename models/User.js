const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    //이름
    name: {
        type: String,
        maxlength: 50
    },
    //이메일
    email: {
        type: String,
        //이메일의 스페이스 (공간)을 없애주는 역할
        trim: true,
        uniquie: 1
    },
    //비밀번호
    password: {
        type: String,
        minlength: 5
    },
    //이름
    lastname: {
        type: String,
        maxlength: 50
    },
    //일반 유저와 관리자 판가름 
    role: {
        //1이면 관리자, 0이면 일반 유저 이런식으로 가능
        type: Number,
        default: 0
    },
    //이미지
    image: String,
    //유효성 관리 
    token: {
        type: String
    },
    //토큰 유효기간
    tokenExp: { 
        type: Numer
    }
})

const User = mongoose.model('User', userSchema)

//모델을 다른 파일에도 쓸 수 있음
module.exports = { User }