import { isEmailValid } from "./email";
import { Email } from "./smtp";

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
  return await Email.send({
    Host: "smtp.elasticemail.com",
    Username: "eppe.quentin@gmail.com",
    Password: "85CCEB4C8AA56F6EFC6273BE126323F69FE2",
    To: "eppe.quentin@gmail.com",
    From: "support@eppeque.dev",
    Subject: `${
      reason === "issue" ? "Problème signalé par" : "Demande formulée par"
    } ${email}`,
    Body: content,
  });
}
