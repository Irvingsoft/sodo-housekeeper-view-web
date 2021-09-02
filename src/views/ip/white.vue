<template>
  <basic-container>
    <el-tabs v-model="oauthIpRequest.clientId" @tab-click="handleSwitch">
      <el-tab-pane v-for="client in clientList" :name="client.clientId" class="tab-pane">
        <template #label>
          <el-tooltip class="item" effect="dark" :content="client.description" placement="top">
            <span>{{ client.name }}</span>
          </el-tooltip>
        </template>
        <el-form :inline="true" label-width="60px">
          <el-row>
            <el-col :xs="24" :sm="12" :md="5">
              <el-form-item label="关键字">
                <el-input v-model="oauthIpRequest.content" placeholder="请输入关键字" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="5">
              <el-form-item>
                <el-button type="primary" @click="searchChange">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <avue-crud :option="option"
                   :table-loading="loading"
                   :data="data.records"
                   :page="data"
                   :ref="client.clientId"
                   v-model="form"
                   :permission="permissionList"
                   @row-del="rowDel"
                   @row-update="rowUpdate"
                   @row-save="rowSave"
                   @selection-change="selectionChange"
                   @refresh-change="onLoad">
          <template slot="menuLeft">
            <el-button type="danger"
                       size="small"
                       icon="el-icon-delete"
                       v-if="permission.role_delete"
                       plain
                       @click="handleDelete">删 除
            </el-button>
          </template>
        </avue-crud>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import {listOauthClientBaseUse} from "@/api/system/client";
import {
  deleteOauthIp,
  deleteOauthIpList,
  getOauthIpInfo,
  insertOauthIp,
  pageOauthIpInfo,
  updateOauthIp
} from "@/api/ip/ip";

export default {
  data() {
    return {
      form: {},
      loading: true,
      selectionList: [],
      oauthIpRequest: {
        clientId: "",
        content: "",
        valid: true,
        pageNum: 1,
        pageSize: 10
      },
      option: {
        tip: false,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        addBtn: true,
        menuWidth: 300,
        column: [
          {
            label: "IP",
            prop: "ip",
            width: 180,
            rules: [
              {
                required: true,
                message: "请输入角色名称",
                trigger: "blur"
              }
            ]
          },
          {
            label: "放行次数",
            prop: "validNum",
            addDisplay: false,
            editDisplay: false,
            width: 150,
          },
          {
            label: "描述",
            prop: "description",
            width: 180,
            span: 24
          },
          {
            label: "创建时间",
            prop: "createAt",
            editDisplay: false,
            addDisplay: false,
            sortable: true,
            width: 130,
            align: "center",
          },
          {
            label: "更新时间",
            prop: "updateAt",
            editDisplay: false,
            addDisplay: false,
            sortable: true,
            width: 130,
            align: "center",
          },
        ]
      },
      data: [],
      clientList: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.role_add, false),
        viewBtn: this.vaildData(this.permission.role_view, false),
        delBtn: this.vaildData(this.permission.role_delete, false),
        editBtn: this.vaildData(this.permission.role_edit, false)
      };
    },
    selectionIpIdList() {
      let ipIdList = [];
      this.selectionList.forEach(oauthIp => ipIdList.push(oauthIp.ipId));
      return ipIdList;
    },
  },
  created() {
    this.listOauthClientBaseUse();
  },
  methods: {
    onLoad() {
      this.loading = true;
      pageOauthIpInfo(this.oauthIpRequest).then(res => {
        this.data = res.data.data;
        this.loading = false;
      })
      console.log(this.data);
    },
    listOauthClientBaseUse() {
      listOauthClientBaseUse().then(res => {
        this.clientList = res.data.data;
        this.oauthIpRequest.clientId = this.clientList[0].clientId
        this.onLoad();
      })
    },
    handleSwitch(tab, event) {
      this.oauthIpRequest.clientId = tab.name;
      this.oauthIpRequest.content = "";
      this.onLoad();
    },
    rowSave(row, done, loading) {
      row.clientId = this.oauthIpRequest.clientId;
      row.valid = true;
      insertOauthIp(row).then(() => {
        done();
        this.onLoad();
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
      updateOauthIp(row).then(() => {
        done();
        this.onLoad();
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
          return deleteOauthIp(row.ipId);
        })
        .then(() => {
          this.onLoad();
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    searchChange() {
      this.onLoad();
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
      }).then(() => {
        return deleteOauthIpList(this.selectionIpIdList);
      }).then(() => {
        this.onLoad();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.$refs[this.oauthIpRequest.clientId][0].toggleSelection();
      }).catch(() => {
        this.$refs[this.oauthIpRequest.clientId][0].toggleSelection();
      });
    },
  }
};
</script>

<style>
.tab-pane {
  padding-top: 20px;
}
</style>
