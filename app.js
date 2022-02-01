const express = require("express");
const connect = require("./schemas")
const app = express();
const port = 3000;
// mongodb 연결
connect();
// articles 라우터 연결
const articlesRouter = require("./routes/articles")
const usersRouter = require("./routes/users");
// url과 입력과 출력이 일어난 시간이 찍히는 미들웨어 생성
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, "-", new Date())
    next();
};

// html파일을 읽어오기, json형식 사용, 사용한 api와 시간 찍히는 미들웨어 사용
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleware);
// articles 라우터 사용
app.use("/api", [articlesRouter, usersRouter]);

app.get('/', (req, res)=> {
    res.send("Hello World@@@");
});

app.listen(port, () => {
    console.log(port,"포트로 서버가 켜졌어요!")
});