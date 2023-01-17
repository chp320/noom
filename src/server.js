import http from "http"
import SocketIO from "socket.io"
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

// socket.io 설치 후 정상 동작 여부 확인
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("enter_room", (roomName) => console.log(roomName));   // 이벤트 핸들링 메서드 on을 통해서 front에서 보내온 이벤트 처리 (socket.emit으로 전달한 이벤트..)
})

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);