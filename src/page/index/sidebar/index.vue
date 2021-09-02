<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height:100%">
      <div v-if="validatenull(menu)"
           class="avue-sidebar--tip">{{ $t('menuTip') }}
      </div>
      <el-menu :collapse="keyCollapse"
               :default-active="nowTagValue"
               :show-timeout="200"
               mode="vertical"
               unique-opened>
        <sidebar-item :collapse="keyCollapse"
                      :menu="menu"
                      :props="website.menu.props"
                      :screen="screen"
                      first></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";

export default {
  name: "sidebar",
  components: {sidebarItem, logo},
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("GetRoute").then(data => {
      if (data.length === 0) return;
      this.$router.$avueRouter.formatRoutes(data, true);
    });
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen"]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted() {
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
</style>

