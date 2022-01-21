<template>
  <div id="global-layout">
    <component :is="layout"/>
    <footer>
      <div style="display: flex;justify-content: center;">
        <img src="../../../assets/ba.png" style="width:20px;height:20px">
        <div>
          <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44010602009076" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">粤公网安备 44010602009076号</p></a>
        </div>
        <div class="one" style="margin-left: 20px">
          <span style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">互联网ICP备案：</span>
          <a target="_blank" href="https://beian.miit.gov.cn/" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;"><img src="" style="float:left;"/><p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">粤ICP备2021029362号</p></a>
      </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  computed: {
    layout () {
      if (this.$page.path) {
        if (this.$frontmatter.layout) {
          // 你也可以像默认的 globalLayout 一样首先检测 layout 是否存在
          return this.$frontmatter.layout
        }
        return 'Layout'
      }
      return 'NotFound'
    }
  }
}
</script>
