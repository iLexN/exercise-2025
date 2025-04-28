export class VertupayAccountDto {
  constructor(
    public readonly merchantId: string,
    public readonly passKey: string,
  ) {}

  getSignatureString(): string {
    return `${this.merchantId}${this.passKey}`;
  }
}
