# vue-ellipsis

Customize ellipsis-like `directive` for Vue2. 

## Usage

Import as global: *main.js*

```javascript
import Ellipsis from '@hyjican/vue-ellipsis'
Vue.use(Ellipsis)
// or
Vue.directive('ellipsis', Ellipsis)
```

Usage: *Foobar.vue*

```vue
<div v-ellipsis>Here is the text content</div>

<div v-ellipsis="'...'">Here is the text content</div>

<div v-ellipsis.start>Here is the text content</div>

<div v-ellipsis.middle>Here is the text content</div>

<div v-ellipsis.end>Here is the text content</div>
```

You should specify the width via CSS.

```vue
<style>
.ellipsis-style{
    max-width: 200px;
}
</style>

<div v-ellipsis style="width: 200px">Here is the text content</div>

<div v-ellipsis class="ellipsis-style">Here is the text content</div>
```

The value of directive `v-ellipsis` is the ellipsis-like text string (you should surround it with quotes, or give a `String` variable), default value: `...`

## Modifiers

|name|description|
|---|---|
|start|Show ellipsis as prefix|
|middle|Show ellipsis in the middle|
|end|Show ellipsis as suffix|
|always|Always show title while text overflow|
|none|Do not show title while text overflow|

- Modifiers `start`, `middle`, `end` are mutex, you should specify only one of them.
- Modifiers `always`, `none` are mutex, you should specify only one of them, or leave it empty.
