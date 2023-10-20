import { get, writable } from "svelte/store";
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

  const json = await res.json();

  if (json.errorMessage) {
    throw new Error(json.errorMessage);
  }

  if (!res.ok) {
    throw new Error("Une erreur inconnue est survenue lors de l'inscription");
  }

  user.set(json as User);
  saveAuth();
}

export function signOut() {
  user.set(null);
  sessionStorage.clear();
}

export function loadAuth() {
  const userString = sessionStorage.getItem("user");

  if (userString) {
    const userValue = JSON.parse(userString) as User;
    user.set(userValue);
  }
}

function saveAuth() {
  const userValue = get(user);
  sessionStorage.setItem("user", JSON.stringify(userValue));
}
