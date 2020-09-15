declare module 'lectra-auth-js' {
  export default class LectraAuth {
    constructor(config: {
      authDomain: string;
      clientId: string;
      baseUrl: string;
      audience: string;
      callbackUrl?: string;
      silentCallbackUrl?: string;
      tokens?: string;
      scopes?: string;
    });
    public userInfo(accessToken: string): Promise<any>;
    public redirectToLogin(): never;
    public checkSSO(): Promise<{ idToken: string; accessToken: string }>;
    public decodeToken(token: string): {};
    public logout(): void;
    public IsSSOActive(): Promise<boolean>;
    // and other methods
  }
}
