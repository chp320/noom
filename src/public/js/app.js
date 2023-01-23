const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;     // 최초 접속 시 채팅룸 영역은 히든 처리

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_message",value,roomName,() => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function showRoom() {
    // 채팅룸 이름을 적고 enter_room 이벤트 발생 시 수행되는 부분, 채팅룸 입력 입력창 히든 및 메시지 입력창 노출
    welcome.hidden = true;
    room.hidden = false;
    const h3 = document.querySelector("h3");
    h3.innerHTML = `▶︎ Room ${roomName}`
    const form = room.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);   // enter_room 이름의 이벤트가 입력값(input.value)를 가지고 발생하면, showRoom 함수를 서버로 전달!! server.js 에서는 이를 받아서 호출하는 로직이 추가되어야 한다..
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
    addMessage("someone joined!");
})

socket.on("bye", () => {
    addMessage("someone left ㅠㅠ");
})

socket.on("new_message", (msg) => {
    addMessage(msg);
})