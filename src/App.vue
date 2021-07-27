<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import {getSignaturePublicKey, validateSignaturePublicKey} from "@/api/auth";
import {uuid} from "@/util/util";

export default {
  name: "app",
  data() {
    return {
      publicKey: {
        id: "",
        content: "",
        signatureKey: "",
      },
    };
  },
  watch: {},
  created() {
    this.validateSignatureKey();
  },
  methods: {
    async getSignaturePublicKey() {
      if (!this.validate) {
        await getSignaturePublicKey().then(res => {
          this.publicKey = res.data.data;
          if (res.data.code === 200) {
            this.insertSignatureKey();
          }
        })
      }
    },
    async insertSignatureKey() {
      this.publicKey.signatureKey = uuid();
      await this.$store.dispatch("InsertSignatureKey", this.publicKey)
    },
    async validateSignatureKey() {
      await validateSignaturePublicKey().then(res => {
        if (res.data.code === 200) {
          if (!res.data.data) {
            this.getSignaturePublicKey();
          }
        }
      })
    }
  },
  computed: {}
};
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
