<template>
    <div class="demo">
        <h2>左边</h2>
        <ellipsis style="color:red;" class="sample-item" position="start">
            很长很long long long long long long lo长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长long long long long long long lo的文字
        </ellipsis>
        <ellipsis style="font-size: 24px;" class="sample-item" position="start">
            这段文字很长，会显示 title 提示框
        </ellipsis>
        <ellipsis style="font-size: 40px;" class="sample-item" position="start" fill="------">
            很长很长long long long long long long lo很长很long long long long long long lo长很长很长很长很长long long long long long long lo很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
        </ellipsis>
        <ellipsis class="sample-item" position="start" fill="------">long long long long long long long long long long
            long long long
            long long long long long long long long long long text
        </ellipsis>
        <h2>中间</h2>
        <ellipsis class="sample-item" position="middle" :show-title="false">
            这段文字虽然很长，但是并不会显示 title 提示框
        </ellipsis>
        <ellipsis class="sample-item" position="middle">long long long long long long long long long long long long long
            long long long long long long long long long long text
        </ellipsis>
        <ellipsis class="sample-item" position="middle" fill="------">
            很长很long long long long long long lo长很长long long long long long long lo很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长long long long long long long lo很长很长的文字
        </ellipsis>
        <ellipsis class="sample-item" position="middle" fill="------">long long long long long long long long long long
            long long long
            long long long long long long long long long long text
        </ellipsis>
        <h2>右边</h2>
        <ellipsis class="sample-item" position="end" id="xx1">
            {{text}}
        </ellipsis>
        <ellipsis class="sample-item" position="end">long long long long long long long long long long long long long
            long long long long long long long long long long text
        </ellipsis>
        <ellipsis class="sample-item" position="end" fill="------" :text="text" id="xx2">
        </ellipsis>
        <ellipsis class="sample-item" position="end" fill="------" v-if="showLastItem">
            <span>text content</span>
            These text will be ignored
        </ellipsis>
    </div>
</template>

<script>
export default {
    name: "Demo",
    data() {
        return {
            showLastItem: true,
            text: "很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字"
        }
    },
    mounted() {
        setTimeout(() => {
            this.text = "不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长的文字"
            this.showLastItem = false
        }, 3000)
    }
}
</script>

<style scoped>
.sample-item {
    width: 160px;
}
</style>
