<template>
  <div class="demo">
    <h2>组件示例/Use component</h2>
    <code>
      &lt;ellipsis position="start|middle|end" show-title="always|none|auto" :rows="1" scale fill="###"/>
    </code>
    <h3>自动缩小文字/Auto scale</h3>
    <ellipsis class="sample-item" scale>|这里有一些文字这里有一些文字这里有一些文字字这里有一些文字字这里有一些文字|</ellipsis>
    <code>scale</code>
    <h3>左边/Left</h3>
    <ellipsis style="color:red;" class="sample-item" position="start" :rows="rows" title="自定义title">
      很长很long long long long long long lo长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长long long long long
      long long lo的文字，{{timeout}}秒后显示所有文字
    </ellipsis>
    <code>position="start" :rows="rows"</code>
    <ellipsis style="font-size: 24px;" class="sample-item" position="start">
      这段文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长，会显示 title 提示框
    </ellipsis>
    <code>position="start"</code>
    <ellipsis style="font-size: 40px;" class="sample-item" position="start" delay fill="------">
      很长很长long long long long long long lo很长很long long long long long long lo长很长很长很长很长long long long long long
      long lo很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
    </ellipsis>
    <code>position="start" delay fill="------"</code>
    <ellipsis class="sample-item" position="start" :rows="2" fill="------">long long long long long long long
      long long
      long
      long long long
      long long long long long long long long long long text
    </ellipsis>
    <code>position="start" :rows="2" fill="------"</code>
    <h3>中间/Middle</h3>
    <ellipsis class="sample-item" position="middle">
      这段文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长，但是并不会显示 title 提示框
    </ellipsis>
    <code>position="middle"</code>
    <ellipsis class="sample-item" position="middle">long long long long long long long long long long long long long
      long long long long long long long long long long text
    </ellipsis>
    <code>position="middle"</code>
    <ellipsis class="sample-item" position="middle" show-title="none" fill="------">
      这段文字不会显示 中间的填充数据中间的填充数据中间的填充数据 title
    </ellipsis>
    <code>position="middle" show-title="none" fill="------"</code>
    <h3>右边/Right</h3>
    <ellipsis class="sample-item" position="end">
      {{text}}
    </ellipsis>
    <code>position="end"</code>
    <ellipsis class="sample-item" position="end" showTitle="always">
      这段文字始终显示 title
    </ellipsis>
    <code>position="end" showTitle="always"</code>
    <ellipsis class="sample-item" position="end" fill="------">
      {{text}}
    </ellipsis>
    <code>position="end" fill="------"</code>
    <ellipsis class="sample-item" position="end" :rows="3" fill="------">long long long long long
      long long
      <span>long</span>
      <b>long long long long long</b>
      <div>long long long long long long long long long long text</div>
      long long long long long long long long long long text
      long long long long long long long long long long text
      long long long long long long long long long long text
    </ellipsis>
    <code>position="end" :rows="3" fill="------"</code>
  </div>
</template>

<script>
export default {
  name: 'ComponentDemo',
  data() {
    return {
      rows: 1,
      text: '很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字',
      timeout: 10
    }
  },
  mounted() {
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
