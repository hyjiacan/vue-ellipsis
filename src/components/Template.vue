<template>
    <div :title="tipText">
        <slot></slot>
    </div>
</template>

<script>
import component from './component'

export default {
    name: "Ellipsis",
    ...component
}
</script>
