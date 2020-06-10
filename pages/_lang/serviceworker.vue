<template>
  <div>
    <HubHeader :showSubHeader="true"></HubHeader>

    <main id="sideBySide">
      <section id="leftSide">
        <header class="mastHead">
          <h2>{{ $t("serviceworker.title") }}</h2>
          <p>{{ $t("serviceworker.summary") }}</p>
        </header>

        <div id="push-notification-section">
          <button
            id="push-notifications-button"
            @click="modalOpened"
          >Add support for push notifications</button>
        </div>

        <div id="inputSection">
          <form @submit.prevent="download" @keydown.enter.prevent="download">
            <div
              id="inputContainer"
              v-for="sw in serviceworkers"
              :key="sw.title"
              @click="selectServiceWorker(sw.id)"
              v-bind:class="{ active: serviceworker$ === sw.id }"
            >
              <label class="l-generator-label" :for="sw.id">
                <div id="inputDiv">
                  <!--<input
                    type="radio"
                    :value="sw.id"
                    v-model="serviceworker$"
                    :disabled="sw.disable"
                    :id="sw.id"
                  >-->

                  <div id="titleBox">
                    <h4>{{ sw.title }}</h4>

                    <!--<i v-pre v-if="serviceworker$ === sw.id" class="fas fa-check"></i>-->
                  </div>

                  <span v-if="sw.disable">(coming soon)</span>
                </div>
              </label>
              <div class="swDesc">{{ sw.description }}</div>
            </div>
            <div class="pure-u-3-5">
              <p class="l-generator-error" v-if="error">
                <span class="icon-exclamation"></span>
                {{ $t(error) }}
              </p>
            </div>
          </form>
        </div>

        <div id="doneDiv">
          <button @click="download()" id="downloadSWButton">
            <span v-if="!isBuilding">{{ $t('serviceworker.download') }}</span>
            <span v-if="isBuilding">
              <Loading :active="true" class="u-display-inline_block u-margin-left-sm" />
            </span>
          </button>
        </div>
      </section>

      <section id="rightSide" class="swRightSide">
        <CodeViewer
          v-if="codeViewerLoadingDelayBottom"
          class="bottomViewer"
          color="#F0F0F0"
          theme="darker"
          code-type="javascript"
          :size="bottomViewerSize"
          :code="serviceworkerPreview"
          :title="$t('serviceworker.code_preview_serviceworker')"
          :showToolbar="false"
          :showHeader="true"
          monaco-id="bottomViewerId"
        >
          <h3>Add this code to a file named "pwabuilder-sw.js" on your site root:</h3>
        </CodeViewer>

        <CodeViewer
          v-if="codeViewerLoadingDelayTop"
          class="topViewer"
          color="#F0F0F0"
          theme="lighter"
          code-type="javascript"
          :size="viewerSize"
          :code="webPreview"
          :title="$t('serviceworker.code_preview_web')"
          :showToolbar="false"
          :showHeader="true"
          monaco-id="topViewerId"
        >
          <h3>Add this code to your landing page in a &lt;script&gt; tag:</h3>
        </CodeViewer>
      </section>
    </main>

    <footer>
      <p>
        PWA Builder was founded by Microsoft as a community guided, open source project to help move PWA adoption forward.
        <a
          href="https://privacy.microsoft.com/en-us/privacystatement"
        >Our Privacy Statement</a>
      </p>
    </footer>
    <div id="modal-background" class="has-acrylic-40 is-dark" v-show="modalOpen">
      <button id="modal-close-button" @click="modalClosed">
        <i class="fas fa-times"></i>
      </button>
      <div id="modal">
        <header class="modal-header">
          <h2>Setup Push Notifications</h2>
        </header>
        <section class="modal-content">
          <p>Is this a new or existing setup?</p>
          <div class="inputContainer">
            <label class="l-generator-label">
              <div id="inputDiv">
                <div id="titleBox">
                  <h4>Create a new Setup</h4>
                </div>
              </div>
            </label>
            <div
              class="swDesc"
            >Why? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tristique maximus fringilla...</div>
          </div>
          <div class="inputContainer">
            <label class="l-generator-label">
              <div id="inputDiv">
                <div id="titleBox">
                  <h4>Test Push Notifications</h4>
                </div>
              </div>
            </label>
            <div
              class="swDesc"
            >Quisque molestie ornare auctor. Sed congue accumsan erat, quis fringilla nunc posuere id.</div>
          </div>
        </section>
        <footer class="modal-footer">
          <button id="modal-cancel" @click="modalClosed">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "nuxt-class-component";
import { Watch } from "vue-property-decorator";
import { Action, State, namespace } from "vuex-class";

