import { get, writable } from "svelte/store";
import { isEmailValid } from "./email";
import { BASE_URL } from "./url";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

export const user = writable<User | null>(null);
export const isLoading = writable(true);

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

export function checkEditData(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirm: string
) {
  if (
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    email.trim() === ""
  ) {
    throw new Error("Veuillez remplir les champs requis");
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
    throw new Error(json.error ?? "Une erreur inattendue est survenue");
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

  if (json.error) {
    throw new Error(json.error);
  }

  if (!res.ok) {
    throw new Error("Une erreur inconnue est survenue lors de la connexion");
  }

  user.set(json as User);
  saveAuth();
}

export async function signInWithGoogle(response: any) {
  const credential = response.credential;

  const res = await fetch(`${BASE_URL}/auth/googlesignin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken: credential,
    }),
  });

  const json = await res.json();

  if (res.ok) {
    user.set(json);
    saveAuth();
  }
}

export function signOut() {
  user.set(null);
  localStorage.clear();
}

export async function editProfile(
  firstName: string,
  lastName: string,
  email: string,
  oldPassword: string,
  newPassword: string,
  token: string
) {
  const res = await fetch(`${BASE_URL}/user/details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      oldPassword,
      newPassword
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    console.log(json);
    throw new Error(json.error ?? "Une erreur inattendue est survenue");
  }

  user.set(json as User);
  saveAuth();
}

export async function loadAuth() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const userValue = await fetchUser(token);
      user.set(userValue);
    } catch (e: any) {
      signOut();
    }
  }

  isLoading.set(false);
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
    throw new Error(json.error ?? "Une erreur inattendue est survenue");
  }

  json.token = token;
  return json as User;
}

function saveAuth() {
  const userValue = get(user)!;
  localStorage.setItem("token", userValue.token);
}
