<template>
  <el-form class="login-form"
           status-icon
           :rules="authRules"
           ref="loginForm"
           :model="authForm"
           label-width="0">
    <el-form-item v-if="tenantMode" prop="tenantId">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="authForm.tenantId"
                auto-complete="off"
                :placeholder="$t('login.tenantId')">
        <i slot="prefix"
           class="icon-quanxian"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="username">
      <el-input size="small"
                clearable
                @keyup.enter.native="handleLogin"
                v-model="authForm.username"
                auto-complete="off"
                :placeholder="$t('login.username')">
        <i slot="prefix"
           class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small"
                clearable
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="authForm.password"
                auto-complete="off"
                :placeholder="$t('login.password')">
        <i slot="prefix"
           class="icon-mima"></i>
        <i class="el-icon-view el-input__icon"
           slot="suffix"
           @click="showPassword"></i>
      </el-input>
    </el-form-item>
    <el-form-item v-if="captchaMode" prop="captcha">
      <el-row :span="24">
        <el-col :span="16">
          <el-input size="small"
                    clearable
                    @keyup.enter.native="handleLogin"
                    v-model="authForm.captcha"
                    auto-complete="off"
                    :placeholder="$t('login.captcha')">
            <i slot="prefix" class="icon-yanzhengma"/>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img alt="图形验证码" :src="authForm.captchaImage.content" class="login-code-img"
                 @click="refreshCode();refreshPublicKey()"/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 size="small"
                 @click.native.prevent="handleLogin"
                 class="login-submit">{{ $t('login.submit') }}
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
        grantType: "AUTHCODE",
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
    this.refreshPublicKey();
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    refreshCode() {
      getCaptcha().then(res => {
        // this.loginForm.key = data.key;
        this.authForm.captchaImage = res.data.data;
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
            this.refreshPublicKey();
          }
        }
      });
    },
  }
};
</script>

<style>
</style>
