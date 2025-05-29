export class VertupayApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VertupayApiError';
  }
}
