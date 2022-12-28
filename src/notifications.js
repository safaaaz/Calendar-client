import * as SockJS from 'sockjs-client';
import { serverAddress } from "./constants";
import { Stomp } from '@stomp/stompjs';

const socketFactory = () => {
    return new SockJS(serverAddress + '/ws');
}

let stompClient;

const onMessageReceived = (payload) => {
    let email = localStorage.getItem("email");
    const message1 = JSON.parse(payload.body);
    console.log(message1.relevantUsers);
    if(message1.relevantUsers.includes(email)){
        alert(message1.message);
    }
}
const onConnected = () => {
    console.log("subscribing to messages");
    stompClient.subscribe('/topic/updates/', onMessageReceived);
    //stompClient.send("/app/join/", [],JSON.stringify({ user: "hi"}));
}

const openConnection = () => {
    const socket = socketFactory();
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected);
}

export {openConnection,stompClient}