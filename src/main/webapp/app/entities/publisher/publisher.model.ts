export interface IPublisher {
  id?: number;
  name?: string;
}

export class Publisher implements IPublisher {
  constructor(public id?: number, public name?: string) {}
}

export function getPublisherIdentifier(publisher: IPublisher): number | undefined {
  return publisher.id;
}
