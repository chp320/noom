const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);   // enter_room 이름의 이벤트가 입력값(input.value)를 가지고 발생하면, showRoom 함수를 서버로 전달!! server.js 에서는 이를 받아서 호출하는 로직이 추가되어야 한다..
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);