
//process.env.NODE_ENV 환경 변수
//Local 환경일 경우 development 
//Deploy(배포) 한 후 이면 production 이라고 뜬다.

if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
}else{
    module.exports = require('./dev');
}