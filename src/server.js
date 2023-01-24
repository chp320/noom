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

function publicRooms() {
    /*
     * socket.io에서는 '개별 소켓'은 서버에서 제공하는 개인공간을 할당받고 그 곳에 들어간다. 즉, 소켓과 서버 사이에 형성된 채팅룸. (private room). 소켓id는 private room 의 id와 동일!
     * 이후 join 메서드를 사용해서 다른 소켓과 그룹을 형성해 채팅룸을 만듦. (public room)
     * adapter 에서 rooms, sids 를 확인할 수 있고.. 아래와 같이 private, public 룸을 확인 가능!
       - private room: sids 내 속성이 rooms 에도 존재한다!
       - public room: sids 내 속성이 rooms 에 없다!!
     */
    // 와... 이런 형태는 '구조 분해 할당' 이라고 한단다...;;
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;

    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key)
        }
    })
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anonymous";   // 닉네임 입력되기 전까지 '익명'으로 표기
    /*
        서버와 통신을 맺고 있는 소켓 어플리케이션은 '어댑터'라는 객체를 통해 관리되고 있다.
        어댑터를 통해 연결되어 있는 소켓 어플리케이션과 채팅룸 수를 확인한다. -> onAny() 메서드 사용!
        * onAny() : 소켓에서 발생하는 모든 이벤트에 대응하는 이벤트 핸들러 등록 메서드.
     */
    socket.onAny((event) => {
        console.log(wsServer.sockets.adapter);
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        done();     // front에서 전달된 콜백함수(done)를 호출한다!
        socket.join(roomName);
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    // disconnecting 과 disconnect 의 차이점? 
    // - disconnecting: 사용자가 채팅룸 나가기 위해 브라우저 끄는 이벤트 발생 시!
    // - disconnect: disconnecting 이후 연결이 완전히 해제되었을 때 발생하는 이벤트!
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));  // disconnecting은 퇴장(연결 해제 직전)할 때 발생하는 이벤트로 나가려는 사람의 수를 빼기 위해서 '-1'을 함.
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    })
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));   // 실제 닉네임으로 변경
});

const handleListen = () => console.log("Listening on http://localhost:3000");
httpServer.listen(3000, handleListen);