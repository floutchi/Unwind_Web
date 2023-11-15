import { BASE_URL, BASE_URL_WS } from "./url";
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

export function createConnection(idHoliday:string) {
    const socket = new WebSocket(BASE_URL_WS);
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
          stompClient.subscribe(`/user/${idHoliday}/private`, function (message) {
            const chatMessage : Message = JSON.parse(message.body);
            chatMessages.update((messages) => [...messages, chatMessage]);
          });
        });
}

export function closeConnection() {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {});
  }
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
    const res = await fetch(`${BASE_URL}/tchat/${idHoliday}`, {
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