import GeneratorMenu from "~/components/GeneratorMenu.vue";
import Loading from "~/components/Loading.vue";
import CodeViewer from "~/components/CodeViewer.vue";
import StartOver from "~/components/StartOver.vue";
import Modal from "~/components/Modal.vue";
import HubHeader from "~/components/HubHeader.vue";

import * as serviceworker from "~/store/modules/serviceworker";
import { ServiceWorker } from "~/store/modules/serviceworker";

const ServiceworkerState = namespace(serviceworker.name, State);
const ServiceworkerAction = namespace(serviceworker.name, Action);

@Component({
  components: {
    GeneratorMenu,
    Loading,
    StartOver,
    CodeViewer,
    Modal,
    HubHeader
  }
})
export default class extends Vue {
  public isBuilding = false;
  public serviceworker$: number = 0;
  public serviceworkers$: ServiceWorker[];
  public error: string | null = null;
  public viewerSize = "10rem";
  public bottomViewerSize = "10rem";
  public hasSW = false;
  public betterSW = false;
  public codeViewerLoadingDelayTop = false;
  public codeViewerLoadingDelayBottom = false;
  public modalOpen = false;

  @ServiceworkerState serviceworkers: ServiceWorker[];
  @ServiceworkerState serviceworker: number;
  @ServiceworkerState serviceworkerPreview: string;
  @ServiceworkerState webPreview: string;
  @ServiceworkerState archive: string;

  @ServiceworkerAction downloadServiceWorker;
  @ServiceworkerAction getCode;
  @ServiceworkerAction getServiceworkers;

  async created() {
    await this.getServiceworkers();
    this.serviceworker$ = this.serviceworkers[0].id;
    await this.getCode(this.serviceworker$);
  }

  mounted() {
    setTimeout(() => {
      this.codeViewerLoadingDelayTop = true;
    }, 300);

    setTimeout(() => {
      this.codeViewerLoadingDelayBottom = true;
    }, 600);

    const overrideValues = {
      uri: window.location.href,
      pageName: "serviceWorkerPage",
      pageHeight: window.innerHeight
    };

    this.$awa(overrideValues);
  }

  public selectServiceWorker(id: number) {
    this.serviceworker$ = id;

    const overrideValues = {
      uri: window.location.href,
      pageName: `serviceWorker${id}`,
      pageHeight: window.innerHeight
    };

    this.$awa(overrideValues);
  }

  async destroyed() {
    (this.$root.$el.closest("body") as HTMLBodyElement).classList.remove(
      "modal-screen"
    );
  }

  public onClickShowGBB(): void {
    (this.$refs.nextStepModal as Modal).show();
    this.analyze();
  }

  public onClickHideGBB(): void {
    (this.$refs.nextStepModal as Modal).hide();
  }

  public async download(): Promise<void> {
    this.isBuilding = true;
    try {
      if (this.serviceworker$) {
        const cleanedSW = this.serviceworker$.toString();
        await this.downloadServiceWorker(cleanedSW);

        const overrideValues = {
          uri: window.location.href,
          pageName: `serviceWorkerDownloaded${this.serviceworker$}`,
          pageHeight: window.innerHeight
        };

        this.$awa(overrideValues);
      }
    } catch (e) {
      console.error(e);
      this.error = e;
    }

    if (this.archive) {
      window.location.href = this.archive;
    } else {
      console.error("no archive");
    }

    this.isBuilding = false;
  }

  public analyze(): void {
    if (this.serviceworker$ && this.serviceworker$ >= 4) {
      this.betterSW = true;
    } else if (this.serviceworker$ && this.serviceworker$ < 4) {
      // default to true for now
      this.hasSW = true;
    }
  }

  @Watch("serviceworker$")
  async onServiceworker$Changed(): Promise<void> {
    try {
      await this.getCode(this.serviceworker$);

      this.analyze();
    } catch (e) {
      this.error = e;
    }
  }

  public modalOpened() {
    (this.$root.$el.closest("body") as HTMLBodyElement).classList.add(
      "modal-screen"
    );
    this.modalOpen = true;
  }

  public modalClosed() {
    (this.$root.$el.closest("body") as HTMLBodyElement).classList.remove(
      "modal-screen"
    );
    this.modalOpen = false;
  }
}

declare var awa: any;

Vue.prototype.$awa = function(config) {
  if (awa) {
    awa.ct.capturePageView(config);
  }

  return;
};
</script>

<style lang="scss" scoped>
/* stylelint-disable */

@import "~assets/scss/base/variables";

footer {
  display: flex;
  justify-content: center;
  padding-left: 15%;
  padding-right: 15%;
  font-size: 12px;
  color: rgba(60, 60, 60, 0.5);
  background: white;
}

