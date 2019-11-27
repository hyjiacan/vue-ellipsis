<template>
    <div class="demo">
        <h1>组件</h1>
        <h2>自动缩小文字</h2>
        <ellipsis class="sample-item" scale>|这里有一些文字这里有一些文字这里有一些文字字这里有一些文字字这里有一些文字|</ellipsis>
        <h2>左边</h2>
        <ellipsis style="color:red;" class="sample-item" position="start" :rows="rows" title="自定义title">
            很长很long long long long long long lo长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长long long long long
            long long lo的文字，{{timeout}}秒后显示所有文字
        </ellipsis>
        <ellipsis style="font-size: 24px;" class="sample-item" position="start">
            这段文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长，会显示 title 提示框
        </ellipsis>
        <ellipsis style="font-size: 40px;" class="sample-item" position="start" delay fill="------">
            很长很长long long long long long long lo很长很long long long long long long lo长很长很长很长很长long long long long long
            long lo很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
        </ellipsis>
        <ellipsis class="sample-item" position="start" :rows="2" fill="------">long long long long long long long
            long long
            long
            long long long
            long long long long long long long long long long text
        </ellipsis>
        <h2>中间</h2>
        <ellipsis class="sample-item" position="middle">
            这段文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长，但是并不会显示 title 提示框
        </ellipsis>
        <ellipsis class="sample-item" position="middle">long long long long long long long long long long long long long
            long long long long long long long long long long text
        </ellipsis>
        <ellipsis class="sample-item" position="middle" show-title="none" fill="------">
            这段文字不会显示 中间的填充数据中间的填充数据中间的填充数据 title
        </ellipsis>
        <h2>右边</h2>
        <ellipsis class="sample-item" position="end">
            {{text}}
        </ellipsis>
        <ellipsis class="sample-item" position="end" showTitle="always">
            这段文字始终显示 title
        </ellipsis>
        <ellipsis class="sample-item" position="end" fill="------">
            {{text}}
        </ellipsis>
        <ellipsis class="sample-item" position="end" :rows="3" fill="------">long long long long long
            long long
            <span>long</span>
            <b>long long long long long</b>
            <div>long long long long long long long long long long text</div>
            long long long long long long long long long long text
            long long long long long long long long long long text
            long long long long long long long long long long text
        </ellipsis>
    </div>
</template>

<script>
export default {
    name: 'ComponentDemo',
    data () {
        return {
            rows: 1,
            text: '很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字',
            timeout: 10
        }
    },
    mounted () {
        let handle = setInterval(() => {
            this.timeout--
            if (this.timeout > 0) {
                return
            }
            clearInterval(handle)
            this.rows = 0
            this.text = '不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长的文字'
        }, 1000)
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
