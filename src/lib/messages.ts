import { BASE_URL, BASE_URL_WS } from "./url";
import Stomp from "stompjs";
import { writable } from "svelte/store";

export interface Message {
  content: string;
  senderEmail: string;
  senderFirstName: string;
  senderLastName: string;
  dateTime: string;
}

let stompClient: Stomp.Client;

export const chatMessages = writable<Message[]>([]);

export function createConnection(idHoliday: string) {
  const socket = new WebSocket(BASE_URL_WS);
  stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    stompClient.subscribe(`/user/${idHoliday}/private`, function (message) {
      const chatMessage = JSON.parse(message.body) as Message;
      chatMessages.update((messages) => [...messages, chatMessage]);
    });
  });
}

export function closeConnection() {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {});
  }
}

export function sendMessageToServer(
  message: string,
  periodId: string,
  email: string
) {
  if (stompClient && stompClient.connected) {
    const chatmessage = {
      senderMail: email,
      content: message,
      idHoliday: periodId,
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatmessage));
  } else {
    console.error("WebSocket connection not established.");
  }
}

export async function fetchMessages(idHoliday: string, token: string) {
  const res = await fetch(`${BASE_URL}/tchat/${idHoliday}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  if (res.ok) {
    chatMessages.set(json as Message[]);
    return;
  }

  if (json[0].error) {
    throw new Error(json[0].error);
  } else {
    throw new Error(
      "Une erreur est survenue lors de la récupération des messages"
    );
  }
}
