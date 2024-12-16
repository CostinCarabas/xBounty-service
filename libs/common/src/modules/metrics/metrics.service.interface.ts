export interface MetricsServiceInterface {
  getMetrics(): Promise<string>;
}
