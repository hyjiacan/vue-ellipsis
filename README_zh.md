# vue-ellipsis

基于 Vue2 的自定义文本省略支持。

示例: http://hyjiacan.gitee.io/vue-ellipsis

## 安装

```bash
yarn add @hyjiacan/vue-ellipsis
```
or 
```bash
npm install @hyjiacan/vue-ellipsis
```

## 用法

```javascript
import ellipsis from '@hyjiacan/vue-ellipsis'
Vue.use(ellipsis)
```
或 

```javascript
import {ellipsisDirective, ellipsisComponent} from '@hyjiacan/vue-ellipsis'
// 注册为指令
Vue.directive(ellipsisDirective.name, ellipsisDirective)
// 注册为组件
Vue.component(ellipsisComponent.name, ellipsisComponent)

// 使用上面的其中一种用法就行了
```

你需要通过CSS指定宽度

```css
.ellipsis-style{
    width: 200px;
}
.ellipsis-style{
    max-width: 200px;
}
```
或通过 `STYLE`

```html
<div style="width: 200px"></div>
<ellipsis style="width: 200px"></ellipsis>
```

- 指令示例 [./src/views/DirectiveDemo.vue](./src/views/DirectiveDemo.vue)
- 组件示例 [./src/views/ComponentDemo.vue](./src/views/ComponentDemo.vue)

## 指令

`v-ellipsis` 的值表示显示的行数，默认值为 `1` 

### 修饰符

|名称|描述|
|---|---|
|start|使用前置省略模式|
|middle|使用中置省略模式|
|end|后置省略模式|
|always|不论是否被省略，**始终**显示 `title`|
|none|不论是否被省略，**始终不**显示 `title`|
|scale|自动缩放(`font-size`)文本以适应容器宽度, 此时 **不会** 省略文本|

- 修饰符 `start`, `middle`, `end` 是互斥的，只能指定其中一个，默认为 `end`
- 修饰符 `always`, `none` 是互斥的，只能指定其中一个，留空时表示在省略时自动设置 `title`，相当于组件中的 `auto`

### 属性

|名称|默认值|描述|
|---|---|---|
|data-ellipsis|`...`|填充文本(代替默认的省略号)|
|data-delay|`200`|表示处理的延时(毫秒)|

## 组件

### 属性

|名称|类型|默认值|描述|
|---|---|---|---|
|fill|String|`...`|省略时的默认填充串|
|position|String|end|省略位置，可选值: `start`, `middle`, `end`|
|show-title|String|-|是否显示 `title`，可选值: `always`, `none`|
|rows|Number|`1`|显示的行数|
|scale|Boolean|false|自动缩放(`font-size`)文本以适应容器宽度, 此时 **不会** 省略文本|
|content|String|end|设置文本内容，此时会忽略槽 `default`|

### 插槽

|名称|描述|
|---|---|
|default|内容|

## 常见问题

1. 问: 为什么容器设置了 `padding` 为百分比时，显示异常？
答: 暂不支持 `padding` 为百分比

## 待办

- [ ] 优化 `middle` 的显示方式，尽量将填充放在容器中间，而不是两侧按字符数量处理
