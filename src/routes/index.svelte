<script lang="ts">
    import decomp from 'poly-decomp';
    import { Engine, Runner, Bodies, Composite, Common, Body, Events, World } from "matter-js"
    import { onMount } from "svelte";
    import randomcolor from "randomcolor"
    import { keysPressed } from "$lib/movement"
    import Movement from "$lib/Movement.svelte"
    
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

        Composite.add(engine.world, [ground, wallLeft, wallRight])
    }

    const randomNumber = (min: number, max: number) => Math.random() * (max - min + 1) + min;

    onMount(() => {
        
        width = window.innerWidth;
        height = window.innerHeight;

        // create an engine
        engine = Engine.create();

        Common.setDecomp(decomp)

        // create two boxes and a ground
        character = Bodies.fromVertices(400, height - 60, [nonDefenseVertices]);

        // create runner
        const runner = Runner.create();

        type BodyPair<T> = { bodyA: T, bodyB: T }

        const anyEquals = (pair: BodyPair<unknown>, body: unknown) => pair.bodyA == body || pair.bodyB == body
        const allNotEquals = (pair: BodyPair<unknown>, body: unknown) => pair.bodyA != body && pair.bodyB != body
        function findNotEquals<T>(pair: BodyPair<T>, body: T): T {
            if (pair.bodyA != body) return pair.bodyA
            if (pair.bodyB != body) return pair.bodyB
        }

        // run the engine
        Runner.run(runner, engine);

        newGround()

        // add all of the bodies to the world
        Composite.add(engine.world, [character]);

        Events.on(engine, 'collisionActive', event => {
            event.pairs.forEach(pair => {

                if (anyEquals(pair, ground) && allNotEquals(pair, character) && findNotEquals(pair, ground).velocity.x < 0.1) {
                    // Body.setVelocity(findNotEquals(pair, ground), { x: randomNumber(-5, 5), y: randomNumber(-5, -40) })
                    World.remove(engine.world, findNotEquals(pair, ground))
                }

            })
        });

        Events.on(engine, 'beforeUpdate', function(event) {
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
            const body = Bodies.circle(randomNumber(60, width - 60), randomNumber(60, height - 60), randomNumber(8, 16))
            Body.setMass(body, 0.05)
            World.add(engine.world, body)
        }, 100)
        
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

                    if (body == ground || body == ceiling || body == wallLeft || body == wallRight) {
                        context.fillStyle = "#444"
                    } else if (body == character) {
                        context.fillStyle = randomcolor({ seed: part.id, hue: "monochrome" })
                    } else {
                        context.fillStyle = randomcolor({ seed: body.id, luminosity: "light", hue: "monochrome" })
                    }
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