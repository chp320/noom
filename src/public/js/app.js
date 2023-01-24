const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const call = document.getElementById("call");

let myStream;
let muted = false;
let cameraoff = false;

async function getCameras() {
    // 모든 미디어 기기를 가져오는 기능
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log(devices);
        const cameras = devices.filter((device) => device.kind === "videoinput");   // filter 메서드를 사용해서 kind가 videoinput 인 미디어 기기만으로 구성된 cameras 배열 생성
        const currentCamera = myStream.getVideoTracks()[0];
        // 추출된 cameras 를 select 하위 요소로 추가!
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label == camera.label) {
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        });
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstraints = {
        audio: true,
        video: { facingMode: "user" }   // 모바일 장치의 전면 카메라
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } }
    };
    // 영상과 음성을 가져오는 스트림
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
        // {
        //     audio: true,
        //     video: true,
        // });
        deviceId ? cameraConstraints : initialConstraints
        );
        // 스트림으로 받아 온 영상을 화면에 직접 표시 -> 스트림을 myFace 안에 노출
        myFace.srcObject = myStream;    // srcObject 속성은.... 이것도 자바스크립트 기능인가? ㅋ
        if(!deviceId) {
            await getCameras();
        }
    } catch (e) {
        console.log(e);
    }
}

// getMedia();

function handleMuteClick() {
    console.log(myStream.getAudioTracks());
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    if(!muted) {
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick() {
    console.log(myStream.getVideoTracks());
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    if(!cameraoff) {
        cameraBtn.innerText = "Turn Camera On";
        cameraoff = true;
    } else {
        cameraBtn.innerText = "Turn Camera Off";
        cameraoff = false;
    }
}

async function handleCameraChange() {
    // console.log(cameraSelect.value);
    await getMedia(cameraSelect.value);
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);     // 입력값이 변경 시 input 이벤트 발생


// Welcome Form (join a room, 채팅룸 입장과 관련된 기능 추가)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

call.hidden = true;

function startMedia() {
    welcome.hidden = true;
    call.hidden = false;
    getMedia();
}

function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    socket.emit("join_room", input.value, startMedia);  // join_room 이벤트 발생 시 startMedia 콜백함수도 서버로 함께 넘겨준다.
    input.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);