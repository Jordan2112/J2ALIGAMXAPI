import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'j2aligamx',
  connector: 'mysql',
  url: '',
  host: 'j2aligamx.cfpkkpkgf0dq.us-east-1.rds.amazonaws.com',

  port: 3308,
  user: 'admin',
  password: 'aacj2a-lmx',
  database: 'j2aligamx',
  insecureAuth: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class J2AligamxDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'j2aligamx';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.j2aligamx', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
