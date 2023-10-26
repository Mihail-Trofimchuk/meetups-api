import { TagCreate } from '@app/contracts';

export namespace TagSearch {
  export const Topic = 'tag.search.command';

  export class Response extends TagCreate.Response {}
}
