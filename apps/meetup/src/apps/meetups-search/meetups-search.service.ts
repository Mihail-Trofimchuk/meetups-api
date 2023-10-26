import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { MeetupSearch } from '@app/contracts';
import { DOCUMENT_NOT_FOUND, SUCCESS_UPLOAD } from './meetup-search.constants';

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
                tags: {
                  type: Object,
                  properties: {
                    id: { type: 'integer' },
                    name: { type: 'text' },
                  },
                },
                meetingTime: { type: 'date' },
                latitude: { type: 'float' },
                longitude: { type: 'float' },
                createdById: { type: 'integer' },
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
    return await this.esService
      .index({
        index: this.configService.get('ELASTICSEARCH_INDEX'),
        body: meetup,
      })
      .then(
        function (resp) {
          console.log(SUCCESS_UPLOAD, resp);
        },
        function (err) {
          console.trace(err.message);
        },
      );
  }

  async updateIndexMeetup(meetup: MeetupSearch.Response) {
    const { body } = await this.esService.search({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: {
          match: { id: meetup.id },
        },
      },
    });
    if (body.hits.hits.length > 0) {
      const docId = body.hits.hits[0]._id;

      return await this.esService.update({
        index: this.configService.get('ELASTICSEARCH_INDEX'),
        id: docId,
        body: {
          doc: meetup,
        },
      });
    } else {
      console.log(DOCUMENT_NOT_FOUND);
    }
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
