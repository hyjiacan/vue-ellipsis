<template>
    <div id="app">
        <div>
            <h1 style="float: left">
                <span>vue-ellipsis</span>
                <small>Customize ellipsis-like <b>directive</b> for Vue2. </small>
            </h1>
            <div style="float: right">
                <span>仓库:</span>
                <a href="https://github.com/hyjiacan/vue-ellipsis">Github</a>
                <a href="https://gitee.com/hyjiacan/vue-ellipsis">Gitee</a>
            </div>
        </div>
        <div class="demos">
            <h3>引入</h3>
            <code>import Ellipsis from '@hyjican/vue-ellipsis'</code>
            <code>Vue.use(Ellipsis)</code>
            <component-demo style="float: left"/>
            <directive-demo style="float: right"/>
        </div>
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

small {
    font-size: small;
    color: #555;
    font-weight: normal;
}

a {
    color: #6187b6;
    margin: 0 10px;
}

.demos {
    clear: both;
}

.demo {
    margin: 0 auto;
    width: 400px;
}

.sample-item {
    width: 360px;
}

code {
    background-color: #fafbf0;
    color: #25538f;
    padding: 5px;
    display: block;
    font-family: Consolas, serif;
    margin: 10px 0 20px 0;
    border-left: 2px solid #d5b77a;
    font-size: 12px;
}

code:hover {
    color: #318f65;
}
</style>
