// alert("hi!");

// 자바스크립트 내장 객체 WebSocket을 이용해서 소켓을 생성 -> 생성자 함수에 인자로 "접속하고자 하는 URL"을 전달!
// const socket = new WebSocket("http://localhost:3000");  // 웹소켓 프로토콜이 아닌 http 프로토콜을 인자로 전달하면서 오류 발생!

const socket = new WebSocket(`ws://${window.location.host}`);

// 요소에 이벤트 등록을 위해서 선택 및 네이밍 설정
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");


/*
 * 서버에서 보낸 메시지를 확인할 수 있도록 코드 수정!
 * -> 서버에서 보낸 메시지는 브라우저(사용자)에서 하나의 이벤트로써 이를 처리할 수 있도록 할 것임!
 */
socket.addEventListener("open", () => {
    console.log("Connected to Server");
})

socket.addEventListener("message", (message) => {
    console.log("Just got this:", message.data, "from the server");
})

socket.addEventListener("close", () => {
    console.log("Disconnected from Server");
})

/*
// 브라우저(사용자)가 서버에서 메시지 보내는 로직
setTimeout(() => {
    socket.send("hello from browser!");
}, 5000);
*/

// 입력폼 form에서 submit 이벤트 발생 시 처리하기 위한 함수 정의
function handleSubmit(event) {
    event.preventDefault();     // 기본 이벤트핸들러 해제
    const input = messageForm.querySelector("input");   // 입력폼 form에서 input으로 전달된 요소를 선택 및 네이밍(input) 설정
    socket.send(input.value);   // 소켓을 이용해서 input에 입력된 값을 전송
    input.value = "";   // input에 입력된 값(value)을 초기화한다.
}
messageForm.addEventListener("submit", handleSubmit);   // submit 이 발생했을 때, handleSubmit 콜백함수 호출