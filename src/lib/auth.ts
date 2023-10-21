import { get, writable } from "svelte/store";
import { isEmailValid } from "./email";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export const user = writable<User | null>(null);

const BASE_URL = "http://studapps.cg.helmo.be:5010/REST_DETI_EPPE";

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
  const res = await fetch(`${BASE_URL}/auth/signup`, {
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
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.errorMessage ?? "Une erreur inattendue est survenue");
  }

  user.set(json as User);
  saveAuth();
}

export async function signIn(email: string, password: string) {
  checkData("a", "b", email, password, password);

  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const json = await res.json();

  if (json.errorMessage) {
    throw new Error(json.errorMessage);
  }

  if (!res.ok) {
    throw new Error("Une erreur inconnue est survenue lors de la connexion");
  }

  user.set(json as User);
  saveAuth();
}

export function signOut() {
  user.set(null);
  localStorage.clear();
}

export async function loadAuth() {
  const token = localStorage.getItem("token");

  if (token) {
    console.log(token); // TODO: Remove this line when fixed
    const userValue = await fetchUser(token);
    user.set(userValue);
  }
}

async function fetchUser(token: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/user/details`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.errorMessage ?? "Une erreur inattendue est survenue");
  }

  json.token = token;
  return json as User;
}

function saveAuth() {
  const userValue = get(user)!;
  localStorage.setItem("token", JSON.stringify(userValue.token));
}
