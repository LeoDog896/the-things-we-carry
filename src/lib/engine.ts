import matter from "matter-js"
import { readable } from "svelte/store";

export const engine = readable(matter.Engine.create());