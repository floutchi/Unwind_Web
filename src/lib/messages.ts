import { BASE_URL } from "./url";
import Stomp from 'stompjs';
import { user } from '$lib/auth';
import { get } from 'svelte/store';
import { writable } from "svelte/store";

export interface Message {
    content: string;
    senderEmail: string;
    senderFirstName: string;
    senderLastName: string;
    dateTime: string;
}

export let stompClient: Stomp.Client;

export const chatMessages = writable<Message[]>([]);

export function createConnection(userMail:string) {
    const socket = new WebSocket('ws://localhost:8080/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
          console.log('Connected: ' + frame);
          stompClient.subscribe(`/user/${userMail}/private`, function (message) {
            const chatMessage : Message = JSON.parse(message.body);
            chatMessages.update((messages) => [...messages, chatMessage]);
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

export async function fetchMessages(token: string, idHoliday: string): Promise<Message[]> {
    const res = await fetch(`http://localhost:8080/tchat/${idHoliday}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok) {
        return json as Message[];
      }


      if(json[0].error) {
        throw new Error(
            json[0].error
          );
      } else {
        throw new Error(
            "Une erreur est survenue lors de la récupération des messages"
          );
      }
}