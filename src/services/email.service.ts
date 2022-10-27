import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import nodemailer, {SentMessageInfo} from "nodemailer";
import Mail from "nodemailer/lib/mailer";


@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  private transporter;
  private emailHost;
  constructor(emailHost: string, password: string) {

    this.emailHost = emailHost;
    this.transporter = nodemailer.createTransport({


      service: 'Gmail',

      auth: {
        user: emailHost,
        pass: password,
      },
      logger: true
    })
  }

  async sendMail(mailOptions: Mail.Options): Promise<SentMessageInfo> {
    mailOptions.from = this.emailHost;
    const info = await this.transporter.sendMail(mailOptions);
    console.log("Messsage sent: %s", info.response);
    return info;


  }














}
