import React, { useEffect, useRef, useState } from "react";
import { apiService } from "../../Services/ApiService";
import Paper from "@mui/material/Paper";
import { CompatClient, Stomp } from "@stomp/stompjs";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SockJS from "sockjs-client";
import Typography from "@mui/material/Typography";
import { ChatMessage } from "../Interface/ChatMessage";
import { styled } from "@mui/material/styles";
import {Box} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from '@mui/icons-material/Send';

interface MessageBubbleProps {
    owner: 'mine' | 'theirs';
}
type Props = {};
const ChatContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
});

const ChatPaper = styled(Paper)({
    margin: '1em',
    padding: '1em',
    width: '60%'
});

const ChatMessages = styled(Box)({
    height: '70vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
});

const MessageBubble = styled(Box)<MessageBubbleProps>(({ theme, owner }) => ({
    maxWidth: '60%',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: '20px',
    alignSelf: owner === 'mine' ? 'flex-end' : 'flex-start',
    backgroundColor: owner === 'mine' ? '#0b93f6' : '#e5e5ea',
    color: owner === 'mine' ? 'white' : 'black', // Definicja 'color' tylko raz
}));

const MessageInput = styled(Box)({
    display: 'flex',
    width: '60%',
    marginTop: '1em'
});

const InputField = styled(TextField)({
    flexGrow: 1,
    marginRight: '1em'
});

const SendButton = styled(Button)({
    width: '20%'
});
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
        apiService
            .getAllMessages()
            .then((data) => {
                setMessages(data);
            })
            .catch((err) => {
                console.error("Error fetching messages:", err);
            });

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame: string) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/public', function (greeting) {
                const newMessage = JSON.parse(greeting.body)
                newMessage.messageId = messages.length
                setMessages(messages => [...messages, newMessage])
            });
        });
        setStompClient(stompClient);

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [messages.length]);

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
        <ChatContainer>
            <ChatPaper>
                <Typography variant="h4" component="h2">
                    Chat Room
                </Typography>
                <ChatMessages>
                    {messages.map((message) => (
                        <MessageBubble key={message.messageId} owner={message.sender === "ja" ? "mine" : "theirs"}>
                            <Typography variant="body1">{message.content}</Typography>
                            <Typography variant="caption">{message.sender}</Typography>
                        </MessageBubble>
                    ))}
                    <div ref={messagesEndRef} />
                </ChatMessages>
            </ChatPaper>
            <MessageInput>
                <InputField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message"
                    variant="outlined"
                    color="primary"
                    size="small"
                />
                <SendButton
                    onClick={sendMessage}
                    variant="outlined"
                    color="primary"
                    startIcon={<SendIcon />}

                >
                    Wyślij
                </SendButton>
            </MessageInput>
        </ChatContainer>
    );
};
