import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html

@lifeCycleObserver('datasource')
export class J2AligamxDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'j2aligamx';
  //static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.j2aligamx', {optional: true}) dsConfig: object) {
    super(dsConfig);
  }
}
