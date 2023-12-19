import { base } from "$app/paths";
import { goto } from "$app/navigation";
import type { UserStore } from "./auth";

export function verifyAuth(userStore: UserStore) {
  const isLoading = userStore.isLoading;
  const user = userStore.user;

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
