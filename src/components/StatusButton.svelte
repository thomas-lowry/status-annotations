<script>

    //import nested components
    import { Type } from 'figma-plugin-ds-svelte';

    //vars
    export let icon = null;
    export let color = null;
    export { className as class };
    let className = '';


</script>

<button on:click on:submit|preventDefault class="{className}">
    <div class="accent" style="background-color: {color}"></div>
    <div class="icon ml-xsmall mr-xxsmall">
        {@html icon}
    </div>
    <Type><slot /></Type>
</button>


<style>

button {
    position: relative;
    height: 32px;
    display: flex;
    align-items: center;
    outline: none;
    border: none;
    background-color: var(--white);
    width: 100%;
    padding: 0;
}
button:hover {
    background-color: var(--grey);
}

button:hover .accent {
    left: 0;
}

button:active {
    background-color: var(--selection-a);
}

.accent {
    width: 4px;
    height: 32px;
    position: absolute;
    top: 0;
    left: -4px;
    background-color: #000000;
    transition-property: left;
    transition-duration: 100ms;
    transition-timing-function: ease-in-out;
}

.icon {
    width: 12px;
    height: 12px;
}
</style>