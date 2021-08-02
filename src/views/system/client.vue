<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data.records"
               :page="data"
               @row-del="rowDel"
               v-model="form"
               :permission="permissionList"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.client_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot="inUse" slot-scope="scope">
        <svg v-if="scope.row.inUse" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="register" slot-scope="scope">
        <svg v-if="scope.row.register" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
      <template slot="captcha" slot-scope="scope">
        <svg v-if="scope.row.captcha" class="icon" aria-hidden="true">
          <use xlink:href="#icon-true"></use>
        </svg>
        <svg v-else class="icon" aria-hidden="true">
          <use xlink:href="#icon-false"></use>
        </svg>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {getList, getDetail, add, update, remove, pageOauthClientInfo} from "@/api/system/client";
import {mapGetters} from "vuex";

export default {
  data() {
    return {
      form: {},
      query: {},
      loading: true,
      pageRequest: {
        pageNum: 1,
        pageSize: 10,
        content: "",
        inUse: "",
      },
      selectionList: [],
      option: {
        height: 'auto',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        column: [
          {
            label: "ID",
            prop: "clientId",
            search: true,
            rules: [{
              required: true,
              message: "请输入客户端id",
              trigger: "blur"
            }]
          },
          {
            label: "密钥",
            prop: "clientSecret",
            search: true,
            rules: [{
              required: true,
              message: "请输入客户端密钥",
              trigger: "blur"
            }]
          },
          {
            label: "名称",
            prop: "name",
            width: 150,
            rules: [{
              required: true,
              message: "请输入授权名称",
              trigger: "blur"
            }]
          },
          {
            label: "启用",
            prop: "inUse",
            sortable: true,
            width: 70,
            align: "center",
            type: "radio",
            dicData: [{
              label: '是',
              value: true
            }, {
              label: '否',
              value: false
            }],
            rules: [{
              required: true,
              message: "请选择是否启用客户端",
              trigger: "blur"
            }]
          },
          {
            label: "注册",
            prop: "register",
            sortable: true,
            width: 70,
            align: "center",
            type: "radio",
            dicData: [{
              label: '是',
              value: true
            }, {
              label: '否',
              value: false
            }],
            rules: [{
              required: true,
              message: "请选择是否开启注册",
              trigger: "blur"
            }]
          },
          {
            label: "Captcha",
            prop: "captcha",
            sortable: true,
            width: 95,
            align: "center",
            type: "radio",
            dicData: [{
              label: '是',
              value: true
            }, {
              label: '否',
              value: false
            }],
            rules: [{
              required: true,
              message: "请选择是否开启图形验证码",
              trigger: "blur"
            }]
          },
          {
            label: "用户初态",
            prop: "userStatus",
            sortable: true,
            width: 105,
            align: "center",
            type: "radio",
            dicData: [{
              label: '正常',
              value: 0
            }, {
              label: '审核',
              value: 1
            }, {
              label: '冻结',
              value: 2
            }, {
              label: '注销',
              value: -1
            }],
            rules: [{
              required: true,
              message: "请选择是否开启图形验证码",
              trigger: "blur"
            }]
          },
          {
            label: "令牌秒数",
            prop: "tokenExpire",
            type: "number",
            valueDefault: 3600,
            rules: [{
              required: true,
              message: "请输入令牌过期秒数",
              trigger: "blur"
            }]
          },
          {
            label: "回调地址",
            prop: "redirectUri",
          },
          {
            label: "备注",
            prop: "description",
            width: 180,
            span: 24,
          },
          {
            label: "创建时间",
            prop: "createAt",
            editDisabled: true,
            addDisabled: true,
            sortable: true,
            width: 130,
            align: "center",
          },
          {
            label: "更新时间",
            prop: "updateAt",
            editDisabled: true,
            addDisabled: true,
            sortable: true,
            width: 130,
            align: "center",
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.client_add),
        viewBtn: this.vaildData(this.permission.client_view),
        delBtn: this.vaildData(this.permission.client_delete),
        editBtn: this.vaildData(this.permission.client_edit)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    async onLoad(page, params = {}) {
      this.loading = true;
      await this.pageOauthClientInfo();
      this.loading = false;
    },
    pageOauthClientInfo() {
      pageOauthClientInfo(this.pageRequest).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data;
        }
      })
    },
    rowSave(row, done, loading) {
      add(row).then(() => {
        done();
        this.onLoad(this.pageRequest);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(() => {
        done();
        this.onLoad(this.pageRequest);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.pageRequest);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.pageRequest);
    },
    searchChange(params, done) {
      this.query = params;
      this.pageRequest.currentPage = 1;
      this.onLoad(this.pageRequest, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.pageRequest);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      }
      done();
    },
    currentChange(currentPage) {
      this.pageRequest.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.pageRequest.pageSize = pageSize;
    },
  }
};
</script>

<style>
</style>
