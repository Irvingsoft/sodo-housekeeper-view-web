<template>
  <div>
    <basic-container>
      <third-register></third-register>
      <p style="text-align: center;">
        <img alt="Version" src="https://img.shields.io/badge/Version-1.0--SNAPSHOT-brightgreen"/>
        <img alt="JDK" src="https://img.shields.io/badge/JDK-1.8+-success.svg"/>
        <img alt="SpringCloud" src="https://img.shields.io/badge/SpringCloud-Hoxton.SR9-green"/>
        <img alt="SpringBoot" src="https://img.shields.io/badge/SpringBoot-2.3.5.RELEASE-blue.svg"/>
        <a href="#" target="_blank">
          <img alt="Sodo Author" src="https://img.shields.io/badge/Sodo%20Author-TimeChaser-ff69b4.svg"/>
        </a>
        <a href="#" target="_blank">
          <img alt="Copyright" src="https://img.shields.io/badge/Copyright-Irvingsoft-%23ff3f59.svg"/>
        </a>
      </p>
    </basic-container>
    <el-col :span="16">
      <basic-container>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item name="1" title="欢迎使用 Sodo">

          </el-collapse-item>
          <el-collapse-item name="2" title="什么是 Sodo-Platform">
            <div>1. Sodo-Platform 是一个基于接口的权限控制微服务快速开发平台</div>
          </el-collapse-item>
        </el-collapse>
      </basic-container>
    </el-col>
    <el-col :span="8">
      <el-row>
        <basic-container>
          <div class="el-font-size">
            <span>产品名称</span>
            <el-divider direction="vertical"/>
            <span><el-tag>Sodo 微服务开发平台</el-tag></span>
            <el-divider content-position="right"><i class="el-icon-star-off"/></el-divider>
            <span>账号密码</span>
            <el-divider direction="vertical"/>
            <el-tag effect="plain">管理员(admin)</el-tag>
          </div>
        </basic-container>
      </el-row>
      <el-row>
        <basic-container>
          <el-collapse v-model="logActiveNames" @change="handleChange">
            <el-collapse-item name="0" title="1.0-SNAPSHOT 发布">
              <div>1. 基本完成 Sodo 的核心模块--IBAC（Interface based access control）基于接口的权限控制</div>
              <div>2. 完成 sodo-platform  以及 sodo-housekeeper-view-web 的 CI/CD 流水线、镜像私服的搭建</div>
            </el-collapse-item>
          </el-collapse>
        </basic-container>
      </el-row>
    </el-col>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "wel",
  data() {
    return {
      activeNames: ['1', '2', '3', '5'],
      logActiveNames: ['25']
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
  },
  methods: {
    handleChange(val) {
      console.log(val);
    }
  }
};
</script>

<style>
.el-divider--horizontal {
  margin: 12px 0 !important;
}

.el-font-size {
  font-size: 14px;
}
</style>

