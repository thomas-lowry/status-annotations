<script>

	//import Global CSS from the svelte boilerplate
	import { GlobalCSS } from 'figma-plugin-ds-svelte';

	//import some Svelte Figma UI components
	import { Button, IconButton, IconSwap } from 'figma-plugin-ds-svelte';
	import StatusButton from './components/StatusButton';

	//import all of your svg icons here (12x12 size)
    import iconInProgress from './assets/icon-progress.svg';
    import iconReview from './assets/icon-review.svg';
    import iconApproved from './assets/icon-approved.svg';
    import iconDevelop from './assets/icon-develop.svg';
	import iconComplete from './assets/icon-complete.svg';
	
	//define all of the status that you want here
	let statuses = [
		{
			'title': 'In progress',
			'icon': iconInProgress,
			'color': '#E93940'
		},
		{
			'title': 'Review',
			'icon': iconReview,
			'color': '#FFCF23'
		},
		{
			'title': 'Approved',
			'icon': iconApproved,
			'color': '#376FFF'
		},
		{
			'title': 'Develop',
			'icon': iconDevelop,
			'color': '#3CCC65'
		},
		{
			'title': 'Complete',
			'icon': iconComplete,
			'color': '#000000'
		},
	];

	//determine how tall the plugin UI needs to be
	//the number 50 accoutns for clear/clear all buttons, the divider, and some padding
	//could caluclate this with height of dom elements, but this seems faster
	let height = (statuses.length * 32) + 50;
	parent.postMessage({ pluginMessage: { 'type': 'height', 'height': height } }, '*');



	function addStatus(status) {
		parent.postMessage({ pluginMessage: { 'type': 'addStatus', 'status': status } }, '*');
	}

	function clearSelected() {
		parent.postMessage({ pluginMessage: { 'type': 'clear' } }, '*');
	}

	function clearAll() {
		parent.postMessage({ pluginMessage: { 'type': 'clearAll' } }, '*');
	}

	function refresh() {
		parent.postMessage({ pluginMessage: { 'type': 'refresh' } }, '*');
	}

</script>

<div class="wrapper">

	<div class="annotation-buttons">

		<!-- Status annotation buttons -->
		{#each statuses as status}
			<StatusButton on:click={() => addStatus(status)} icon={status.icon} color={status.color}>{status.title}</StatusButton>
		{/each}

	</div>

	<div class="flex row justify-content-between align-items-center pr-xxsmall">
		<!-- Clear buttons -->
		<div class="flex row clear">
			<Button on:click={clearSelected} variant="tertiary" class="mr-xxsmall">Clear</Button>
			<Button on:click={clearAll} variant="tertiary" destructive>Clear all</Button>
		</div>
		<!-- refresh icon -->
		<IconButton on:click={refresh} iconName={IconSwap}></IconButton>
	</div>
</div>



<style>

.wrapper {
	overflow: hidden;
}

.annotation-buttons {
	padding: 4px 0 4px 0;
	border-bottom: 1px solid var(--black1);
}

.clear {
	padding: 4px 16px 4px 16px;
}
</style>