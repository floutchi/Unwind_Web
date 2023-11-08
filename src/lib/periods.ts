import { get } from "svelte/store";
import { user, type User } from "./auth";
import { BASE_URL } from "./url";

export interface VacationPeriod {
  idHoliday: number;
  name: string;
  startDateTime: string;
  endDateTime: string;
  place: Place;
  participants: User[];
}

export interface Place {
  country: string;
  city: string;
  street: string;
  num: number;
  zipCode: string;
}

export async function fetchPeriods(token: string): Promise<VacationPeriod[]> {
  const res = await fetch(`${BASE_URL}/holidayperiod/list`, {
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
  };

  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(period),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.errorMessage ?? "Une erreur inconnue est survenue");
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
