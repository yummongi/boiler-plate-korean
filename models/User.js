const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Salt를 이용해서 비밀번호를 암호화 하기 위해 생성
//Salt가 몇글자인가? 
//10자리 암호화
const saltRounds = 10;
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
        type: Number
    }
})

//저장하기 전에 함수를 실행하고 index 라우터로 이동
userSchema.pre('save', function( next ){
    let user = this;
    //비밀번호일때만,
    if(user.isModified('password')) {
     //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt){
           
        if(err) return next(err)

        bcrypt.hash(user.password , salt, function(err, hash){
            //오류 시 리턴
            if(err) return next(err)
            //비밀번호를 hash 비밀번호로 변경
            user.password = hash
            next()
            })
        })
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword ex) 1234567
    //암호화된 비밀번호 $2b$10$nN0HBzqv9JNE1oRkT7R30.lkdiTX6427bPDZ9uOWYhwljwLF3KYNy
    //platinPassword를 암호화해서 암호화된 비밀번호랑 같은지 체크

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err),
            cb(null, isMatch)
    })
}

const User = mongoose.model('User', userSchema)

//모델을 다른 파일에도 쓸 수 있음
module.exports = { User }