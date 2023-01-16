import http from "http"
import WebSocket from "ws";
/* express: Node.js 환경에서 API 서버를 개발할 때 사용할 수 있는 웹 프레임워크. HTTP를 기반으로 동작함. */
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");
// app.listen(3000, handleListen);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });   // 웹소켓 서버 생성하면서 http서버를 전달. 2가지 프로토콜(http, websocket)을 사용하기 위한 목적으로 설정


/* [ 콜백함수를 on 메서드 안으로 넣기 위한 정리! ]
// 웹소켓 이벤트 핸들링
function handleConnection(socket) {
    console.log(socket)
}
// 웹소켓 서버의 on메서드: 첫 번째 인자의 이벤트가 발생 시, 두 번째 인자에 적혀 있는 콜백함수를 호출
wss.on("connection", handleConnection)
*/

// 익명함수를 만들어 on 메서드에 포함하는 형태로 수정
wss.on("connection", (socket) => {
    // console.log(socket);
    console.log("Connected to Browser");
    socket.on("close", () => console.log("Disconnected from Browser"));     // 웹소켓의 close 이벤트 발생 시 처리 로직
    socket.on("message", (message) => {
        console.log(`${message}`)
    });
    socket.send("hello!!");
})


server.listen(3000, handleListen);