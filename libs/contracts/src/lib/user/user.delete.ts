import { IsNumber } from 'class-validator';

export namespace UserDelete {
  export const Topic = 'user.delete.command';

  export class Request {
    @IsNumber()
    id: number;
  }

  export class Response {
    id: number;
    email: string;
    displayName?: string;
  }
}
