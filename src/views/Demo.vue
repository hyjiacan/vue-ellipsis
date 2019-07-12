<template>
    <div class="demo">
        <h2>自动缩小文字</h2>
        <div class="sample-item" v-ellipsis.scale>
            |这里有一些文字这里有一些文字这里有一些文字字这里有一些文字字这里有一些文字|
        </div>
        <h2>左边</h2>
        <div style="color:red;" class="sample-item" v-ellipsis.start="rows" title="自定义title">
            很长很long long long long long long lo长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长long long long long
            long long lo的文字，3秒后显示所有文字
        </div>
        <div style="font-size: 24px;" class="sample-item" v-ellipsis.start>
            这段文字很长，会显示 title 提示框
        </div>
        <div style="font-size: 40px;" class="sample-item" v-ellipsis.delay.start data-ellipsis="------">
            很长很长long long long long long long lo很长很long long long long long long lo长很长很长很长很长long long long long long
            long lo很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
        </div>
        <div class="sample-item" v-ellipsis.start="2" data-ellipsis="------">long long long long long long long
            long long
            long
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
        <div class="sample-item" v-ellipsis.middle.none data-ellipsis="------">
            这段文字不会显示 中间的填充数据中间的填充数据中间的填充数据 title
        </div>
        <div class="sample-item" v-ellipsis.middle="3" data-ellipsis="------">
            设置省略在中间时，暂不支持指定多行显示
            设置省略在中间时，暂不支持指定多行显示
            设置省略在中间时，暂不支持指定多行显示
        </div>
        <h2>右边</h2>
        <div class="sample-item" v-ellipsis.end>
            {{text}}
        </div>
        <div class="sample-item" v-ellipsis.end.always>
            这段文字始终显示 title
        </div>
        <div class="sample-item" v-ellipsis.end data-ellipsis="------">
            {{text}}
        </div>
        <div class="sample-item" v-ellipsis.end="3" data-ellipsis="------">long long long long long
            long long
            long
            long long long long long
            long long long long long long long long long long text
            long long long long long long long long long long text
            long long long long long long long long long long text
        </div>
        <h2>子元素</h2>
        <div class="sample-item" v-ellipsis>
            <div>
                子元素无法识别，保留原始文本，同时控制台会收到错误信息:
                <p>
                    [Vue warn]: Error in directive ellipsis inserted hook: "Error: Ellipsis: accept text node only"
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Demo",
    data() {
        return {
            rows: 1,
            text: "很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字"
        }
    },
    mounted() {
        setTimeout(() => {
            this.rows = 0
            this.text = "不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长的文字"
        }, 3000)
    }
}
</script>

<style scoped>
.demo {
    margin: 0 auto;
    width: 400px;
}

.sample-item {
    width: 360px;
    margin: 20px 0;
}
</style>
