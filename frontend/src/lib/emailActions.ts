import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

/**
 * Sends a password reset email with Resend.
 * @param params.to - recipient's email address
 * @param params.subject - email subject
 * @param params.text - plain text content
 * @param params.html - (optional) alternative HTML content
 */
export async function sendResetPasswordEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const { error } = await resend.emails.send({
    from: "Zipway <noreply@shly.pt>",
    to: [to],
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Error sending password reset:", error);
    throw new Error(error.message);
  }
}
