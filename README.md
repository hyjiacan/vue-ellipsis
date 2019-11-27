# vue-ellipsis

Customize ellipsis-like support for Vue2. 

Samples: https://hyjiacan.github.io/vue-ellipsis/

## Usage

You should specify the width via CSS.

```css
.ellipsis-style{
    width: 200px;
}
.ellipsis-style{
    max-width: 200px;
}
```
or `STYLE`

```html
<div style="width: 200px"></div>
<ellipsis style="width: 200px"></ellipsis>
```

### Directive

The value of directive `v-ellipsis` is the rows, default value: `1` 
The value of attribute `data-ellipsis` is the ellipsis-like text string, default value: `...`
The value of attribute `data-delay` is the duration for making ellipsis, default value: `200`

#### Modifiers

|name|description|
|---|---|
|start|Show ellipsis as prefix|
|middle|Show ellipsis in the middle|
|end|Show ellipsis as suffix|
|always|Always show title while text overflow|
|none|Do not show title while text overflow|
|scale|Auto scale (`font-size`) text to fit container width, **DO NOT** ellipsis|
|delay|Whether to delay make ellipsis, you can specified duration via `data-delay="200"`|

- Modifiers `start`, `middle`, `end` are mutex, you should specify only one of them.
- Modifiers `always`, `none` are mutex, you should specify only one of them, or leave it empty.

#### Attributes

|name|default|description|
|---|---|---|
|data-ellipsis|`...`|Default fill text (ellipsis like text)|

## Component

### Props

|name|type|default|description|
|---|---|---|---|
|fill|String|`...`|Default fill text (ellipsis like text)|
|position|String|end|Ellipsis position, options: `start`, `middle`, `end`|
|show-title|String|-|options: `always`, `none`|
|rows|Number|1|-|
|scale|Boolean|false|Auto scale (`font-size`) text to fit container width, **DO NOT** ellipsis|
|content|String|end|The content, makes the slot `default` ignored|

### Slots

|name|description|
|---|---|
|default|The content|
