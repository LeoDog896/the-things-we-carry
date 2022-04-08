<script lang="ts">
    import decomp from 'poly-decomp';
    import { Engine, Runner, Bodies, Composite, Common, Body, Events, World } from "matter-js"
    import { onMount } from "svelte";
    import randomcolor from "randomcolor"

    const keysPressed: { left: boolean, right: boolean, defense: boolean } = { left: false, right: false, defense: false }

    let character: Body;
    let engine: Engine;
    let ground: Body;
    let width = 800
    let height = 600
    let canvas: HTMLCanvasElement;

    const nonDefenseVertices = [[
        // bottom
        {x: 0, y: 160}, {x: 80, y: 160}, 
        {x: 100, y: 50}, {x: 60, y: 80},
        {x: 20, y: 80}, {x: -20, y: 50},
        {x: 0, y: 160}
    ]]

    const defenseVertices = [[
        // bottom
        {x: 0, y: 160}, {x: 80, y: 160}, 
        {x: 100, y: 50}, {x: 60, y: 80},
        {x: 20, y: 80}, {x: -20, y: 50},
        {x: 0, y: 160}
    ]]

    function newGround() {
        if (ground) World.remove(engine.world, ground)
        ground = Bodies.rectangle(0, height, width * 4, 60, { isStatic: true });
        Composite.add(engine.world, ground)
    }

    const randomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

    onMount(() => {
        
        width = window.innerWidth;
        height = window.innerHeight;

        // create an engine
        engine = Engine.create();

        Common.setDecomp(decomp)

        // create two boxes and a ground
        character = Bodies.fromVertices(400, height - 60, [[
            // bottom
            {x: 0, y: 160}, {x: 80, y: 160}, 
            {x: 100, y: 50}, {x: 60, y: 80},
            {x: 20, y: 80}, {x: -20, y: 50},
            {x: 0, y: 160}
        ]]);

        // create runner
        const runner = Runner.create();

        type BodyPair = { bodyA: any, bodyB: any }

        const anyEquals = (pair: BodyPair, body: any) => pair.bodyA == body || pair.bodyB == body
        const allNotEquals = (pair: BodyPair, body: any) => pair.bodyA != body && pair.bodyB != body
        const findNotEquals = (pair: BodyPair, body: any): any => {
            if (pair.bodyA != body) return pair.bodyA
            if (pair.bodyB != body) return pair.bodyB
        }

        // run the engine
        Runner.run(runner, engine);

        newGround()

        // add all of the bodies to the world
        Composite.add(engine.world, [character]);

        Events.on(engine, 'collisionStart', function(event) {

            event.pairs.forEach(pair => {

                if (anyEquals(pair, ground) && allNotEquals(pair, character)) {
                    World.remove(engine.world, findNotEquals(pair, ground))
                    return
                }

            })
        });

        Events.on(engine, 'beforeUpdate', function(event) {

            if (!keysPressed.defense)

            if (keysPressed.defense) {

            } else if (keysPressed.left) {
                Body.setVelocity(character, { x: -5, y: 0 })
            } else if (keysPressed.right) {
                Body.setVelocity(character, { x: 5, y: 0 })
            }
        });

        Body.setInertia(character, Infinity);

        setInterval(() => {
            if (!document.hasFocus()) return

            const randomX = randomNumber(0, width)

            const randomRectangle = Bodies.rectangle(randomX, 200, 10, 10)

            Composite.add(engine.world, randomRectangle)
        }, 200)

        const context = canvas.getContext("2d");

        (function render() {
            const bodies = Composite.allBodies(engine.world);

            window.requestAnimationFrame(render);

            context.fillStyle = '#fff';
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
                    if (body == character) {
                        context.fillStyle = randomcolor({ seed: part.id })
                    } else
                        context.fillStyle = randomcolor({ seed: body.id })
                    context.fill();
                }
            }
        })();
    })

    function startPress(event: KeyboardEvent) {
        if (event.key == "ArrowRight") {
            keysPressed.right = true
        } 
        
        if (event.key == "ArrowLeft") {
            keysPressed.left = true
        }
    }

    function endPress(event: KeyboardEvent) {
        if (event.key == "ArrowRight") {
            keysPressed.right = false
        }

        if (event.key == "ArrowLeft") {
            keysPressed.left = false
        }
    }
</script>

<canvas width={width} height={height} bind:this={canvas}></canvas>
<svelte:window on:resize={() => {
    width = window.innerWidth;
    height = window.innerHeight;
    newGround()
}} on:keydown={startPress} on:keyup={endPress}></svelte:window>