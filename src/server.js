import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName, done) => {
        socket.join(roomName);  // 사용자를 roomName 채팅룸에 접속시켜 줌
        done();     // front에서 전달한 콜백함수를 처리. 여기서는 startMedia()
        socket.to(roomName).emit("welcome");
    });
    // 클라이언트에서 offer 이벤트 보내면, 해당 채팅룸(roomName)에 해당하는 모든 사옹자(클라이언트)에게 offer이벤트와 offer 객체를 전달!
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
});

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);