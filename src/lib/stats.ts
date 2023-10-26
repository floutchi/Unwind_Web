const BASE_URL = "http://studapps.cg.helmo.be:5010/REST_DETI_EPPE";

export async function fetchTotalUsers(): Promise<number> {
  const res = await fetch(`${BASE_URL}/home/stats`);

  const json = await res.json();
  return json.totalUsers;
}
