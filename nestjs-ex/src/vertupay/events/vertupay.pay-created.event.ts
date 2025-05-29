import { Vertupay } from '../entities/vertupay.entity';

export class VertupayPayCreatedEvent {
  constructor(public readonly pay: Vertupay) {}
}
