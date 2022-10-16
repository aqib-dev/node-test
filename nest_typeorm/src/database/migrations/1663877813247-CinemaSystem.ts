import { DATABASE_PRIMARY_COLUMN } from 'src/common/types';
import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export const primaryColumn: DATABASE_PRIMARY_COLUMN = {
  name: 'id',
  type: 'integer',
  isPrimary: true,
  isGenerated: true,
  generationStrategy: 'increment',
};

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'movie',
        columns: [
          primaryColumn,
          { name: 'title', type: 'varchar' },
          { name: 'description', type: 'varchar' },
          { name: 'rating', type: 'integer' },
          { name: 'genre', type: 'varchar' },
          { name: 'duration', type: 'varchar' },
          { name: 'cast', type: 'varchar' },
          { name: 'createdAt', type: 'timestamp' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'cinema_room',
        columns: [
          primaryColumn,
          { name: 'name', type: 'varchar' },
          { name: 'total_seats', type: 'integer' },
          { name: 'location', type: 'varchar' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'show',
        columns: [
          primaryColumn,
          { name: 'movie_id', type: 'integer' },
          { name: 'cinema_room_id', type: 'integer' },
          { name: 'base_ticket_price', type: 'integer' },
          { name: 'start_time', type: 'timestamp' },
          { name: 'end_time', type: 'timestamp' },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'show',
      new TableForeignKey({
        columnNames: ['movie_id'],
        referencedTableName: 'movie',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'show',
      new TableForeignKey({
        columnNames: ['cinema_room_id'],
        referencedTableName: 'cinema_room',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'seat',
        columns: [
          primaryColumn,
          { name: 'cinema_room_id', type: 'integer' },
          { name: 'row', type: 'integer' }, // row number
          { name: 'number', type: 'integer' }, // seat no.
          { name: 'category', type: 'varchar' }, // [VIP, COUPLE, NORMAL]
          { name: 'status', type: 'varchar' }, // [BOOKED, AVAILABLE]
          { name: 'percentage_premium', type: 'integer' },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'seat',
      new TableForeignKey({
        columnNames: ['cinema_room_id'],
        referencedTableName: 'cinema_room',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'seat_price',
        columns: [
          primaryColumn,
          { name: 'show_id', type: 'integer' },
          { name: 'seat_id', type: 'integer' },
          { name: 'base_price', type: 'integer' },
          { name: 'percentage_premium', type: 'integer' },
          { name: 'total_price', type: 'integer' },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'seat_price',
      new TableForeignKey({
        columnNames: ['show_id'],
        referencedTableName: 'show',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'seat_price',
      new TableForeignKey({
        columnNames: ['seat_id'],
        referencedTableName: 'seat',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    /** user details table */
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          primaryColumn,
          { name: 'name', type: 'varchar' },
          { name: 'contact_no', type: 'varchar' },
        ],
      }),
    );

    /** ticket booking */
    await queryRunner.createTable(
      new Table({
        name: 'booking',
        columns: [
          primaryColumn,
          { name: 'user_id', type: 'integer' },
          { name: 'show_id', type: 'integer' },
          { name: 'seat_id', type: 'integer' },
          { name: 'amount_paid', type: 'integer' },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'booking',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'booking',
      new TableForeignKey({
        columnNames: ['seat_id'],
        referencedTableName: 'seat',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'booking',
      new TableForeignKey({
        columnNames: ['show_id'],
        referencedTableName: 'show',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO drop foreign keys first
    await queryRunner.dropTable('movie');
    await queryRunner.dropTable('cinema_room');
    await queryRunner.dropTable('show');
    await queryRunner.dropTable('seat');
    await queryRunner.dropTable('seat_price');
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('booking');
  }
}
