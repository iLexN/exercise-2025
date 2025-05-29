import { Vertupay } from '../entities/vertupay.entity';

export class VertupayPayUpdatedEvent {
  constructor(public readonly pay: Vertupay) {}
}
