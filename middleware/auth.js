const { User } = require('../models/User');
let auth = (req, res, next) => {
    //인증 처리를 하는 곳
    // app.get('/api/users/auth', auth, (req,res) 의 auth 부분

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if (!user) return res.json({ isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next();
})

    //유저가 있으면 인증 true

    //유저가 없으면 인증 false

}

//다른 파일에도 쓸 수 있게 함.
module.exports = {auth};