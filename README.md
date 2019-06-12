# vue-ellipsis

Customize ellipsis-like component for Vue2. 

## Usage

Import as global component: *main.js*

```javascript
import Ellipsis from '@hyjican/vue-ellipsis'
Vue.use(Ellipsis, {
    // default properties
})
```

Usage: *Foobar.vue*

```vue
<ellipsis>Here is the text content</ellipsis>

<ellipsis fill="...">Here is the text content</ellipsis>

<ellipsis text="Here is the text content"></ellipsis>

<ellipsis position="start">Here is the text content</ellipsis>

<ellipsis position="middle">Here is the text content</ellipsis>

<ellipsis position="end">Here is the text content</ellipsis>
```

You should specify the width via CSS.

```vue
<ellipsis style="width: 200px">Here is the text content</ellipsis>

<ellipsis style="width: 100%">Here is the text content</ellipsis>
```

## Properties

|name|type|default|description|
|---|---|---|---|
|fill|String|...|String to instead of ellipsis|
|text|String|-|display text **recommend**|
|position|String|end|Ellipsis position, available values: `start`, `middle`, `end`|
|show-title|Boolean|true|Whether to show `title` while text overflow|

## Methods

|name|description|
|---|---|
|update|Rerender text|

## Slots

|name|description|
|---|---|
|default|The display content, this would be ignore if `text` is specified. Only the 1st node available|

> Note: `slot` is not responsive, it means component will not update even if you change the slot content
