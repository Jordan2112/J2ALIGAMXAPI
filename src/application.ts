
import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  MyUserService,
  RefreshTokenServiceBindings,
  TokenServiceBindings, UserServiceBindings
} from '@loopback/authentication-jwt';

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
// import morgan from 'morgan';
import path from 'path';
import {J2AligamxDataSource} from './datasources';
import {MailServiceBindings} from './key';
import {MySequence} from './sequence';
import {EmailService} from './services';

//Configuracion Variables de Control (INCOMPLETA)
require('dotenv').config()
const db_host = process.env.DB_HOST || 'localhost';
const db_port = process.env.DB_PORT || 3306;
const db_user = process.env.DB_USER || 'root'
const db_pass = process.env.DB_PASSWORD || '1234'
const database = process.env.DB_DATABASE || 'ligamx'

export {ApplicationConfig};

export class J2ALigamxApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    }

    // this.setupLogging();

    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
    // Bind datasource
    this.dataSource(J2AligamxDataSource, UserServiceBindings.DATASOURCE_NAME);
    this.dataSource(J2AligamxDataSource, RefreshTokenServiceBindings.DATASOURCE_NAME);
    //Bind de Variables de Control
    this.bind('datasources.config.mysql').to({
      "name": "j2aligamx",
      "connector": "mysql",
      "url": "",
      "host": db_host,
      "port": db_port,
      "user": db_user,
      "password": db_pass,
      "database": database
    })
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    //for jwt acces token

    this.bind(TokenServiceBindings.TOKEN_SECRET).to("CLAVE SECRETA")

    //for refresh token

    this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to("CLAVE SECRETA")



    //for jwt acces token

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to("60")


    //216080
    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to("60")

    this.bind(MailServiceBindings.MAILER_SERVICE).toClass(EmailService)
      .to(new EmailService("j2aligamx@gmail.com", "sydfdaabdzhllkci"));

  }

  // private setupLogging() {
  //   // Register `morgan` express middleware
  //   // Create a middleware factory wrapper for `morgan(format, options)`
  //   const morganFactory = (config?: morgan.Options<Request, Response>) => {
  //     this.debug('Morgan configuration', config);
  //     return morgan('combined', config);
  //   };

  //   // Print out logs using `debug`
  //   const defaultConfig: morgan.Options<Request, Response> = {
  //     stream: {
  //       write: str => {
  //         this._debug(str);
  //       },
  //     },
  //   };
  //   this.expressMiddleware(morganFactory, defaultConfig, {
  //     injectConfiguration: 'watch',
  //     key: 'middleware.morgan',
  //   });
}


// }
