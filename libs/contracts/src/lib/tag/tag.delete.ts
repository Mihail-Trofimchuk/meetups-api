import { TagCreate } from '@app/contracts';

export namespace TagDelete {
  export const Topic = 'tag.delete.command';

  export class Response extends TagCreate.Response {}
}
