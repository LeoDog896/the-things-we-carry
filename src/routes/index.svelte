<script lang="ts">
  import { Composite, Common, Engine, Bodies, World, Body, Runner, Events } from "matter-js";
  import { onMount } from "svelte";
  import decomp from 'poly-decomp';
  import { getContext } from 'svelte';
  import Shop from '$lib/Shop.svelte';
  import randomColor from 'randomcolor'

  const { open } = getContext('simple-modal');
  const showShop = () => open(Shop, {}, { transitionWindowProps: { duration: 50 }});

  let canvas;
  let engine: Engine;
  let ground: Body

  function newGround() {
    if (ground)
      World.remove(engine.world, ground)

      ground = Bodies.rectangle(width / 2, height, width, 20, { isStatic: true });

      ground.render.fillStyle = "#444"

      Composite.add(engine.world, [ground])
  }

  onMount(() => {

    width = window.innerWidth;
    height = window.innerHeight;

    // create an engine
    engine = Engine.create();

    Common.setDecomp(decomp)

    Events.on(engine, 'beforeUpdate', () => {
      const bodies = Composite.allBodies(engine.world);

      for (const body of bodies) {
        if (!body.isStatic && body.position.y > height) {
          World.remove(engine.world, body)
          amount--;
        }
      }
    });

    // create runner
    const runner = Runner.create();

    runner.isFixed = true

    Runner.run(runner, engine);

    newGround()

    const context = canvas.getContext("2d");

    (function render() {
      const bodies = Composite.allBodies(engine.world);

      window.requestAnimationFrame(render);

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);

      for (const body of bodies) {
        for (const part of body.parts) {
          const vertices = part.vertices;
          context.beginPath();

          context.moveTo(vertices[0].x, vertices[0].y)

          for (const vertex of vertices) {
              context.lineTo(vertex.x, vertex.y);
          }

          context.lineTo(vertices[0].x, vertices[0].y);

          context.closePath();

          context.lineWidth = 0
          context.strokeStyle = "rgba(1, 1, 1, 0)";

          context.globalAlpha = part.render.opacity;
          context.fillStyle = part.render.fillStyle;

          context.fill();
        }
      }
    })();

  })

  let amount = 0;
  let width = 600;
  let height = 600;

  const randomNumber = (min: number, max: number) => Math.random() * (max - min + 1) + min;

  function click() {
    amount++;
    const body = Bodies.circle(randomNumber(60, width - 60), 0, randomNumber(8, 16))
    Body.setMass(body, 0.05)
    body.restitution = 1
    body.render.fillStyle = randomColor({ hue: "monochrome", luminosity: "light" })
    World.add(engine.world, body)
  }
</script>
<div class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
  <div class="w-24 h-24 bg-black" on:click={click}></div>
</div>
<svelte:window on:resize={() => {
  width = window.innerWidth;
  height = window.innerHeight;
  newGround();
}}></svelte:window>
<canvas {width} {height} class="z--10" bind:this={canvas}></canvas>
<div class="my-8 mx-auto text-center z-10 top-0 left-0 w-screen fixed flex flex-col items-center font-display">
  <p class="font-thin text-3xl border-b-[1px] pb-2 border-gray-200">{amount} block{amount == 1 ? "" : "s"}</p>
  <button on:click={showShop} class="w-min mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg">Shop</button>
</div>