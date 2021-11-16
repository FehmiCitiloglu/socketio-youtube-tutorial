import React, { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

interface Props {
  socket: any;
  username: string;
  room: string;
}

const Chat = ({ socket, room, username }: Props) => {
  const [comingData, setComingData] = useState<any>();
  const imageRef = useRef<any>();

  const sendMessage = async () => {
    if (imageRef.current !== "") {
      const messageData = {
        room: room,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
        media: imageRef.current.value,
      };

      await socket.emit("send_message", messageData);
    }
    socket.on("image", (image: any) => {
      console.log(image);

      if (image) {
        let img = new Image();
        img.src = "data:image/jpeg;base64," + image.buffer;
        setComingData(img);
      }
    });
  };

  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      console.log(data);
    });
  }, [socket]);

  return (
    <div>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        {
          comingData && <img src={comingData.src} alt="" />

          // <Canvas image={comingData} />
        }
      </div>
      <div className="chat-footer">
        <label htmlFor="img">Select image:</label>
        <input
          type="file"
          name="img"
          id="img"
          accept="image/*"
          ref={imageRef}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
