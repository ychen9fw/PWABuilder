export const pushUrl = `${process.env.apiUrl}/push`;

export interface State {
  email: string | null;
  privateKey: string | null;
  publicKey: string | null;
  title: string | null;
  notification: string | null;
  iconUrl: string | null;
}
