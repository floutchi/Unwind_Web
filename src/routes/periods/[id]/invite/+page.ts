import { verifyAuth } from "$lib/verify.js";

export function load({ params }) {
  verifyAuth();

  return {
    id: params.id,
  };
}
