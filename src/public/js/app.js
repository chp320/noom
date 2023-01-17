const socket = io();

const welcome = document.getElementById("welcome");
const form = document.querySelector("form");

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", { payload: input.value });    // 이벤트를 발생(emit)시키는 역할. 첫 번째 인자: 이벤트 명, 두 번째 인자: 전송할 데이터(객체 가능)
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);