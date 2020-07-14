<template>
  <main id="pushMain">
    <HubHeader></HubHeader>

    <div id="testContentContainer">
      <div id="testHeaderBlock">
        <h1>Test push notifications</h1>
        <p>Send a test notification</p>
      </div>

      <div id="testFormBlock">
        <div class="testInputLabel">
          <label for="emailInput">Email:</label>

          <input
            type="email"
            id="emailInput"
            name="emailInput"
            placeholder="janedoe@something.com"
            aria-label="push registered email"
            v-model.trim="pushState.email"
          />
        </div>

        <div class="testInputLabel">
          <label for="privateKeyInput">Private Key:</label>

          <input
            type="text"
            id="privateKeyInput"
            name="privatekeyinput"
            aria-label="push registered private key"
            placeholder="vld88IhWi_NFrkB0s8jKNdl5Y-YyzF7oQKgNM6CIDpM"
            v-model.trim="pushState.privateKey"
          />
        </div>

        <div class="testInputLabel">
          <label for="publicKeyInput">Public Key:</label>

          <input
            type="text"
            id="publicKeyInput"
            name="publickeyInput"
            aria-label="push registered public key"
            placeholder="BMCRD0PP23_mhf7IWI1FLfw219PtjqV63XovTHqYdXgKLaLykCNJ8axD5hz4etTLI9bVfjMPIZUamPg3A5ZvXK4"
            v-model.trim="pushState.publicKey"
          />
        </div>

        <div class="testInputLabel">
          <label for="titleInput">Notification Title:</label>

          <input
            type="text"
            id="titleInput"
            name="titleInput"
            aria-label="title text for push notification"
            placeholder="Test Notification title"
            v-model.trim="pushState.title"
          />
        </div>

        <div class="testInputLabel">
          <label for="bodyInput">Notification Body:</label>

          <input
            type="text"
            id="bodyInput"
            name="bodyInput"
            aria-label="body text for push notification"
            placeholder="Test Notification body"
            v-model.trim="pushState.notification"
          />
        </div>

        <div class="testInputLabel">
          <label for="iconInput">URL to notification icon:</label>

          <input
            type="text"
            id="iconInput"
            name="iconInput"
            aria-label="url for push notification icon"
            placeholder="https://www.siteurl.com/images/image.png"
            v-model.trim="pushState.iconUrl"
          />
        </div>
      </div>

      <div id="testActionBlock">
        <button
          aria-label="send test notification"
          @click="sendTestNotification"
        >Send Test Notification</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import { Action, namespace } from "vuex-class";
import Component from "nuxt-class-component";
import * as push from "~/store/modules/serviceworker/push";
import HubHeader from "~/components/HubHeader.vue";

const PushActions = namespace(push.name, Action);

@Component({
  components: {
    HubHeader
  }
})
export default class extends Vue {
  public pushState: push.State = {
    email: null,
    publicKey: null,
    privateKey: null,
    title: null,
    notification: null,
    iconUrl: null
  };

  @PushActions sendNotification;

  async sendTestNotification() {
    console.log("clicked sendNotification");
    this.sendNotification(this.pushState);
  }
}
</script>

<style lang="scss" scoped>
#pushMain {
  background: white;
  height: 100%;
}

#testContentContainer {
  padding-left: 3%;
  padding-right: 3%;

  margin-top: 46px;
}

#testContentContainer #testHeaderBlock h1 {
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  letter-spacing: -0.02em;
  margin-bottom: 0px;
}

#testContentContainer #testHeaderBlock p {
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 28px;
}

#testFormBlock label {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
}

#testFormBlock input {
  border: none;
  border-bottom: 1px solid rgba(60, 60, 60, 0.3);
  color: #3c3c3c;

  background: transparent;
  padding-bottom: 9px;
  width: 32em;

  &:focus {
    border-color: #9337d8;
    outline: none;
  }
}

#testFormBlock .testInputLabel {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

#testActionBlock {
  width: 32em;
  display: flex;
  justify-content: flex-end;
}

#testActionBlock button {
  background: linear-gradient(90deg, #1fc2c8 0%, #9337d8 169.8%);
  border-radius: 20px;
  border-width: 0;
  color: white;
  padding-top: 9px;
  padding-bottom: 10px;
  padding-left: 16px;
  padding-right: 16px;

  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 21px;
}

@media (max-width: 430px) {
  #testFormBlock input {
    width: 20em;
  }

  #testActionBlock {
    width: initial;
  }
}
</style>
