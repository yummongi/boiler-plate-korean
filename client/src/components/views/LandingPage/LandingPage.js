import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage() {

    //랜딩 페이지에 들어오면 아래 코드 실행
    useEffect(()=>{
        //get 방식으로 index.js 서버로 response
        axios.get('/api/hello')
        //서버에서 돌아오는 response 를 실행
        .then(response => console.log(response.data))
    }, [])
    return (
        <div>LandingPage 랜딩 페이지</div>
    )
}

export default LandingPage