footer p {
  text-align: center;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: #707070;
}

footer a {
  color: #707070;
  text-decoration: underline;
}

#sideBySide {
  display: flex;
  justify-content: space-between;
  height: 100%;
  padding-right: 3%;
  padding-left: 3%;
  background: white;

  #leftSide {
    background: white;

    .mastHead {
      padding-top: 40px;

      h2 {
        font-family: sans-serif;
        font-style: normal;
        font-weight: 600;
        font-size: 24px;
        line-height: 54px;
        letter-spacing: -0.02em;
      }

      p {
        margin-top: 16px;
        font-size: 16px;
        line-height: 28px;
      }
    }

    #inputSection {
      .active {
        background: #f0f0f0;

        h4 {
          color: #9337d8;
        }
      }
    }

    @media (max-width: 425px) {
      #inputSection {
        margin-left: initial;
      }
    }

    #downloadSWButton {
      background: #3c3c3c;
      width: 128px;
      height: 44px;
      border-radius: 20px;
      border: none;
      font-family: sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      margin-top: 30px;
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }

    #doneDiv {
      display: flex;
      justify-content: center;
    }
  }

  #rightSide {
    display: flex;
    flex-direction: column;
    padding-top: 2px;
    background: white;

    .topViewer {
      margin-top: 40px;
    }

    .bottomViewer {
      margin-top: 20px;
    }

    #topTitle {
      background: #f0f0f0;
      font-weight: bold;
      padding: 1em;
      margin-left: 0px;
    }

    #bottomTitle {
      background: #e2e2e2;
      font-weight: bold;
      padding: 1em;
      margin-left: 0px;
      margin-top: -24em;
      z-index: 99;
    }

    .code_viewer {
      background: #f0f0f0;
    }
  }
}

#rightSide {
  width: 55%;
  max-height: 80%;
}
#leftSide {
  width: 40%;
}

#inputContainer,
.inputContainer {
  cursor: pointer;
  border-radius: 4px;
  padding-top: 24px;
  padding-bottom: 24px;
  padding-left: 28px;
  padding-right: 28px;

  .swDesc {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 21px;
  }

  #inputDiv {
    display: flex;
    align-items: unset;

    input {
      height: 1.2em;
      flex: 1;
    }

    #titleBox {
      display: flex;
      justify-content: space-between;
    }

    #titleBox svg {
      height: 24px;
      margin-left: 10px;
      font-size: 16px;
      color: #9337d8;
    }

    h4 {
      flex: 22;
      margin-bottom: 10px;

      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 24px;
    }
  }
}

@media (max-width: 1180px) {
  #rightSide {
    display: none !important;
  }
  #leftSide {
    width: 100%;
  }

  #sideBySide {
    flex-direction: column;
    padding-left: 31px !important;
    padding-right: 24px !important;
  }

  #sideBySide #leftSide {
    width: initial;
  }

  #sideBySide #leftSide #inputSection #inputContainer {
    padding-left: 14px;
    padding-right: 14px;
  }
}

#push-notification-section {
  height: 40px;

  #push-notifications-button {
    color: #9337d8;
    height: 24px;
    line-height: 1.2;
    font-size: 16px;
    font-weight: bold;
    border: none;
    background-color: transparent;
  }
}

#modal-background {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: space-around;
  z-index: 97999;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;

  #modal-close-button {
    position: absolute;
    z-index: 99999;
    top: 10px;
    right: 10px;
    height: 32px;
    width: 32px;
    border: none;
    float: right;
    background: #3c3c3c;
    color: #fff;
    border-radius: 50%;
    margin-top: 10px;
    margin-right: 10px;
    font-size: 14px;
  }

  #modal {
    font-family: "Poppins", "Segoe UI", Arial, Helvetica, sans-serif;
    position: fixed;
    z-index: 98999;

    max-width: 600px;
    max-height: 400px;
    height: 80%;
    width: 80%;
    background-color: #fff;

    padding: 24px 24px;
    border-radius: 12px;
    font-size: 14px;

    .modal-header {
      h2 {
        font-size: 24px;
      }
    }
    .modal-content {
    }
    .modal-footer {
      display: flex;
      text-align: center;
    }

    #modal-cancel {
      color: #3c3c3c;
      border: none;
      background: transparent;
      opacity: 0.55;

      align-items: center;
      text-align: center;

      font-size: 16px;
      line-height: 21px;

      &:hover,
      &:focus {
        opacity: 1;
        color: #9337d8;
      }
    }

    @media (max-width: 460px) {
      height: 100%;
      width: 100%;
      border-radius: 0;
    }
  }
}
</style>