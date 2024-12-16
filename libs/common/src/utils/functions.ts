export class FunctionsUtils {
  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, Number(ms)));
  }
}
