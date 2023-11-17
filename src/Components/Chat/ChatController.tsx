import React, { useEffect, useRef, useState } from "react";
import { chatService } from "../../Services/chatService";
import Paper from "@mui/material/Paper";
import { CompatClient, Stomp } from "@stomp/stompjs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SockJS from "sockjs-client";
import Typography from "@mui/material/Typography";
import { ChatMessage } from "../Interface/ChatMessage";
type Props = {};
export const ChatController = (props: Props) => {
  const [stompClient, setStompClient] = useState<CompatClient | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    chatService
      .getAllMessages()
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
      });

      const socket = new SockJS('http://localhost:8080/ws')
      const stompClient = Stomp.over(socket)
      stompClient.connect({}, function (frame: string) {
        console.log('Connected: ' + frame)
        stompClient.subscribe('/topic/public', function (greeting) {
          const newMessage = JSON.parse(greeting.body)
          newMessage.messageId = messages.length + 1
          setMsg((messages: any) => [...messages, newMessage])
        })
      })
      setStompClient(stompClient)

  }, []);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify({
          content: text,
          sender: "ja",
          type: "CHAT",
        })
      );
      setText("");
    }
  };
  return (
    <div>
      <Paper style={{ margin: "1em", padding: "1em" }}>
        <Typography variant="h4" component="h2">
          Chat Room
        </Typography>
        <div style={{ height: "70vh", overflowY: "auto" }}>
          {messages.map((message) => (
            <div key={message.messageId}>
              <strong>{message.sender}</strong>: {message.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Paper>
      <TextField
        style={{ width: "80%" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="Type a message"
      />
      <Button
        style={{ width: "20%" }}
        onClick={sendMessage}
        variant="contained"
        color="primary"
      >
        Send
      </Button>
    </div>
  );
};
function setMsg(arg0: (msg: any) => any[]) {
  throw new Error("Function not implemented.");
}

