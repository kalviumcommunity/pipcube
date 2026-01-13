
import sgMail from '@sendgrid/mail';
import { logger } from './logger';

const API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

if (API_KEY) {
    sgMail.setApiKey(API_KEY);
} else {
    logger.error("SENDGRID_API_KEY is missing from environment variables.");
}

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    if (!API_KEY || !FROM_EMAIL) {
        throw new Error("Email configuration missing (SENDGRID_API_KEY or SENDGRID_FROM_EMAIL)");
    }

    const msg = {
        to,
        from: FROM_EMAIL,
        subject,
        html,
    };

    try {
        const [response] = await sgMail.send(msg);
        logger.info("Email sent successfully", {
            messageId: response.headers['x-message-id'],
            statusCode: response.statusCode,
            to
        });
        return response;
    } catch (error: any) {
        logger.error("Failed to send email", {
            error: error.message,
            response: error.response?.body
        });
        throw error;
    }
}
