const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');

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
userSchema.pre('save', function (next) {
    var user = this;
    //비밀번호일때만,
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {

            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                //오류 시 리턴
                if (err) return next(err);
                //비밀번호를 hash 비밀번호로 변경
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword ex) 1234567
    //암호화된 비밀번호 $2b$10$nN0HBzqv9JNE1oRkT7R30.lkdiTX6427bPDZ9uOWYhwljwLF3KYNy
    //platinPassword를 암호화해서 암호화된 비밀번호랑 같은지 체크

    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // console.log('user._id', user._id)

    // jsonwebtoken을 이용해서 token을 생성하기 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token 
    // -> 
    // 'secretToken' -> user._id

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}
userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에 
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
}
const User = mongoose.model('User', userSchema);

//모델을 다른 파일에도 쓸 수 있음
module.exports = { User };