import io from "socket.io-client";

let socket; // 전역 소켓 변수

// 소켓 초기화 함수
export const initializeSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SERVER_URL, { autoConnect: false });
  }
  return socket;
};

export const connectSocket = (email) => {
  socket.auth = { email }; // 인증 정보를 전달
  if (!socket.connected) {
    socket.connect(); // 소켓 연결
  }
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('소켓제거');
    socket.disconnect();
  }
};
