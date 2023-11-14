import Stomp from 'stompjs';
import { user } from '$lib/auth';
import { get } from 'svelte/store';

export let stompClient: Stomp.Client;

export function createConnection(userMail:string) {
    const socket = new WebSocket('ws://studapps.cg.helmo.be:5011/REST_DETI_EPPE/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
          console.log('Connected: ' + frame);
          stompClient.subscribe(`/user/${userMail}/private`, function (message) {
            console.log(message);
          });
        });
}

export function sendMessageToServer(message:string, periodId:string) {
    if (stompClient && stompClient.connected) {
        const u = get(user)!;
        var chatmessage = {
            senderMail : u.email,
            content : message,
            idHoliday : periodId
        }
        console.log(chatmessage);
        stompClient.send('/app/message', {}, JSON.stringify(chatmessage));
    } else {
        console.error('WebSocket connection not established.');
    }
  }