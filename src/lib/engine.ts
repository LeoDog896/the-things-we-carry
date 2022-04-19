import { Engine } from "matter-js"
import { readable } from "svelte/store";

export const engine = readable(Engine.create());