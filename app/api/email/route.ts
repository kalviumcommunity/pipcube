
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { getWelcomeEmail } from "@/lib/emailTemplates";
import { handleError } from "@/lib/errorHandler";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { to, subject, message, templateName, name } = body;

        if (!to || !subject) {
            return NextResponse.json(
                { error: "Missing required fields: to, subject" },
                { status: 400 }
            );
        }

        let htmlContent = message || "";

        // Use template if requested
        if (templateName === 'welcome') {
            htmlContent = getWelcomeEmail(name || 'User');
        }

        if (!htmlContent) {
            return NextResponse.json(
                { error: "Missing message content or valid template" },
                { status: 400 }
            );
        }

        await sendEmail({
            to,
            subject,
            html: htmlContent
        });

        return NextResponse.json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        return handleError(error, 'POST /api/email');
    }
}
