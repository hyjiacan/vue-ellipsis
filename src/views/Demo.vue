<template>
    <div class="demo">
        <h2>左边</h2>
        <div style="color:red;" class="sample-item" v-ellipsis.start title="自定义title">
            很长很long long long long long long lo长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长long long long long
            long long lo的文字
        </div>
        <div style="font-size: 24px;" class="sample-item" v-ellipsis.start>
            这段文字很长，会显示 title 提示框
        </div>
        <div style="font-size: 40px;" class="sample-item" v-ellipsis.start="'------'">
            很长很长long long long long long long lo很长很long long long long long long lo长很长很长很长很长long long long long long
            long lo很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
        </div>
        <div class="sample-item" v-ellipsis.start="'------'">long long long long long long long long long long
            long long long
            long long long long long long long long long long text
        </div>
        <h2>中间</h2>
        <div class="sample-item" v-ellipsis.middle>
            这段文字虽然很长，但是并不会显示 title 提示框
        </div>
        <div class="sample-item" v-ellipsis.middle>long long long long long long long long long long long long long
            long long long long long long long long long long text
        </div>
        <div class="sample-item" v-ellipsis.middle="'------'">
            很长很long long long long long long lo长很长long long long long long long
            lo很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长long long long long long long lo很长很长的文字
        </div>
        <div class="sample-item" v-ellipsis.middle="'------'">long long long long long long long long long long
            long long long
            long long long long long long long long long long text
        </div>
        <h2>右边</h2>
        <div class="sample-item" v-ellipsis.end>
            {{text}}
        </div>
        <div class="sample-item" v-ellipsis.end>long long long long long long long long long long long long long
            long long long long long long long long long long text
        </div>
        <div class="sample-item" v-ellipsis.end="'------'">
            {{text}}
        </div>
        <div class="sample-item" v-ellipsis.end="'------'" v-if="showLastItem">long long long long long long long long long long long long long
            long long long long long long long long long long text
        </div>
        <h2>使用指令</h2>
        <div class="sample-item" v-ellipsis.left="'...'">{{text}}</div>
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
