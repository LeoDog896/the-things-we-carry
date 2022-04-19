import { writable, derived, type Writable, get } from "svelte/store";
import { type Body, World } from "matter-js"
import { engine } from "./engine";

export const friction = writable(0.1);
export const clickAmount = writable(1);
export const unitArray: Writable<Body[]> = writable([])
export const units = derived(unitArray, array => array.length)

export const removeUnits = (amount: number) => {
  alert(amount)
  for (let i = 0; i < amount; i++) {
    const body = get(unitArray)[i]
    World.remove(get(engine).world, body)
    const index = get(unitArray).indexOf(body);
    if (index == -1) continue;
    unitArray.set([...get(unitArray).slice(0, index), ...get(unitArray).slice(index + 1)]);
  }
}