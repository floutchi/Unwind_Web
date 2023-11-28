import type { VacationPeriod } from "./periods";
import type { Subscriber, Invalidator, Unsubscriber } from "svelte/store";

export interface PeriodStore {
  subscribe: (
    this: void,
    run: Subscriber<VacationPeriod[]>,
    invalidate?: Invalidator<VacationPeriod[]> | undefined
  ) => Unsubscriber;
  getPeriod: (periodId: number) => VacationPeriod;
  fetch: () => Promise<void>;
  fetchPeriod: (periodId: number) => Promise<void>;
  create: (
    name: string,
    start: string,
    end: string,
    street: string,
    num: number,
    zip: string,
    city: string,
    country: string
  ) => Promise<void>;
  delete: (periodId: number) => Promise<void>;
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
    country: string
  ) => Promise<void>;
}
