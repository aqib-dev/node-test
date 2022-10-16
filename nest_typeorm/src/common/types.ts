export type DATABASE_PRIMARY_COLUMN = {
  name: string;
  type: string;
  isPrimary: boolean;
  isGenerated: boolean;
  generationStrategy: 'increment' | 'uuid' | 'rowid' | 'identity' | undefined;
};