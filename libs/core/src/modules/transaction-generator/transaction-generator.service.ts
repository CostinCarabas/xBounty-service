import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';
import { TransactionGeneratorModuleOptions } from './options';
// import { XBounty } from './xBounty';

@Injectable()
export class TransactionGeneratorService {
  private readonly SKIP_QR_CODE_GENERATION = true;

  constructor(
    private readonly options: TransactionGeneratorModuleOptions,
  ) { }

  async execute(amount: string, repo: string, issueNumber: number): Promise<string | undefined> {
    const repoUrlHex = Buffer.from(repo, 'utf8').toString('hex');
    const issueIdHex = issueNumber.toString(16);
    const bip21String = `elrond:${this.options.contract}?amount=${parseFloat(amount)}&gasLimit=4000000&` +
      `message=fund@${repoUrlHex}@${issueIdHex}`;
    if (this.SKIP_QR_CODE_GENERATION) {
      return bip21String;
    }

    const qrCode = await this.generateQRCodeFromBIP21(bip21String);
    if (qrCode == null) {
      return;
    }
    return this.buildMdImage(qrCode);
  }

  private async generateQRCodeFromBIP21(bip21String: string): Promise<string | undefined> {
    try {
      const qrDataURL = await QRCode.toDataURL(bip21String);
      console.log('QR Code Data URL:', qrDataURL);
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code', error);
      return undefined;
    }
  }

  private buildMdImage(base64QrCode: string): string {
    return `\n![image](${base64QrCode})`;
  }
}
