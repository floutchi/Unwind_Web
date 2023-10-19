import { Email } from "./smtp";

export function verifyData(email: string, reason: string, content: string) {
  if (email.trim() === "" || reason.trim() === "" || content.trim() === "") {
    throw new Error("Veuillez remplir tous les champs");
  }

  const re =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  if (!re.test(email))
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
