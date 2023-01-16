// alert("hi!");

// 자바스크립트 내장 객체 WebSocket을 이용해서 소켓을 생성 -> 생성자 함수에 인자로 "접속하고자 하는 URL"을 전달!
// const socket = new WebSocket("http://localhost:3000");  // 웹소켓 프로토콜이 아닌 http 프로토콜을 인자로 전달하면서 오류 발생!

const socket = new WebSocket(`ws://${window.location.host}`);

// 요소에 이벤트 등록을 위해서 선택 및 네이밍 설정
const messageList = document.querySelector("ul");
// 입력폼이 여러 곳에서 인입될 것이므로 각 form을 구분하기 위함 (#는 id를 의미)
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");


/*
 * JSON을 문자열로 변환하는 함수
 * param
 * - type: 입력 값 유형
 * - payload: 실제 입력 값
 */
function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}



/*
 * 서버에서 보낸 메시지를 확인할 수 있도록 코드 수정!
 * -> 서버에서 보낸 메시지는 브라우저(사용자)에서 하나의 이벤트로써 이를 처리할 수 있도록 할 것임!
 */
socket.addEventListener("open", () => {
    console.log("Connected to Server");
})

socket.addEventListener("message", (message) => {
    // 수신한 메시지를 화면에 출력하기 위해서,, 메시지 전송 시마다 1) li 요소를 만들고 2) 그 안에 메시지 적고 3) li를 ul 안으로 넣기
    const li = document.createElement("li");    // li 요소를 생성
    li.innerHTML = message.data;    // li 요소에 message.data 를 통해서 전달받은 메시지를 대입
    messageList.append(li);
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
    socket.send(makeMessage("new_message", input.value));
    input.value = "";   // input에 입력된 값(value)을 초기화한다.
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);   // submit 이 발생했을 때, handleSubmit 콜백함수 호출
nickForm.addEventListener("submit", handleNickSubmit);