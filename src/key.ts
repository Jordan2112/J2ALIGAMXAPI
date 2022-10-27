import {BindingKey} from '@loopback/core';
import {EmailService} from './services';


export namespace MailServiceBindings {



  export const MAILER_SERVICE = BindingKey.create<EmailService>('services.mailer');



}
