# vue-ellipsis

Customize ellipsis-like support for Vue2. 

Samples: https://hyjiacan.github.io/vue-ellipsis/

> Note: Put too many vue-ellipsis in a single page may cause performance issue. 

## Install

```bash
yarn add @hyjiacan/vue-ellipsis
```
or 
```bash
npm install @hyjiacan/vue-ellipsis
```

## Usage

```javascript
import ellipsis from '@hyjiacan/vue-ellipsis'
Vue.use(ellipsis)
```

or 

```javascript
import {ellipsisDirective, ellipsisComponent} from '@hyjiacan/vue-ellipsis'
// For directive usage
Vue.directive(ellipsisDirective.name, ellipsisDirective)
// For component usage
Vue.component(ellipsisComponent.name, ellipsisComponent)

// Use one of above makes it works.
```

You should specify the width via CSS.

```css
.ellipsis-style{
    width: 200px;
}
.ellipsis-style{
    width: 80%;
}
.ellipsis-style{
    max-width: 200px;
}
```

or `STYLE`

```html
<div style="width: 200px"></div>
<ellipsis style="width: 80%"></ellipsis>
<ellipsis style="width: 200px"></ellipsis>
```

## Directive

- The value of directive `v-ellipsis` is the rows, default value: `1` , set `0` to show all text.

### Modifiers

|name|description|
|---|---|
|start|Show ellipsis as prefix|
|middle|Show ellipsis in the middle|
|end|Show ellipsis as suffix|
|always|**ALWAYS** show title while text overflow|
|none|**DO NOT** show title while text overflow|
|scale|Auto scale (`font-size`) text to fit container width, **WON'T** ellipsis|

- Modifiers `start`, `middle`, `end` are mutex, you should specify only one of them (default: `end`).
- Modifiers `always`, `none` are mutex, you should specify only one of them, 
or leave it empty(Set `title` when there is an ellipsis).

### Attributes

|name|default|description|
|---|---|---|
|data-ellipsis|`...`|Default fill text (ellipsis like text)|
|data-delay|`200`|the delay(milliseconds) for making ellipsis|

## Component

### Props

|name|type|default|description|
|---|---|---|---|
|fill|String|`...`|Default fill text (ellipsis like text)|
|position|String|end|Ellipsis position, options: `start`, `middle`, `end`|
|show-title|String|-|options: `always`, `none`|
|rows|Number|`1`|Number of rows, set `0` to show all text|
|scale|Boolean|false|Auto scale (`font-size`) text to fit container width, **DO NOT** ellipsis|
|content|String|end|The content, makes the slot `default` ignored|

### Slots

|name|description|
|---|---|
|default|The content|

## FAQ

1. Q: I have an element with padding by percentage, got unexpected display ?
A: Padding by percentage is not supported for now.
