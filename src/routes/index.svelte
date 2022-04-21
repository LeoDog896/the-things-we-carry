<script lang="ts">
  import matter from "matter-js";
  const { Composite, Common, Bodies, World, Body, Runner, Events, Mouse, MouseConstraint } = matter
  import { onMount } from "svelte";
  import { fly } from 'svelte/transition';
  import decomp from 'poly-decomp';
  import { getContext } from 'svelte';
  import Shop from '$lib/Shop.svelte';
  import randomColor from 'randomcolor'
  import { clickAmount, friction, units, ground } from '$lib/settings'
  import { engine } from "$lib/engine";
  import Button from '$lib/Button.svelte'

  const { open } = getContext('simple-modal');
  const showShop = () => open(Shop, {}, { 
    transitionWindow: fly,
    transitionWindowProps: { duration: 50 }
  });

  let canvas: HTMLCanvasElement;

  function newGround() {
    if ($ground)
      World.remove($engine.world, $ground)

      $ground = Bodies.rectangle(width / 2, height, width, 20, { isStatic: true });

      $ground.render.fillStyle = "#444"

      Composite.add($engine.world, [$ground])
  }

  onMount(() => {

    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;

    Common.setDecomp(decomp)

    Events.on($engine, 'beforeUpdate', () => {
      const bodies = Composite.allBodies($engine.world);

      for (const body of bodies) {
        if (!body.isStatic && (body.position.y > height || body.position.x < -100 || body.position.x > width + 100 || body.position.y < -100)) {
          World.remove($engine.world, body);
        }
      }
    });

    // create runner
    const runner = Runner.create();

    runner.isFixed = true

    Runner.run(runner, $engine);

    newGround()

    // add mouse control
    const mouse = Mouse.create(canvas),
      mouseConstraint = MouseConstraint.create($engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: true
          }
        } as any
      });

    Composite.add($engine.world, mouseConstraint);

    const context = canvas.getContext("2d");

    (function render() {
      const bodies = Composite.allBodies($engine.world);

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

  let width = 600;
  let height = 600;

  const randomNumber = (min: number, max: number) => Math.random() * (max - min + 1) + min;

  function click() {
    for (let i = 0; i < $clickAmount; i++) {
      const weight = randomNumber(16, 32);
      const body = Bodies.circle(randomNumber(60, width - 60), 0, weight)
      Body.setMass(body, weight)
      body.restitution = 1
      body.friction = $friction
      body.render.fillStyle = randomColor({ hue: "monochrome", luminosity: "light" })
      World.add($engine.world, body)
    }
  }
</script>
<canvas {width} {height} class="fixed top-0 left-0 z--10" bind:this={canvas}></canvas>
<div class="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
  <div class="border-[50px] border-transparent w-24 h-24 bg-black rounded-full hover:scale-110 hover:cursor-pointer transition-all" on:click={click}></div>
</div>
<svelte:window on:resize={() => {
  width = document.documentElement.clientWidth;
  height = document.documentElement.clientHeight;
  newGround();
}}></svelte:window>
<div class="my-8 mx-auto text-center top-0 left-0 w-screen fixed flex flex-col items-center font-display">
  <p class="font-thin text-3xl border-b-[1px] pb-2 border-gray-200">{$units} unit{$units == 1 ? "" : "s"}</p>
  <Button on:click={showShop} extraClasses="mt-4 w-min">Shop</Button>
</div>