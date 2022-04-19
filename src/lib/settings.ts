import { writable, derived, get } from "svelte/store";
import { type Body, World } from "matter-js"
import { engine } from "./engine";

export const friction = writable(0.1);
export const clickAmount = writable(1);
export const unitArray = writable<Body[]>([])
export const units = derived(unitArray, array => array.length)

/**
 * Remove a specified amount of units from the current canvas instance
 * 
 * @param amount - The amount of units to remove.
 */
export const removeUnits = (amount: number) => {
  for (let i = 0; i < amount; i++) {
    // grab the body
    const body = get(unitArray)[i]
    World.remove(get(engine).world, body)
     
    const index = get(unitArray).indexOf(body);
    
    if (index == -1) continue; // no body found -- ignore it.

    unitArray.set([...get(unitArray).slice(0, index), ...get(unitArray).slice(index + 1)]);
  }
}