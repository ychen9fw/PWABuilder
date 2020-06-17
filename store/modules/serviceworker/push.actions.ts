import { ActionTree, ActionContext } from "vuex";
import { State } from "~/store/modules/serviceworker/push";
import { RootState } from "store";

const apiUrl = `${process.env.apiUrl}/push`;

export interface Actions<S, R> extends ActionTree<S, R> {
  sendNotification(context: ActionContext<S, R>): Promise<void>;
}

export const actions: Actions<State, RootState> = {
  async sendNotification({ commit }): Promise<void> {
    return new Promise(async (resolve, reject) => {});
  },
};
