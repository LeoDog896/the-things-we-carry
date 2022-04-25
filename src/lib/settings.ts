import { writable, derived, get, type Readable, type Subscriber } from "svelte/store";
import matter, { type Body } from "matter-js"
const { World, Events, Composite } = matter;
import { engine } from "./engine";

export const friction = writable(0.1);
export const restitution = writable(1);
export const clickAmount = writable(1);
export const ground = writable<Body>();
export const shopEnabled = writable(false);

export const unitArray: Readable<Body[]> = new class {
  constructor() {
    Events.on(get(engine), "beforeUpdate", () => {
      const unfilteredBodies = Composite.allBodies(get(engine).world)
      const bodies = unfilteredBodies.filter(it => it !== get(ground));
      this.bodies = bodies;
      this.subscriptions.forEach(it => it(bodies));
    })
  }

  bodies: Body[] = []
  subscriptions: Subscriber<Body[]>[] = []
  subscribe(run: Subscriber<Body[]>) {
    this.subscriptions = [...this.subscriptions, run]
    run(this.bodies)
    return () => {
      this.subscriptions = this.subscriptions.filter(it => it != run)
    }
  }
}
// export const unitArray = readable(() => 
//   window ? Composite.allBodies(get(engine).world).filter(it => it !== get(ground)) : []
// )
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
    if (body == null) continue
    World.remove(get(engine).world, body)
  }
}