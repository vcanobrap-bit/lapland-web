import * as migration_20260902_161209_initial from './20260902_161209_initial';

export const migrations = [
  {
    up: migration_20260902_161209_initial.up,
    down: migration_20260902_161209_initial.down,
    name: '20260902_161209_initial'
  },
];
