<template>
  <main id="pushMain">
    <HubHeader></HubHeader>

    <div id="pushContentContainer">
      <pwab-push :url="pushUrl"></pwab-push>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "nuxt-class-component";
import HubHeader from "~/components/HubHeader.vue";
import { pushUrl as url } from "~/store/modules/serviceworker/push";

@Component({
  components: {
    HubHeader
  }
})
export default class extends Vue {
  pushUrl = url;
}
</script>

<style scoped>
#pushMain {
  background: white;
}

#pushContentContainer {
  padding-left: 3%;
  padding-right: 3%;
}

@media (max-width: 430px) {
  #pushContentContainer {
    padding-left: 28px;
    padding-right: 28px;
  }
}
</style>
