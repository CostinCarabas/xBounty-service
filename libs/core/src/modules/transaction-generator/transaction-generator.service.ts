import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';
// import { XBounty } from './xBounty';

@Injectable()
export class TransactionGeneratorService {
  // private readonly xBountyContractService: XBounty;
  private readonly scAddress: string;
  constructor() {
    // this.xBountyContractService = new XBounty();
  }

  async execute(amount: string, issueId: number, repoUrl: string) {
    const repoUrlHex = Buffer.from(repoUrl, 'utf8').toString('hex');
    const issueIdHex = issueId.toString(16);
    const bip21String = `elrond:${this.scAddress}?amount=${parseFloat(amount)}&gasLimit=4000000&message=fund@${repoUrlHex}@${issueIdHex}`;
    const qrCode = await this.generateQRCodeFromBIP21(bip21String);
    return qrCode;
  }

  async generateQRCodeFromBIP21(bip21String: string): Promise<string | undefined> {
    try {
      const qrDataURL = await QRCode.toDataURL(bip21String);
      console.log('QR Code Data URL:', qrDataURL);
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code', error);
      return undefined;
    }
  }
}
