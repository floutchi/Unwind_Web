import { getContext, setContext } from "svelte";
import { createPeriodStore } from "./periods";
import { UserStore } from "./auth";

export class AppState {
  userStore = new UserStore();
  periodStore = createPeriodStore();
}

const STATE_CTX = "STATE_CTX";

export function createAppState(): AppState {
  const state = new AppState();
  setContext(STATE_CTX, state);
  return state;
}

export const getAppState = (): AppState => getContext(STATE_CTX);
