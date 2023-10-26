export namespace TagCreate {
  export const Topic = 'tag.create.command';

  export class Request {
    name: string;
  }

  export class Response {
    id: number;

    name: string;
  }
}
