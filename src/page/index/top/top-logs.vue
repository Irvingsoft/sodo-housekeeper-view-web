<template>
  <span @click="logsFlag?'':handleOpen()">
    <el-badge :max="99"
              :value="logsFlag?'':logsLen">
      <i class="icon-rizhi1"></i>
    </el-badge>
    <el-dialog :visible.sync="box"
               append-to-body
               fullscreen
               title="日志"
               width="100%">
      <logs></logs>
    </el-dialog>
  </span>
</template>

<script>
import {mapGetters} from "vuex";
import logs from "@/page/logs/index";

export default {
  name: "top-logs",
  components: {logs},
  data() {
    return {
      box: false
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["logsFlag", "logsLen"])
  },
  props: [],
  methods: {
    handleOpen() {
      this.box = true;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
