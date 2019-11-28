<template>
    <div id="app">
        <div>
            <h1 style="float: left">
                <span>vue-ellipsis</span>
                <small>Customize ellipsis-like support for Vue2. </small>
            </h1>
            <div style="float: right;margin-top:25px;">
                <a href="https://github.com/hyjiacan/vue-ellipsis">Github</a>
                <a href="https://gitee.com/hyjiacan/vue-ellipsis">Gitee</a>
                <a href="https://www.npmjs.com/package/@hyjiacan/vue-ellipsis">NPM</a>
            </div>
        </div>
        <div class="demos">
            <usage/>
            <hr/>
            <component-demo style="float: left"/>
            <directive-demo style="float: right"/>
        </div>
        <hr/>
    </div>
</template>

<script>
import ComponentDemo from './views/ComponentDemo'
import DirectiveDemo from './views/DirectiveDemo'
import Usage from './views/Usage'

export default {
    name: 'app',
    components: {
        Usage,
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
    padding-bottom: 120px;
}

small {
    font-size: small;
    color: #555;
    font-weight: normal;
	margin-left: 15px;
}

a {
    color: #6187b6;
    margin: 0 10px;
}

a:hover {
    color: #318f65;
}

.demos {
    clear: both;
}

.demos:after {
    content: ' ';
    display: block;
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
    padding: 10px 5px;
    display: block;
    font-family: Consolas, serif;
    margin: 10px 0 20px 0;
    border-left: 2px solid #d5b77a;
    font-size: 12px;
    line-height: 1.5;
}

code:hover {
    color: #318f65;
}
</style>
