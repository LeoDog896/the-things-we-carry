import { writable, type Writable } from "svelte/store";

export interface KeysPressed { 
    left: boolean,
    right: boolean,
    jump: boolean
}

export const keysPressed: Writable<KeysPressed> = writable({ left: false, right: false, jump: false })