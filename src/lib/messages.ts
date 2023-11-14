import { json } from "@sveltejs/kit";
import { BASE_URL } from "./url";

export interface Message {
    content: string;
    senderFirstName: string;
    senderLastName: string;
    dateTime: string;
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