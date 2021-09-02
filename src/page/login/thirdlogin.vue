<template>
  <div class="social-container">
    <div @click="handleClick('github')">
      <span :style="{backgroundColor:'#61676D'}" class="container">
        <i class="iconfont icongithub" icon-class="github"></i>
      </span>
      <p class="title">{{ $t('login.github') }}</p>
    </div>
    <div @click="handleClick('gitee')">
      <span :style="{backgroundColor:'#c35152'}" class="container">
        <i class="iconfont icongitee2" icon-class="gitee"></i>
      </span>
      <p class="title">{{ $t('login.gitee') }}</p>
    </div>
    <div @click="handleClick('wechat_open')">
      <span :style="{backgroundColor:'#8dc349'}" class="container">
        <i class="iconfont icon-weixin" icon-class="wechat"/>
      </span>
      <p class="title">{{ $t('login.wechat') }}</p>
    </div>
    <div @click="handleClick('qq')">
      <span :style="{backgroundColor:'#6ba2d6'}" class="container">
        <i class="iconfont icon-qq" icon-class="qq"/>
      </span>
      <p class="title">{{ $t('login.qq') }}</p>
    </div>
  </div>
</template>

<script>
import website from '@/config/website';

export default {
  name: "thirdLogin",
  methods: {
    handleClick(source) {
      window.location.href = `${website.authUrl}/${source}`;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.social-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .iconfont {
    color: #fff;
    font-size: 30px;
  }

  .container {
    $height: 50px;
    cursor: pointer;
    display: inline-block;
    width: $height;
    height: $height;
    line-height: $height;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .title {
    text-align: center;
  }
}
</style>
