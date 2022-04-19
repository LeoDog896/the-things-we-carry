import { writable } from "svelte/store";

export const friction = writable(0.1);
export const clickAmount = writable(1);