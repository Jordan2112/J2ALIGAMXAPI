import {RefreshTokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {J2ALigamxApplication} from './application';

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  console.log('Migrating schemas (%s existing schema)', existingSchema);

  const app = new J2ALigamxApplication();

  await Promise.all([
    ...app.find(UserServiceBindings.USER_REPOSITORY),
    ...app.find(UserServiceBindings.USER_CREDENTIALS_REPOSITORY),
    ...app.find(RefreshTokenServiceBindings.REFRESH_REPOSITORY)
  ].map(b => app.get(b.key)))
  // Connectors usually keep a pool of opened connections,
  // this keeps the process running even after all work is done.
  // We need to exit explicitly.
  await app.boot();
  await app.migrateSchema({existingSchema});
  process.exit(0);
}

migrate(process.argv).catch(err => {
  console.error('Cannot migrate database schema', err);
  process.exit(1);
});



