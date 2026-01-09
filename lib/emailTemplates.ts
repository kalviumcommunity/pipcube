
export function getWelcomeEmail(name: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to PIPcube</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #0070f3; color: white; padding: 10px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
        .button { display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to PIPcube!</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>We are thrilled to have you on board. PIPcube is your new destination for managing everything cleanly and efficiently.</p>
            <p>To get started, please visit your dashboard:</p>
            <p style="text-align: center;">
                <a href="http://localhost:3000/dashboard" class="button">Go to Dashboard</a>
            </p>
            <p>If you have any questions, feel free to reply to this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PIPcube. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
}
