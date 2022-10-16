import { In, LessThan, Not, Repository } from 'typeorm';
import { Get, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  getWarmupEvents() {
    return this.eventRepository.find();
  }

  /* TODO: complete getEventsWithWorkshops so that it returns all events including the workshops
     Requirements:
    - maximum 2 sql queries
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - Don't post process query result in javascript
    Hints:
    - open the `src/events/events.service` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /events/events:
    ```json
    [
      {
        id: 1,
        name: 'Laravel convention 2021',
        createdAt: '2021-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 1,
            start: '2021-02-21 10:00:00',
            end: '2021-02-21 16:00:00',
            eventId: 1,
            name: 'Illuminate your knowledge of the laravel code base',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 2,
        name: 'Laravel convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 2,
            start: '2023-10-21 10:00:00',
            end: '2023-10-21 18:00:00',
            eventId: 2,
            name: 'The new Eloquent - load more with less',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 3,
            start: '2023-11-21 09:00:00',
            end: '2023-11-21 17:00:00',
            eventId: 2,
            name: 'AutoEx - handles exceptions 100% automatic',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 3,
        name: 'React convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 4,
            start: '2023-08-21 10:00:00',
            end: '2023-08-21 18:00:00',
            eventId: 3,
            name: '#NoClass pure functional programming',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 5,
            start: '2023-08-21 09:00:00',
            end: '2023-08-21 17:00:00',
            eventId: 3,
            name: 'Navigating the function jungle',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
    ]
    ```
     */

  @Get('events')
  async getEventsWithWorkshops() {
    try {
      const events = await this.eventRepository.find({
        relations: {
          workshops: true,
        },
        order: {
          workshops: {
            id: 'ASC',
          },
        },
      });
      return events;
    } catch (error) {
      console.error('Error :: EventsService.getEventsWithWorkshops', error);
    }
  }

  /* TODO: complete getFutureEventWithWorkshops so that it returns events with workshops, that have not yet started
    Requirements:
    - only events that have not yet started should be included
    - the event starting time is determined by the first workshop of the event
    - the code should result in maximum 3 SQL queries, no matter the amount of events
    - all filtering of records should happen in the database
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - Don't post process query result in javascript
    Hints:
    - open the `src/events/events.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    - join, whereIn, min, groupBy, havingRaw might be helpful
    - in the sample data set  the event with id 1 is already in the past and should therefore be excluded
    Sample response on GET /futureevents:
    ```json
    [
        {
            "id": 2,
            "name": "Laravel convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 2,
                    "start": "2023-10-21 10:00:00",
                    "end": "2023-10-21 18:00:00",
                    "eventId": 2,
                    "name": "The new Eloquent - load more with less",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 3,
                    "start": "2023-11-21 09:00:00",
                    "end": "2023-11-21 17:00:00",
                    "eventId": 2,
                    "name": "AutoEx - handles exceptions 100% automatic",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        },
        {
            "id": 3,
            "name": "React convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 4,
                    "start": "2023-08-21 10:00:00",
                    "end": "2023-08-21 18:00:00",
                    "eventId": 3,
                    "name": "#NoClass pure functional programming",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 5,
                    "start": "2023-08-21 09:00:00",
                    "end": "2023-08-21 17:00:00",
                    "eventId": 3,
                    "name": "Navigating the function jungle",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        }
    ]
    ```
     */
  @Get('futureevents')
  async getFutureEventWithWorkshops() {
    try {
      const currentDate = new Date().toISOString();

      /** get all past-events from database based on workshop start date */
      const pastEvents = await this.eventRepository.find({
        where: {
          workshops: {
            start: LessThan(currentDate),
          },
        },
        select: ['id'],
      });
      const pastEventIds = pastEvents?.map((event) => event?.id);

      /** get all future-events from database */
      const futureEvents = await this.eventRepository.find({
        where: {
          id: Not(In(pastEventIds)),
        },
        relations: {
          workshops: true,
        },
        order: {
          workshops: {
            id: 'ASC',
          },
        },
      });
      return futureEvents;
    } catch (error) {
      console.error(
        'Error :: EventsService.getFutureEventWithWorkshops',
        error,
      );
    }
  }
}
