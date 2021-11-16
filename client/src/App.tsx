import "./App.css";
import { io } from "socket.io-client";
import { useState } from "react";
import Chat from "./components/Chat";

const socket = io("ws://localhost:3001/", {});

socket.on("connect", () => {
  console.log(`connect ${socket.id}`);
});

socket.on("disconnect", () => {
  console.log(`disconnect`);
});
function App() {
  const [username, setUsername] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [showChat, setShowChat] = useState<boolean>(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat && (
        <>
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room Id"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </>
      )}
      {showChat && <Chat socket={socket} username={username} room={room} />}
    </div>
  );
}

export default App;
