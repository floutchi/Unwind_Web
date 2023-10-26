import { get } from "svelte/store";
import { user, type User } from "./auth";

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

const BASE_URL = "http://studapps.cg.helmo.be:5010/REST_DETI_EPPE";

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

export const fakePeriods: VacationPeriod[] = [
  {
    idHoliday: 0,
    name: "London 2K23",
    startDateTime: "2023-11-13",
    endDateTime: "2023-11-17",
    place: {
      country: "UK",
      city: "London",
      street: "Wharfdale Rd.",
      num: 50,
      zipCode: "9FA",
    },
    participants: [],
  },
  {
    idHoliday: 1,
    name: "Sud de la France",
    startDateTime: "2024-07-05",
    endDateTime: "2024-07-19",
    place: {
      country: "FR",
      city: "Fréjus",
      street: "Boulevard du Soleil",
      num: 12,
      zipCode: "83370",
    },
    participants: [],
  },
  {
    idHoliday: 2,
    name: "Grèce",
    startDateTime: "2024-08-13",
    endDateTime: "2024-08-20",
    place: {
      country: "GR",
      city: "Rhodos",
      street: "Jesaispas",
      num: 50,
      zipCode: "49516",
    },
    participants: [],
  },
  {
    idHoliday: 3,
    name: "Ligne du bas",
    startDateTime: "2024-09-13",
    endDateTime: "2024-09-17",
    place: {
      country: "IT",
      city: "Roma",
      street: "Spaghetti y Pizza",
      num: 50,
      zipCode: "5988",
    },
    participants: [],
  },
];
