<script>
	import '../app.css';
  import Modal from 'svelte-simple-modal';
</script>

<Modal
  unstyled={true}
  classBg="fixed z-10 top-0 left-0 w-screen h-screen flex flex-col justify-center bg-gray-100/[.9]"
  classWindowWrap="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[80vw] h-[80vh]"
  classWindow="relative m-4 text-orange-200 rounded shadow-md bg-indigo-900"
  classContent="relative z-10 p-2 overflow-auto text-display"
>
  <slot />
</Modal>