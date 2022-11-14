import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'j2aligamx',
  connector: 'mysql',
  url: '',
  host: 'localhost',
  port: 3308,
  user: 'root',
  password: 'Jordan',
  database: 'j2saligamx',
  insecureAuth: true
};

/*const config = {
  name: 'j2aligamx',
  connector: 'mysql',
  url: '',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'ligamx',
  insecureAuth: true
};*/

<<<<<<< HEAD
// const config = {
//   name: 'j2aligamx',
//   connector: 'mysql',
//   url: '',
//   host: 'j2ligamx.cbr2yblgiwp6.us-east-2.rds.amazonaws.com',
//   port: 3308,
//   user: 'admin',
//   password: 'aacj2a-lmx',
//   database: 'j2aligamx',
//   insecureAuth: true
// };
=======
/*const config = {
  name: 'j2aligamx',
  connector: 'mysql',
  url: '',
  host: 'j2ligamx.cbr2yblgiwp6.us-east-2.rds.amazonaws.com',
  port: 3308,
  user: 'admin',
  password: 'aacj2a-lmx',
  database: 'j2aligamx',
  insecureAuth: true
};*/
>>>>>>> caf2bdaa5e71d9e27242b2ac1e01cf0b76cfce9c

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
