<script lang="ts">
    import decomp from 'poly-decomp';
    import { Engine, Runner, Bodies, Composite, Common, Body, Events, World, type IPair } from "matter-js"
    import { onMount } from "svelte";
    import randomcolor from "randomcolor"
    import { keysPressed } from "$lib/movement"
    import Movement from "$lib/Movement.svelte"
    import randomColor from 'randomcolor';
    import { hexToRgb } from '$lib/color';

    let character: Body;
    let engine: Engine;
    let ground: Body;
    let wallLeft: Body;
    let wallRight: Body;
    let ceiling: Body;
    let width = 800
    let height = 600
    let canvas: HTMLCanvasElement;

    const nonDefenseVertices = [
        // bottom
        {x: 0, y: 160}, {x: 80, y: 160}, 
        {x: 100, y: 50}, {x: 60, y: 80},
        {x: 20, y: 80}, {x: -20, y: 50},
        {x: 0, y: 160}
    ]

    function newGround() {
        [ground, ceiling, wallLeft, wallRight].forEach(body => {
            if (body)
                World.remove(engine.world, body)
        })

        ground = Bodies.rectangle(0, height, width * 4, 60, { isStatic: true });
        wallLeft = Bodies.rectangle(0, 60, 60, height * 4, { isStatic: true });
        wallRight = Bodies.rectangle(width, 60, 60, height * 4, { isStatic: true, });

        [ground, wallLeft, wallRight].forEach(it => it.render.fillStyle = "#444")

        Composite.add(engine.world, [ground, wallLeft, wallRight])
    }

    const randomNumber = (min: number, max: number) => Math.random() * (max - min + 1) + min;

    let touchedGreen: Body[] = []

    onMount(() => {
        
        width = window.innerWidth;
        height = window.innerHeight;

        // create an engine
        engine = Engine.create();

        Common.setDecomp(decomp)

        // create two boxes and a ground
        character = Bodies.fromVertices(400, height - 60, [nonDefenseVertices]);

        character.parts.forEach(it => it.render.fillStyle = randomColor({ hue: "monochrome", luminosity: "dark" }))
        character.parts[0].render.opacity = 0

        // create runner
        const runner = Runner.create();

        // anyEquals -- checks if the selected IPair contains a body (or a part of a body)
        const anyEquals = (pair: IPair, body: Body) => body.parts.includes(pair.bodyA) || body.parts.includes(pair.bodyB) || pair.bodyA === body || pair.bodyB === body;
        const allNotEquals = (pair: IPair, body: Body) => !body.parts.includes(pair.bodyA) && !body.parts.includes(pair.bodyB) && pair.bodyA !== body && pair.bodyB !== body;
        
        const findNotEquals = (pair: IPair, body: Body) => {
            if (pair.bodyA == body || body.parts.includes(pair.bodyA)) 
                return pair.bodyB
            else 
                return pair.bodyA
        }

        // run the engine
        Runner.run(runner, engine);

        newGround()

        // add all of the bodies to the world
        Composite.add(engine.world, [character]);

        Events.on(engine, 'collisionStart', event => {
            for (const pair of event.pairs) {
                if (allNotEquals(pair, ground) && anyEquals(pair, character)) {
                    const color = hexToRgb(findNotEquals(pair, character).render.fillStyle)

                    if (color.g <= color.r || color.g <= color.b) {
                        findNotEquals(pair, character).render.fillStyle = randomcolor({ hue: "green" })
                        touchedGreen = [...touchedGreen, findNotEquals(pair, character)]
                    }
                }
            }
        })

        Events.on(engine, 'collisionActive', event => {
            event.pairs.forEach(pair => {
                if (anyEquals(pair, ground) && allNotEquals(pair, character)) {

                    const color = hexToRgb(findNotEquals(pair, ground).render.fillStyle)

                    if (color.g > color.r || color.g > color.b) {
                        Body.setVelocity(findNotEquals(pair, ground), { x: randomNumber(-5, 5), y: randomNumber(-7, -15) })
                    } else {
                        World.remove(engine.world, findNotEquals(pair, ground))
                    }
                }

            })
        });

        Events.on(engine, 'beforeUpdate', () => {
            if ($keysPressed.jump && character.position.y > height - (60 + 40)) {
                Body.setVelocity(character, { x: character.velocity.x, y: -10 })
            } else if ($keysPressed.left) {
                Body.setVelocity(character, { x: -5, y: character.velocity.y })
            } else if ($keysPressed.right) {
                Body.setVelocity(character, { x: 5, y: character.velocity.y })
            }
        });

        Body.setInertia(character, Infinity);

        setInterval(() => {
            if (!document.hasFocus()) return
            const body = Bodies.circle(randomNumber(60, width - 60), 0, randomNumber(8, 16))
            Body.setMass(body, 0.05)
            body.render.fillStyle = randomColor({ hue: "monochrome", luminosity: "light" })
            World.add(engine.world, body)
        }, 200)
        
        const context = canvas.getContext("2d");

        (function render() {
            const bodies = Composite.allBodies(engine.world);

            window.requestAnimationFrame(render);

            context.fillStyle = '#022038';
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
</script>

<Movement/>
<canvas width={width} height={height} bind:this={canvas}></canvas>
<svelte:window on:resize={() => {
    width = window.innerWidth;
    height = window.innerHeight;
    newGround()
}}></svelte:window>

<p class="fixed mx-16 my-8 top-0 left-0 text-white text-3xl">{touchedGreen.length}</p>