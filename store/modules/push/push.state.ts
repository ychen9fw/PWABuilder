export interface ServiceWorker {}

export interface State {
  email: string | null;
  publicKey: string | null;
  title: string | null;
  notification: string | null;
  iconUrl: string | null;
}

export const state = (): State => ({
  email: null,
  publicKey: null,
  title: null,
  notification: null,
  iconUrl: null,
});
