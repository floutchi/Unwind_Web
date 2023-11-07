import { base } from "$app/paths";
import { isLoading, user } from "./auth";
import { goto } from "$app/navigation";

export function verifyAuth() {
  isLoading.subscribe((loading) => {
    if (!loading) {
      user.subscribe((u) => {
        if (!u) {
          goto(base);
        }
      });
    }
  });
}
