import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SERVER_URL, {
  withCredentials: true, // 쿠키 포함
  extraHeaders: {
    "Access-Control-Allow-Credentials": "true",
  },
});
socket.on("connect", () => {
  console.log("소켓 연결 성공:", socket.id);

});


socket.on("disconnect", () => {
  console.log("소켓 연결 끊김");
});
export default socket;
