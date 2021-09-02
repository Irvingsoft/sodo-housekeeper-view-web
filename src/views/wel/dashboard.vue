<template>
  <basic-container>
    <div class="wel">
      <basic-block :height="height"
                   :width="width"
                   background="/img/bg/bg3.jpg"
                   color="#d56259"
                   icon="el-icon-platform-eleme"
                   text="开始菜单1"
                   time="1"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   background="/img/bg/bg2.jpg"
                   color="#419ce7"
                   icon="el-icon-eleme"
                   text="开始菜单2"
                   time="2"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#56b69b"
                   icon="el-icon-delete-solid"
                   text="开始菜单3"
                   time="3"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#d44858"
                   icon="el-icon-delete"
                   text="开始菜单4"
                   time="4"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#3a1f7e"
                   icon="el-icon-s-tools"
                   text="开始菜单5"
                   time="5"></basic-block>
      <basic-block :height="height"
                   :width="410"
                   background="/img/bg/bg1.jpg"
                   color="#422829"
                   dept="这是一段很长的很长很长很长的描述这是一段很长的很长很长很长的描述"
                   icon="el-icon-setting"
                   text="开始菜单6"
                   time="6"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#613cbd"
                   icon="el-icon-user-solid"
                   text="开始菜单7"
                   time="7"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#da542e"
                   icon="el-icon-star-off"
                   text="开始菜单8"
                   time="8"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#2e8aef"
                   icon="el-icon-goods"
                   text="开始菜单9"
                   time="9"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#3d17b8"
                   icon="el-icon-circle-check"
                   text="开始菜单10"
                   time="10"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#e31462"
                   icon="el-icon-s-platform"
                   text="开始菜单11"
                   time="11"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#d9532d"
                   icon="el-icon-s-fold"
                   text="开始菜单12"
                   time="12"></basic-block>
      <basic-block :height="height"
                   :width="410"
                   color="#b72147"
                   dept="这是一段很长的很长很长很长的描述这是一段很长的很长很长很长的描述"
                   icon="el-icon-s-open"
                   text="开始菜单13"
                   time="13"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#01a100"
                   icon="el-icon-s-flag"
                   text="开始菜单14"
                   time="14"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#0c56bf"
                   icon="el-icon-s-data"
                   text="开始菜单15"
                   time="15"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   color="#0098a9"
                   icon="el-icon-s-grid"
                   text="开始菜单16"
                   time="16"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   background="/img/bg/bg2.jpg"
                   color="#209bdf"
                   icon="el-icon-s-release"
                   text="开始菜单17"
                   time="17"></basic-block>
      <basic-block :height="height"
                   :width="width"
                   background="/img/bg/bg3.jpg"
                   color="#603bbc"
                   icon="el-icon-s-home"
                   text="开始菜单18"
                   time="18"></basic-block>
      <basic-block :height="height"
                   :width="515"
                   color="#009bad"
                   dept="这是一段很长的很长很长很长的描述这是一段很长的很长很长很长的描述"
                   icon="el-icon-s-promotion"
                   text="开始菜单19"
                   time="19"></basic-block>
      <basic-block :height="height"
                   :width="515"
                   background="/img/bg/bg4.jpg"
                   color="#d74e2a"
                   dept="这是一段很长的很长很长很长的描述这是一段很长的很长很长很长的描述"
                   icon="el-icon-s-custom"
                   text="开始菜单20"
                   time="20"></basic-block>
    </div>
  </basic-container>
</template>

<script>
export default {
  data() {
    return {
      width: 200,
      height: 120,
    }
  }
}
</script>

<style lang="scss">
.wel {
  display: flex;
  flex-wrap: wrap;
  width: 1100px;
  margin: 0 auto;
}
</style>
