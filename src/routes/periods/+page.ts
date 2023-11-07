import { verifyAuth } from "$lib/verify";

export function load() {
  verifyAuth();
}
