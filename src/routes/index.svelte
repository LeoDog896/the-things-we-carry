<script lang="ts">
    import { Engine, Render, Runner, Bodies, Composite, Body, Events, World } from "matter-js"
    import { onMount } from "svelte";

    let character;
    let engine;
    let ground;
    let score = 0;

    const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    let elements = []

    onMount(() => {
        // create an engine
        engine = Engine.create();

        // create a renderer
        const render = Render.create({
            element: document.body,
            engine: engine
        });

        // create two boxes and a ground
        character = Bodies.rectangle(400, 200, 80, 80);
        ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        // add all of the bodies to the world
        Composite.add(engine.world, [character, ground]);

        // run the renderer
        Render.run(render);

        // create runner
        const runner = Runner.create();

        // run the engine
        Runner.run(runner, engine);

        type BodyPair = { bodyA: any, bodyB: any }

        const anyEquals = (pair: BodyPair, body: any) => pair.bodyA == body || pair.bodyB == body
        const allNotEquals = (pair: BodyPair, body: any) => pair.bodyA != body && pair.bodyB != body
        const findNotEquals = (pair: BodyPair, body: any): any => {
            if (pair.bodyA != body) return pair.bodyA
            if (pair.bodyB != body) return pair.bodyB
        }

        Events.on(engine, 'collisionStart', function(event) {

            event.pairs.forEach(pair => {

                if (anyEquals(pair, ground) && allNotEquals(pair, character)) {
                    World.remove(engine.world, findNotEquals(pair, ground))
                    return
                }

                if (allNotEquals(pair, character)) return

                if (allNotEquals(pair, ground)) {
                    score++
                }

            })
        });

        Events.on(engine, 'collisionEnd', function(event) {
            event.pairs.forEach(pair => {
                if (allNotEquals(pair, character)) return

                score--
            })
        });

        Body.setInertia(character, Infinity);

        setInterval(() => {

            const currentPosition = character.position

            const randomX = randomNumber(currentPosition.x - 200, currentPosition.x + 200)

            const randomRectangle = Bodies.rectangle(randomX, 200, 10, 10)

            elements += randomRectangle

            Composite.add(engine.world, randomRectangle)
        }, 5000)
    })

    function input(event: KeyboardEvent) {
        if (event.key == "ArrowRight") {
            Body.setVelocity(character, { x: 6, y: 0 });
        } 
        
        if (event.key == "ArrowLeft") {
            Body.setVelocity(character, { x: -6, y: 0 })
        }
    }
</script>

<p class="fixed m-8 text-white">{score}</p>
<svelte:window on:keydown={input}></svelte:window>