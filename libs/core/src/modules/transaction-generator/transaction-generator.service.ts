import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';
import { TransactionGeneratorModuleOptions } from './options';

@Injectable()
export class TransactionGeneratorService {
  private readonly SKIP_QR_CODE_GENERATION = true;

  constructor(
    private readonly options: TransactionGeneratorModuleOptions,
  ) { }

  async executeRegisterTx(
    githubUser: string,
    repoOwner: string,
    repo: string,
    issueNumber: number,
  ): Promise<string | undefined> {
    if (this.SKIP_QR_CODE_GENERATION) {
      return this.generateRegisterTxWebWalletString(githubUser, repoOwner, repo, issueNumber);
    }
    const bip21String = this.generateBip21StringRegisterTx(githubUser, repoOwner, repo, issueNumber);

    const qrCode = await this.generateQRCodeFromBIP21(bip21String);
    if (qrCode == null) {
      return;
    }
    return this.buildMdImage(qrCode);
  }

  async executeFundTx(
    amount: string,
    repoOwner: string,
    repo: string,
    issueNumber: number,
  ): Promise<string | undefined> {
    if (this.SKIP_QR_CODE_GENERATION) {
      return this.generateWebWalletStringFundTx(amount, repoOwner, repo, issueNumber);
    }
    const bip21String = this.generateBip21StringFundTx(amount, repoOwner, repo, issueNumber);

    const qrCode = await this.generateQRCodeFromBIP21(bip21String);
    if (qrCode == null) {
      return;
    }
    return this.buildMdImage(qrCode);
  }

  private generateBip21StringFundTx(
    amount: string,
    repoOwner: string,
    repo: string,
    issueNumber: number,
  ): string {
    const data = this.generateDataFundTx(repoOwner, repo, issueNumber);

    return `elrond:${this.options.contract}?amount=${parseFloat(amount)}&gasLimit=4000000&` +
      `message=${data}`;
  }

  private generateBip21StringRegisterTx(
    githubUser: string,
    repoOwner: string,
    repo: string,
    issueNumber: number,
  ): string {
    const data = this.generateDataRegisterTx(githubUser, repoOwner, repo, issueNumber);

    return `elrond:${this.options.contract}?amount=0&gasLimit=4000000&message=${data}`;
  }

  private generateRegisterTxWebWalletString(
    githubUser: string,
    repoOwner: string,
    repo: string,
    issueNumber: number,
  ): string {
    const data = this.generateDataRegisterTx(githubUser, repoOwner, repo, issueNumber);

    return `${this.options.walletUrl}/hook/transaction?receiver=${this.options.contract}&value=0` +
      `&gasLimit=250000000&data=${data}&callbackUrl=https://github.com/${repoOwner}/${repo}/issues/${issueNumber}`;
  }

  private generateWebWalletStringFundTx(
    amount: string,
    repoOwner: string,
    repo: string,
    issueNumber: number,
  ): string {
    const data = this.generateDataFundTx(repoOwner, repo, issueNumber);

    return `${this.options.walletUrl}/hook/transaction?receiver=${this.options.contract}&value=${amount}` +
      `&gasLimit=250000000&data=${data}&callbackUrl=https://github.com/${repoOwner}/${repo}/issues/${issueNumber}`;
  }

  private generateDataFundTx(repoOwner: string, repo: string, issueNumber: number): string {
    const repoOwnerHex = Buffer.from(repoOwner, 'utf8').toString('hex');
    const repoHex = Buffer.from(repo, 'utf8').toString('hex');
    const issueNumberHex = this.padHex(issueNumber.toString(16));

    return `fund@${repoOwnerHex}@${repoHex}@${issueNumberHex}`;
  }

  private generateDataRegisterTx(
    githubUser: string,
    repoOwner: string,
    repo: string,
    issueNumber: number,
  ): string {
    const repoOwnerHex = Buffer.from(repoOwner, 'utf8').toString('hex');
    const repoHex = Buffer.from(repo, 'utf8').toString('hex');
    const issueNumberHex = this.padHex(issueNumber.toString(16));

    return `register@${repoOwnerHex}@${repoHex}@${issueNumberHex}@${githubUser}`;
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

  private padHex(value: string): string {
    return (value.length % 2 ? '0' + value : value);
  }
}
