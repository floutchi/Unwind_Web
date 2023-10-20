import { writable } from "svelte/store";
import { isEmailValid } from "./email";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export const user = writable<User | null>(null);

export function checkData(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirm: string
) {
  if (
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    email.trim() === "" ||
    password.trim() === "" ||
    passwordConfirm.trim() === ""
  ) {
    throw new Error("Veuillez remplir tous les champs");
  }

  if (!isEmailValid(email)) {
    throw new Error("Le format de l'adresse e-mail est invalide");
  }

  if (password !== passwordConfirm) {
    throw new Error("Le mot de passe est différent de sa confirmation");
  }
}

export async function signUp(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const res = await fetch(
    "http://studapps.cg.helmo.be:5010/REST_DETI_EPPE/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Une erreur est survenue lors de l'inscription");
  }

  const json = await res.json();

  if (json.message) {
    throw new Error(json.message);
  }

  user.set(json as User);
}
