import { BASE_URL } from "./url";

export async function fetchTotalUsers(): Promise<number> {
  const res = await fetch(`${BASE_URL}/home/stats`);

  const json = await res.json();
  return json.totalUsers;
}

export async function fetchUsersPerPeriod(
  start: string,
  end: string
): Promise<any> {
  const res = await fetch(
    `${BASE_URL}/home/statsdates?startDate=${start}&endDate=${end}`
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error ?? "Une erreur inconnue est survenue");
  }

  return json.usersInHolidayPerPlace;
}
