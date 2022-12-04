
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
const db_host = process.env.DB_HOST || 'j2ligamx.cbr2yblgiwp6.us-east-2.rds.amazonaws.com';
const db_port = process.env.DB_PORT || 3308;
const db_user = process.env.DB_USER || 'admin';
const db_pass = process.env.DB_PASSWORD || 'aacj2a-lmx';
const database = process.env.DB_DATABASE || 'j2aligamx';

export {ApplicationConfig};

export class J2ALigamxApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    console.log("PASSWORD: " + db_pass);
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
    this.bind('datasources.config.j2aligamx').to({
      "name": "j2aligamx",
      "connector": "mysql",
      "url": "",
      "host": db_host,
      "port": db_port,
      "user": db_user,
      "password": db_pass,
      "database": database
    });

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    //for jwt acces token

    this.bind(TokenServiceBindings.TOKEN_SECRET).to("CLAVE SECRETA")

    //for refresh token

    this.bind(RefreshTokenServiceBindings.REFRESH_SECRET).to("CLAVE SECRETA")



    //for jwt acces token

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to("120")


    //452800
    this.bind(RefreshTokenServiceBindings.REFRESH_EXPIRES_IN).to("120")

    this.bind(MailServiceBindings.MAILER_SERVICE).toClass(EmailService)
      .to(new EmailService("j2aligamx@gmail.com", "sydfdaabdzhllkci"));

  }

}
