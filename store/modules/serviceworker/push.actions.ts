import { ActionTree, ActionContext } from "vuex";
import {
  State,
  PushApiResponseVapid,
} from "~/store/modules/serviceworker/push";
import { RootState } from "store";

const apiUrl = `${process.env.apiUrl}/push`;

export interface Actions<S, R> extends ActionTree<S, R> {
  sendNotification(context: ActionContext<S, R>, state: State): Promise<void>;
}

export const actions: Actions<State, RootState> = {
  async sendNotification(
    context: ActionContext<State, RootState>,
    state: State
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.$axios.$post(`${apiUrl}/send`, {
          data: {
            publicKey: state.publicKey,
            privateKey: "state.", // TODO
            subject: state.email,
            notification: state.notification,
            // can pass, but not implemented in web service
            // title (notification title)
            // icon url
          },
        });

        resolve(response);
      } catch (e) {
        reject("failed to send the notification to the service");
      }
    });
  },
};
