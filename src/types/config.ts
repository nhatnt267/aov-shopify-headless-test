export interface CartConfig {
  storeDomain: string;
  accessToken: string;
  apiVersion?: string;
  onError?: (error: Error) => void;
}

export interface CartClientOptions {
  config: CartConfig;
}
