import * as migration_20260902_141413_initial from './20260902_141413_initial';

export const migrations = [
  {
    up: migration_20260902_141413_initial.up,
    down: migration_20260902_141413_initial.down,
    name: '20260902_141413_initial'
  },
];
