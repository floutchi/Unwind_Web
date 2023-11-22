import { get } from "svelte/store";
import { user, type User } from "./auth";
import { BASE_URL } from "./url";
import type { Activity } from "./activities";
import type { Place } from "./place";
import type { Weather } from "./weather";

export interface VacationPeriod {
  idHoliday: number;
  name: string;
  startDateTime: string;
  endDateTime: string;
  place: Place;
  participants: User[];
  activities: Activity[];
  weather?: Weather[];
}

export async function fetchPeriods(token: string): Promise<VacationPeriod[]> {
  const res = await fetch(`${BASE_URL}/holidayperiod`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    const json = await res.json();
    return json as VacationPeriod[];
  }

  throw new Error(
    "Une erreur est survenue lors de la récupération de vos périodes de vacances"
  );
}

const numRe = /^\d+$/;
const dateRe = /^\d{4}-\d{2}-\d{2}$/;

export function checkData(
  name: string,
  start: string,
  end: string,
  street: string,
  num: string,
  zip: string,
  city: string,
  country: string
) {
  if (
    name.trim() === "" ||
    start.trim() === "" ||
    end.trim() === "" ||
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

  if (!dateRe.test(start) || !dateRe.test(end)) {
    throw new Error("Format de la/des date(s) invalide");
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate > endDate) {
    throw new Error("La date de début est plus tard que la date de fin");
  }
}

export async function createPeriod(
  name: string,
  start: string,
  end: string,
  street: string,
  num: number,
  zip: string,
  city: string,
  country: string
) {
  const period: VacationPeriod = {
    idHoliday: 0,
    name,
    startDateTime: new Date(start).toISOString(),
    endDateTime: new Date(end).toISOString(),
    place: {
      street,
      num,
      zipCode: zip,
      city,
      country,
    },
    participants: [],
    activities: [],
  };

  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(period),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Une erreur inconnue est survenue");
  }
}

export async function editPeriod(
  id: string,
  name: string,
  start: string,
  end: string,
  street: string,
  num: number,
  zip: string,
  city: string,
  country: string
) {
  const period: VacationPeriod = {
    idHoliday: parseInt(id),
    name,
    startDateTime: new Date(start).toISOString(),
    endDateTime: new Date(end).toISOString(),
    place: {
      street,
      num,
      zipCode: zip,
      city,
      country,
    },
    participants: [],
    activities: [],
  };

  console.log(period);

  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(period),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error ?? "Une erreur inconnue est survenue");
  }
}

export async function fetchPeriod(
  id: string,
  userToken: string
): Promise<VacationPeriod> {
  const res = await fetch(`${BASE_URL}/holidayperiod/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Une erreur inattendue est survenue");
  }

  const json = await res.json();
  return json as VacationPeriod;
}

export async function inviteUser(email: string, periodId: string) {
  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}/user`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: email,
  });

  if (!res.ok) {
    throw new Error(`Impossible d'inviter ${email}`);
  }
}

export async function removeUser(email: string, periodId: string) {
  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}/user`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: email,
  });

  if (!res.ok) {
    throw new Error(`Impossible de supprimer ${email}`);
  }
}

export async function deletePeriod(periodId: number) {
  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Impossible de supprimer la période`);
  }
}

export async function downloadiCal(periodId: number): Promise<Blob> {
  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}/ical`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Impossible de télécharger le calendrier`);
  }

  return res.blob();
}
