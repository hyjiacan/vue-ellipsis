<template>
    <div id="app">
        <component-demo style="float: left"/>
        <directive-demo style="float: right"/>
    </div>
</template>

<script>
import ComponentDemo from './views/ComponentDemo'
import DirectiveDemo from './views/DirectiveDemo'

export default {
    name: 'app',
    components: {
        ComponentDemo,
        DirectiveDemo
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 820px;
    margin: 0 auto;
}
</style>
