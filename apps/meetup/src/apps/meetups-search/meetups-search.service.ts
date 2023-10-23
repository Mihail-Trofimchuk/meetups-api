import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MeetupsSearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  async createIndex() {
    const checkIndex = await this.esService.indices.exists({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
    });

    if (!checkIndex) {
      this.esService.indices
        .create({
          index: this.configService.get('ELASTICSEARCH_INDEX'),
          body: {
            mappings: {
              properties: {
                id: { type: 'integer' },
                title: { type: 'text' },
                description: {
                  type: 'text',
                  analyzer: 'case_insensitive_analyzer',
                },
              },
            },
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  async indexMeetup(meetup: any) {
    return await this.esService.index({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: meetup,
    });
  }

  async search(text: string) {
    const { body } = await this.esService.search<any>({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'description'],
          },
        },
      },
    });

    const hits = body.hits.hits;
    return hits.map((hit: any) => hit._source);
  }

  async removeIndex(meetupId: number) {
    this.esService.deleteByQuery({
      index: this.configService.get('ELASTICSEARCH_INDEX')!,
      body: {
        query: {
          match: {
            id: meetupId,
          },
        },
      },
    });
  }
}
