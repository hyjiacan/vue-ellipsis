<template>
  <div class="demo">
    <h2>指令示例/Use directive</h2>
    <code>
      &lt;div v-ellipsis.[start|middle|end].[always|none|auto].scale="1" data-ellipsis="###"/>
    </code>
    <h3>自动缩小文字/Auto scale</h3>
    <div class="sample-item" v-ellipsis.scale>
      |这里有一些文字这里有一些文字这里有一些文字字这里有一些文字字这里有一些文字|
    </div>
    <code>v-ellipsis.scale</code>
    <h3>左边/Left</h3>
    <div style="color:red;" class="sample-item" v-ellipsis.start="rows" title="自定义title">
      很长很long long long long long long lo长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长long long long long
      long long lo的文字，{{timeout}}秒后显示所有文字
    </div>
    <code>v-ellipsis.start="rows"</code>
    <div style="font-size: 24px;" class="sample-item" v-ellipsis.start>
      这段文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长，会显示 title 提示框
    </div>
    <code>v-ellipsis.start</code>
    <div style="font-size: 40px;" class="sample-item" v-ellipsis.delay.start data-ellipsis="------">
      很长很长long long long long long long lo很长很long long long long long long lo长很长很长很长很长long long long long long
      long lo很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字
    </div>
    <code>v-ellipsis.delay.start data-ellipsis="------"</code>
    <div class="sample-item" v-ellipsis.start="2" data-ellipsis="------">long long long long long long long
      long long
      long
      long long long
      long long long long long long long long long long text
    </div>
    <code>v-ellipsis.start="2" data-ellipsis="------"</code>
    <h3>中间/Middle</h3>
    <div class="sample-item" v-ellipsis.middle>
      这段文字很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长，但是并不会显示 title 提示框
    </div>
    <code>v-ellipsis.middle</code>
    <div class="sample-item" v-ellipsis.middle>long long long long long long long long long long long long long
      long long long long long long long long long long text
    </div>
    <code>v-ellipsis.middle</code>
    <div class="sample-item" v-ellipsis.middle.none data-ellipsis="------">
      这段文字不会显示 中间的填充数据中间的填充数据中间的填充数据 title
    </div>
    <code>v-ellipsis.middle.none data-ellipsis="------"</code>
    <h3>右边/Right</h3>
    <div class="sample-item" v-ellipsis.end>
      {{text}}
    </div>
    <code>v-ellipsis.end</code>
    <div class="sample-item" v-ellipsis.end.always>
      这段文字始终显示 title
    </div>
    <code>v-ellipsis.end.always</code>
    <div class="sample-item" v-ellipsis.end data-ellipsis="------">
      {{text}}
    </div>
    <code>v-ellipsis.end data-ellipsis="------"</code>
    <div class="sample-item" v-ellipsis.end="3" data-ellipsis="------">long long long long long
      long long
      <span>long</span>
      <b>long long long long long</b>
      <div>long long long long long long long long long long text</div>
      long long long long long long long long long long text
      long long long long long long long long long long text
    </div>
    <code>v-ellipsis.end="3" data-ellipsis="------"</code>
  </div>
</template>

<script>
export default {
  name: 'DirectiveDemo',
  data() {
    return {
      rows: 1,
      text: '很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字',
      timeout: 10
    }
  },
  mounted() {
    // let handle = setInterval(() => {
    //   this.timeout--
    //   if (this.timeout > 0) {
    //     return
    //   }
    //   clearInterval(handle)
    //   this.rows = 0
    //   this.text = '不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长不长的文字'
    // }, 1000)
  }
}
</script>
