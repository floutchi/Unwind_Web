import { get, writable } from "svelte/store";
import { user, type User } from "./auth";
import { BASE_URL } from "./url";
import type { Activity } from "./activities";
import type { Place } from "./place";
import type { Weather } from "./weather";
import type { PeriodStore } from "./PeriodStoreType";

export interface VacationPeriod {
  idHoliday: number;
  name: string;
  startDateTime: string;
  endDateTime: string;
  place: Place;
  participants: User[];
  activities: Activity[];
  weather: Weather[] | null;
}

export function createPeriodStore(): PeriodStore {
  const store = writable<VacationPeriod[]>([]);
  const { subscribe, set, update } = store;

  return {
    subscribe,
    getPeriod: (periodId: number): VacationPeriod =>
      get(store)!.find((period) => period.idHoliday === periodId)!,
    fetch: async () => {
      if (get(store).length === 0) {
        const periods = await _fetchPeriods();
        set(periods);
      }
    },
    fetchPeriod: async (periodId: number) => {
      const period = get(store).find((period) => period.idHoliday === periodId);
      const updatedPeriod = await _fetchPeriod(periodId);

      if (!period) {
        update((periods) => [...periods, updatedPeriod]);
        return;
      }

      update((periods) => {
        periods[
          periods.findIndex((p) => p.idHoliday === updatedPeriod.idHoliday)
        ] = updatedPeriod!;
        return periods;
      });
    },
    create: async (
      name: string,
      start: string,
      end: string,
      street: string,
      num: number,
      zip: string,
      city: string,
      country: string
    ) => {
      const period = await _createPeriod(
        name,
        start,
        end,
        street,
        num,
        zip,
        city,
        country
      );
      update((periods) => [...periods, period]);
    },
    delete: async (periodId: number) => {
      await _deletePeriod(periodId);
      update((periods) =>
        periods.filter((period) => period.idHoliday !== periodId)
      );
    },
    clear: () => set([]),
    edit: async (
      periodId: number,
      name: string,
      start: string,
      end: string,
      street: string,
      num: number,
      zip: string,
      city: string,
      country: string
    ) => {
      const period = await _editPeriod(
        periodId,
        name,
        start,
        end,
        street,
        num,
        zip,
        city,
        country
      );
      update((periods) => {
        periods[periods.findIndex((period) => period.idHoliday === periodId)] =
          period;
        return periods;
      });
    },
  };
}

export const periods = createPeriodStore();

async function _fetchPeriods(): Promise<VacationPeriod[]> {
  const token = get(user)!.token;
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

async function _fetchPeriod(periodId: number): Promise<VacationPeriod> {
  const token = get(user)!.token;
  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Une erreur inattendue est survenue");
  }

  const json = await res.json();
  return json as VacationPeriod;
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

async function _createPeriod(
  name: string,
  start: string,
  end: string,
  street: string,
  num: number,
  zip: string,
  city: string,
  country: string
): Promise<VacationPeriod> {
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
    weather: null,
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

  return (await res.json()) as VacationPeriod;
}

async function _deletePeriod(periodId: number) {
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

async function _editPeriod(
  periodId: number,
  name: string,
  start: string,
  end: string,
  street: string,
  num: number,
  zip: string,
  city: string,
  country: string
): Promise<VacationPeriod> {
  const period: VacationPeriod = {
    idHoliday: periodId,
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
    weather: null,
  };

  const token = get(user)!.token;

  const res = await fetch(`${BASE_URL}/holidayperiod/${periodId}`, {
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

  return period;
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
