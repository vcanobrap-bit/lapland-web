import * as migration_20260902_161209_initial from './20260902_161209_initial';
import * as migration_20260902_162835_stats_and_list_blocks from './20260902_162835_stats_and_list_blocks';
import * as migration_20260902_182948_surface_field from './20260902_182948_surface_field';
import * as migration_20260924_144926_hero_escena from './20260924_144926_hero_escena';
import * as migration_20260924_144941_hero_sin_slides from './20260924_144941_hero_sin_slides';
import * as migration_20260924_175837_stats_tarjetas from './20260924_175837_stats_tarjetas';
import * as migration_20260924_175852_stats_sin_campos_anteriores from './20260924_175852_stats_sin_campos_anteriores';

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
    name: '20260902_182948_surface_field',
  },
  {
    up: migration_20260924_144926_hero_escena.up,
    down: migration_20260924_144926_hero_escena.down,
    name: '20260924_144926_hero_escena',
  },
  {
    up: migration_20260924_144941_hero_sin_slides.up,
    down: migration_20260924_144941_hero_sin_slides.down,
    name: '20260924_144941_hero_sin_slides',
  },
  {
    up: migration_20260924_175837_stats_tarjetas.up,
    down: migration_20260924_175837_stats_tarjetas.down,
    name: '20260924_175837_stats_tarjetas',
  },
  {
    up: migration_20260924_175852_stats_sin_campos_anteriores.up,
    down: migration_20260924_175852_stats_sin_campos_anteriores.down,
    name: '20260924_175852_stats_sin_campos_anteriores'
  },
];
