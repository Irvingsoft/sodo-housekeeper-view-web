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
    getSignaturePublicKey() {
      getSignaturePublicKey().then(res => {
        this.publicKey = res.data.data;
        if (res.data.code === 200) {
          this.insertSignatureKey();
        }
      })
    },
    insertSignatureKey() {
      this.publicKey.signatureKey = uuid();
      this.$store.dispatch("InsertSignatureKey", this.publicKey);
    },
    validateSignatureKey() {
      validateSignaturePublicKey().then(res => {
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
