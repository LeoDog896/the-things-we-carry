<script lang="ts">

    import { keysPressed } from "./movement";

    function startPress(event: KeyboardEvent) {
        if (event.key == " ") {
            $keysPressed.jump = true
        }

        if (event.key == "ArrowRight" || event.key == "d") {
            $keysPressed.right = true
        } 
        
        if (event.key == "ArrowLeft" || event.key == "a") {
            $keysPressed.left = true
        }
    }

    function endPress(event: KeyboardEvent) {
        if (event.key == " ") {
            $keysPressed.jump = false
        }

        if (event.key == "ArrowRight" || event.key == "d") {
            $keysPressed.right = false
        }

        if (event.key == "ArrowLeft" || event.key == "a") {
            $keysPressed.left = false
        }
    }
</script>

<svelte:window on:keydown={startPress} on:keyup={endPress}></svelte:window>