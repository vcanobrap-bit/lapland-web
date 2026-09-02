import * as migration_20260902_161209_initial from './20260902_161209_initial';
import * as migration_20260902_162835_stats_and_list_blocks from './20260902_162835_stats_and_list_blocks';

export const migrations = [
  {
    up: migration_20260902_161209_initial.up,
    down: migration_20260902_161209_initial.down,
    name: '20260902_161209_initial',
  },
  {
    up: migration_20260902_162835_stats_and_list_blocks.up,
    down: migration_20260902_162835_stats_and_list_blocks.down,
    name: '20260902_162835_stats_and_list_blocks'
  },
];
