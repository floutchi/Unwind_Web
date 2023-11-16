import { get } from "svelte/store";
import type { Place } from "./periods";
import { BASE_URL } from "./url";
import { user } from "./auth";

export interface Activity {
  idActivity: number | null;
  name: string;
  startDateTime: string,
  endDateTime: string,
  place: Place;
}

const numRe = /^\d+$/;

export function checkData(
  name: string,
  street: string,
  num: string,
  zip: string,
  city: string,
  country: string
) {
  if (
    name.trim() === "" ||
    street.trim() === "" ||
    num.trim() === "" ||
    zip.trim() === "" ||
    city.trim() === "" ||
    country.trim() === ""
  ) {
    throw new Error("Veuillez remplir tous les champs");
  }

  if (!numRe.test(num)) {
    throw new Error("Le numéro n'est pas valide");
  }
}

export async function createActivity(
  name: string,
  street: string,
  num: number,
  zip: string,
  city: string,
  country: string,
  periodId: string
) {
  const token = get(user)!.token;
  const newActivity: Activity = {
    idActivity: null,
    name,
    startDateTime: "",
    endDateTime: "",
    place: {
      street,
      num,
      city,
      zipCode: zip,
      country,
    },
  };

  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}/activity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newActivity),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Une erreur inattendue est survenue");
  }
}


export async function editActivity(
  name: string,
  start: string,
  end: string,
  street: string,
  num: number,
  zip: string,
  city: string,
  country: string,
  periodId: string,
  activityId: string
) {
  const token = get(user)!.token;
  const newActivity: Activity = {
    idActivity: null,
    name,
    startDateTime: start,
    endDateTime: end,
    place: {
      street,
      num,
      city,
      zipCode: zip,
      country,
    },
  };

  console.log(JSON.stringify(newActivity));

  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}/activity/${activityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newActivity),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Une erreur inattendue est survenue");
  }
}

export async function deleteActivity(periodId: string, activityId: string) {
  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}/activity/${activityId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Une erreur inattendue est survenue");
  }
}