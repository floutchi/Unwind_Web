import type { VacationPeriod } from "./periods";
import type { Subscriber, Invalidator, Unsubscriber } from "svelte/store";

export interface PeriodStore {
  subscribe: (
    this: void,
    run: Subscriber<VacationPeriod[]>,
    invalidate?: Invalidator<VacationPeriod[]> | undefined
  ) => Unsubscriber;
  getPeriod: (periodId: number) => VacationPeriod;
  fetch: (token: string) => Promise<void>;
  fetchPeriod: (periodId: number, token: string) => Promise<void>;
  create: (
    name: string,
    start: string,
    end: string,
    street: string,
    num: number,
    zip: string,
    city: string,
    country: string,
    token: string
  ) => Promise<void>;
  delete: (periodId: number, token: string) => Promise<void>;
  clear: () => void;
  edit: (
    periodId: number,
    name: string,
    start: string,
    end: string,
    street: string,
    num: number,
    zip: string,
    city: string,
    country: string,
    token: string
  ) => Promise<void>;
}
