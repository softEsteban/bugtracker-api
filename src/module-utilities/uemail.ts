import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class UEmail {

    private transporter: nodemailer.Transporter;

    //ENV variables
    user_email = this.configService.get<string>('EMAIL_USER');
    password_email = this.configService.get<string>('EMAIL_PASS');

    constructor(
        private configService: ConfigService
    ) {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: this.user_email,
                pass: this.password_email,
            },
        });
    }

    async sendConfirmationEmail(email: string, confirmationLink: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: this.user_email,
            to: email,
            subject: 'Mantis Sofware - Confirm Your Email',
            text: `Please confirm your email address by clicking the following link: ${confirmationLink}`,
        };
        await this.transporter.sendMail(mailOptions);
    }
}
