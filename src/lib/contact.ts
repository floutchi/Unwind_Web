import { isEmailValid } from "./email";
import { BASE_URL } from "./url";

export interface Mail {
  senderEmail: string;
  subject: string;
  body:string;
}

export function verifyData(email: string, reason: string, content: string) {
  if (email.trim() === "" || reason.trim() === "" || content.trim() === "") {
    throw new Error("Veuillez remplir tous les champs");
  }

  if (!isEmailValid(email))
    throw new Error("Le format de l'adresse e-mail est invalide");

  if (reason !== "issue" && reason !== "request")
    throw new Error("La raison du contact est invalide");
}

export async function sendEmail(
  email: string,
  reason: string,
  content: string
): Promise<string> {

  const mail: Mail = {
    senderEmail: email,
    subject: `${
      reason === "issue" ? "Problème signalé par" : "Demande formulée par"
    } ${email}`,
    body: content,
  };

  const res = await fetch(`${BASE_URL}/home/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(mail),
  });

  console.log(JSON.stringify(mail));

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Une erreur inconnue est survenue");
  }

  return "OK";
}
