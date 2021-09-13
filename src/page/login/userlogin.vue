<template>
  <el-form ref="loginForm"
           :model="authForm"
           :rules="authRules"
           class="login-form"
           label-width="0"
           status-icon>
    <el-form-item v-if="tenantMode" prop="tenantId">
      <el-input v-model="authForm.tenantId"
                :placeholder="$t('login.tenantId')"
                auto-complete="off"
                size="small"
                @keyup.enter.native="handleLogin">
        <i slot="prefix"
           class="iconfont icon-quanxian"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="username">
      <el-input v-model="authForm.username"
                :placeholder="$t('login.username')"
                auto-complete="off"
                clearable
                size="small"
                @keyup.enter.native="handleLogin">
        <i slot="prefix"
           class="iconfont icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="authForm.password"
                :placeholder="$t('login.password')"
                :type="passwordType"
                auto-complete="off"
                clearable
                size="small"
                @keyup.enter.native="handleLogin">
        <i slot="prefix"
           class="iconfont icon-mima"></i>
        <i slot="suffix"
           class="el-icon-view el-input__icon"
           @click="showPassword"></i>
      </el-input>
    </el-form-item>
    <el-form-item v-if="captchaMode" prop="captcha">
      <el-row :span="24">
        <el-col :span="16">
          <el-input v-model="authForm.captcha"
                    :placeholder="$t('login.captcha')"
                    auto-complete="off"
                    clearable
                    size="small"
                    @keyup.enter.native="handleLogin">
            <i slot="prefix" class="iconfont icon-yanzhengma"/>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="authForm.captchaImage.content" alt="图形验证码" class="login-code-img"
                 @click="refreshCode();"/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button class="login-submit"
                 size="small"
                 type="primary"
                 @click.native.prevent="handleLogin">{{ $t('login.submit') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapGetters} from "vuex";
import website from '@/config/website';
import {getCaptcha, getPasswordPublicKey} from "@/api/auth";
import func from "@/util/func";

export default {
  name: "userlogin",
  data() {
    return {
      tenantMode: website.tenantMode,
      captchaMode: website.captchaMode,
      authForm: {
        //租户ID
        // tenantId: "000000",
        //用户名
        username: "",
        //密码
        password: "",
        authCode: "",
        //账户类型
        authType: "BASIC",
        grantType: "AUTH_CODE",
        //验证码的值
        captcha: "",
        captchaImage: {
          id: "",
          //预加载白色背景
          content: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        },
        publicKey: {
          id: "",
          content: ""
        },
      },
      authRules: {
        tenantId: [
          {required: this.tenantMode, message: "请输入租户 ID", trigger: "blur"}
        ],
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur"}
        ],
        captcha: [
          {required: website.captchaMode, message: "请输入验证码", trigger: "blur"},
          {len: 5, message: "验证码长度为 5 位", trigger: "blur"}
        ]
      },
      passwordType: "password"
    };
  },
  created() {
    this.refreshCode();
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    refreshCode() {
      getCaptcha().then(res => {
        this.authForm.captchaImage = res.data.data;
        this.refreshPublicKey();
      })
    },
    refreshPublicKey() {
      getPasswordPublicKey().then(res => {
        this.authForm.publicKey = res.data.data;
      })
    },
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后。。。',
            spinner: "el-icon-loading"
          });

          await this.$store.dispatch("AuthenticateByUsername", this.authForm).then(() => {
          }).catch(() => {
            loading.close()
          });
          if (!func.isEmpty(this.authForm.authCode)) {
            await this.$store.dispatch("AuthorizeByUsername", this.authForm).then(() => {
              this.$router.push({path: this.tagWel.value});
              loading.close();
            }).catch(() => {
              loading.close()
            });
          } else {
            this.refreshCode();
          }
        }
      });
    },
  }
};
</script>

<style>
</style>
