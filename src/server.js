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
    socket.on("enter_room", (roomName, done) => {
        console.log(roomName);
        // 5000 밀리초(= 5초) 뒤에 done() 호출하겠음!! 즉, 파라미터 done 으로 전달된 콜백 함수를 실행하겠다는 것!
        setTimeout(() => {
            done();
        }, 5000);
    });
})

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);