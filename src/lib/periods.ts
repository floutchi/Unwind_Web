import type { User } from "./auth";

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
