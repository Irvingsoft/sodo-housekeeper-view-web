<template>
  <div>
    <basic-container>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="个人信息" name="userInfo">
          <avue-form class="form"
                     :option="userInfo"
                     v-model="userInfoForm"
                     @submit="submitUserInfo"></avue-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="password">
          <avue-form class="form"
                     :option="password"
                     v-model="passwordForm"
                     @submit="submitPassword"></avue-form>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import {getUserInfo, updatePassword, updateUser} from "@/api/user";
import {getPasswordPublicKey} from "@/api/auth";
import {getEncryptor} from "@/util/util";

export default {
  data() {
    let validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码！'));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致！'));
      } else {
        callback();
      }
    };
    return {
      activeName: 'userInfo',
      index: 0,
      userInfo: {
        column: [{
          label: '头像',
          type: 'upload',
          listType: 'picture-img',
          propsHttp: {
            res: 'data',
            url: 'link',
          },
          canvasOption: {text: 'blade', ratio: 0.1},
          action: '/api/blade-resource/oss/endpoint/put-file',
          tip: '只能上传jpg/png用户头像，且不超过500kb',
          span: 12,
          row: true,
          prop: 'avatarUrl'
        }, {
          label: '昵称',
          span: 12,
          row: true,
          size: 10,
          prop: 'nickname',
          rules: [{required: true, message: "请输入昵称", trigger: "blur"}],
        }, {
          label: '性别',
          prop: 'gender',
          type: "radio",
          dicData: [
            {label: "保密", value: 0},
            {label: "男", value: 1},
            {label: "女", value: 2},
          ],
          hide: true
        }]
      },
      password: {
        column: [{
          label: '原密码',
          span: 12,
          row: true,
          type: 'password',
          prop: 'oldPassword',
          rules: [{required: true, message: "请输入原密码", trigger: "blur"}],
        }, {
          label: '新密码',
          span: 12,
          row: true,
          type: 'password',
          prop: 'newPassword',
          rules: [
            {required: true, message: "请输入新密码", trigger: "blur"},
            {min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur"}
          ],
        }, {
          label: '确认密码',
          span: 12,
          row: true,
          type: 'password',
          prop: 'confirmPassword',
          rules: [
            {required: true, message: "请再次输入密码", trigger: "blur"},
            {validator: validateConfirmPassword, trigger: 'blur'}
          ],
        }]
      },
      userInfoForm: {},
      passwordForm: {},
      publicKey: {}
    };
  },
  computed: {},
  created() {
    this.getUserInfo();
  },
  methods: {
    async submitUserInfo(userInfoForm, done) {
      await updateUser(userInfoForm).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "修改信息成功!"
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.detail
          });
        }
        done();
      }, error => {
        window.console.log(error);
        done();
      })
    },
    async submitPassword(passwordForm, done) {
      let data = {};
      data.oldPassword = getEncryptor(this.publicKey.content).encrypt(passwordForm.oldPassword);
      data.newPassword = getEncryptor(this.publicKey.content).encrypt(passwordForm.newPassword);
      await updatePassword(data, this.publicKey.id).then(res => {
        if (res.data.code === 200) {
          this.$message({
            type: "success",
            message: "修改密码成功，请重新登录！"
          });
          this.$store.dispatch('FedLogOut').then(() => {
            this.$router.push({path: "/login"});
          })
        } else {
          this.$message({
            type: "error",
            message: res.data.detail
          });
        }
        done();
      }, error => {
        window.console.log(error);
        done();
      })
    },
    getUserInfo() {
      getUserInfo().then(res => {
        let user = res.data.data;
        this.userInfoForm = {
          avatarUrl: user.avatarUrl,
          nickname: user.nickname,
          gender: user.gender,
        }
        this.$store.commit('SET_USER_INFO', user);
      });
    },
    getPasswordPublicKey() {
      getPasswordPublicKey().then(res => {
        this.publicKey = res.data.data;
      })
    },
    handleTabClick(tab) {
      if (tab.name === "userInfo") {
        this.getUserInfo();
      } else if (tab.name === "password") {
        this.getPasswordPublicKey();
      }
    }
  }
};
</script>

<style>

.form {
  padding: 15px;
}
</style>
