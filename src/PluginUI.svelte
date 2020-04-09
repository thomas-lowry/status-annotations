<script>

	//import Global CSS from the svelte boilerplate
	import { GlobalCSS } from 'figma-plugin-ds-svelte';

	//import some Svelte Figma UI components
	import { Button, IconButton, IconSwap, Type } from 'figma-plugin-ds-svelte';
	import StatusButton from './components/StatusButton';

	//import all of your svg icons here (12x12 size)
    import iconInProgress from './assets/icon-progress.svg';
    import iconReview from './assets/icon-review.svg';
    import iconApproved from './assets/icon-approved.svg';
    import iconDevelop from './assets/icon-develop.svg';
	import iconComplete from './assets/icon-complete.svg';
	import iconArchive from './assets/icon-archive.svg';
	
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
		{
			'title': 'Archive',
			'icon': iconArchive,
			'color': '#757575'
		}
	];

	let showDialog = false; // confirmation dialog visibility

	//determine how tall the plugin UI needs to be
	//the number 50 accoutns for clear/clear all buttons, the divider, and some padding
	//could caluclate this with height of dom elements, but this seems faster
	let height = (statuses.length * 32) + 50;
	parent.postMessage({ pluginMessage: { 'type': 'height', 'height': height } }, '*');


	// adds the status msg to selected frames
	function addStatus(status) {
		parent.postMessage({ pluginMessage: { 'type': 'addStatus', 'status': status } }, '*');
	}

	//open the delete confirmation modal
	function toggleDeleteConfirmation() {
		if (showDialog) {
			showDialog = false;
		} else {
			showDialog = true;
		}
	}
	

	//delete the annotations from selected frames
	function deleteSeletected() {
		parent.postMessage({ pluginMessage: { 'type': 'delete' } }, '*');
	}

	//delete all of the annotations on the current page
	function deleteAll() {
		parent.postMessage({ pluginMessage: { 'type': 'deleteAll' } }, '*');
		toggleDeleteConfirmation();
	}

	//refresh the positions of annotations (and remove any that belong to frames that don't exist)
	function refresh() {
		parent.postMessage({ pluginMessage: { 'type': 'refresh' } }, '*');
	}

</script>

<!-- Confirmation dialog -->
<div class="confirmation p-xsmall" class:showDialog={showDialog === true}>
	<div class="confirmation__wrapper flex column">
		<!-- Message -->
		<div class="confirmation--msg">
			<Type weight="bold" class="mb-xsmall">Delete annotations</Type>
			<Type class="mb-xxsmall">This action will remove all status annotations on the current page.</Type>
		</div>
		<!-- Buttons -->
		<div class="flex row">
			<Button on:click={toggleDeleteConfirmation} variant="secondary" class="mr-xxsmall">Cancel</Button>
			<Button on:click={deleteAll} variant="primary" destructive>Delete</Button>
		</div>
	</div>
</div>

<div class="annotation-buttons">

	<!-- Status annotation buttons -->
	{#each statuses as status}
		<StatusButton on:click={() => addStatus(status)} icon={status.icon} color={status.color}>{status.title}</StatusButton>
	{/each}

</div>

<div class="flex row justify-content-between align-items-center pr-xxsmall">
	<!-- Clear buttons -->
	<div class="flex row clear">
		<Button on:click={deleteSeletected} variant="tertiary" class="mr-xxsmall">Delete</Button>
		<Button on:click={toggleDeleteConfirmation} variant="tertiary" destructive>Delete all</Button>
	</div>
	<!-- refresh icon -->
	<IconButton on:click={refresh} iconName={IconSwap}></IconButton>
</div>



<style>

.annotation-buttons {
	padding: 4px 0 4px 0;
	border-bottom: 1px solid var(--black1);
}

.clear {
	padding: 4px 16px 4px 16px;
}

.confirmation {
	position: absolute;
	top: 101%;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
	background-color: var(--white);
	transition-property: top;
	transition-timing-function: ease-in-out;
	transition-duration: 300ms;
	border-top: 1px solid var(--black3);
}
.confirmation--msg {
	flex: 1;
	user-select: none;
}
.confirmation__wrapper {
	height: 100%;
}
.showDialog {
	top: -1px;
}


</style>