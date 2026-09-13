import * as migration_20260902_161209_initial from './20260902_161209_initial';
import * as migration_20260902_162835_stats_and_list_blocks from './20260902_162835_stats_and_list_blocks';
import * as migration_20260902_182948_surface_field from './20260902_182948_surface_field';

export const migrations = [
  {
    up: migration_20260902_161209_initial.up,
    down: migration_20260902_161209_initial.down,
    name: '20260902_161209_initial',
  },
  {
    up: migration_20260902_162835_stats_and_list_blocks.up,
    down: migration_20260902_162835_stats_and_list_blocks.down,
    name: '20260902_162835_stats_and_list_blocks',
  },
  {
    up: migration_20260902_182948_surface_field.up,
    down: migration_20260902_182948_surface_field.down,
    name: '20260902_182948_surface_field'
  },
];
