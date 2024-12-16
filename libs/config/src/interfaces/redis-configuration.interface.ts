export interface RedisConfigurationInterface {
  host: string | undefined;
  port: number | undefined;
  username: string | undefined;
  password: string | undefined;
  sentinelUsername: string | undefined;
  sentinelPassword: string | undefined;
  sentinels: Array<{ host: string; port: number }> | undefined;
  name: string | undefined;
  tls: boolean | undefined;
}
