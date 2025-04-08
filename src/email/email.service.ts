import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { appError } from 'lib/helpers/error'; 
import { CreateEmailDto } from '../../src/email/dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(emailData: CreateEmailDto): Promise<string> {
    try {
      const { to, subject, template, context } = emailData;

      const emailSent = await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });

      console.log('Email sent successfully:', emailSent);
      return 'Email sent successfully';
    } catch (error) {
      console.error('Error sending email:', error);
      throw appError(error);
    }
  }
}