import { registerAs } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export default registerAs('smtp', () => ({
  transport: {
    service: 'Gmail',
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
  defaults: {
    from: '"noreply" <noreply@example.com>',
    replyTo: 'noreply@gmail.com',
  },
  template: {
    dir: join(__dirname, '../modules/mail/templates/'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
}));
