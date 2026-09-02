import * as migration_20260902_141413_initial from './20260902_141413_initial';
import * as migration_20260902_144647_contact_form from './20260902_144647_contact_form';

export const migrations = [
  {
    up: migration_20260902_141413_initial.up,
    down: migration_20260902_141413_initial.down,
    name: '20260902_141413_initial',
  },
  {
    up: migration_20260902_144647_contact_form.up,
    down: migration_20260902_144647_contact_form.down,
    name: '20260902_144647_contact_form'
  },
];
