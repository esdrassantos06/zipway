import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./argon2";
import { nextCookies } from "better-auth/next-js";
import { UserRole } from "@/generated/prisma";
import { admin } from "better-auth/plugins/admin";
import { sendResetPasswordEmail } from "./emailActions";
import { ac, roles } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail({
        to: user.email,
        subject: "Reset Your Password",
        text: `Click the link to reset your password: ${url}`,
        html: `<!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }

              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  line-height: 1.6;
                  color: #1f2937;
                  background-color: #f9fafb;
              }

              .email-container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
              }

              .email-wrapper {
                  width: 100%;
                  background-color: #f9fafb;
                  padding: 40px 20px;
              }

              .header {
                  text-align: center;
                  padding: 40px 40px 20px;
                  background: linear-gradient(to right, #111827, #312e81, #1e3a8a);


                  color: white;
              }

              .header h1 {
                  font-size: 28px;
                  font-weight: 700;
                  margin-bottom: 8px;
              }

              .header p {
                  font-size: 16px;
                  opacity: 0.9;
              }

              .content {
                  padding: 40px;
                  background-color: #ffffff;
              }

              .content h2 {
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 16px;
                  color: #111827;
              }

              .content p {
                  font-size: 16px;
                  margin-bottom: 24px;
                  color: #6b7280;
              }

              .button-container {
                  text-align: center;
                  margin: 32px 0;
              }

              .reset-button {
                  display: inline-block;
                  padding: 14px 32px;
                  background: black;
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 400;
                  font-size: 16px;
                  transition: all 0.3s ease;
              }

              .reset-button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
              }

              .security-info {
                  background-color: #f3f4f6;
                  border-left: 4px solid #6366f1;
                  padding: 20px;
                  margin: 24px 0;
                  border-radius: 0 8px 8px 0;
              }

              .security-info h3 {
                  font-size: 18px;
                  font-weight: 600;
                  margin-bottom: 8px;
                  color: #374151;
              }

              .security-info p {
                  font-size: 14px;
                  color: #6b7280;
                  margin-bottom: 0;
              }

              .footer {
                  text-align: center;
                  padding: 32px 40px;
                  background-color: #f9fafb;
                  border-top: 1px solid #e5e7eb;
              }

              .footer p {
                  font-size: 14px;
                  color: #9ca3af;
                  margin-bottom: 8px;
              }

              .footer .company {
                  font-weight: 600;
                  color: #6b7280;
              }

              @media screen and (max-width: 600px) {
                  .email-wrapper {
                      padding: 20px 10px;
                  }

                  .header,
                  .content,
                  .footer {
                      padding: 24px 20px;
                  }

                  .header h1 {
                      font-size: 24px;
                  }

                  .content h2 {
                      font-size: 20px;
                  }

                  .reset-button {
                      padding: 12px 24px;
                      font-size: 14px;
                  }
              }
          </style>
      </head>

      <body>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                  <td class="email-wrapper">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="email-container">
                          <tr>
                              <td class="header">
                                  <h1>🔐 Reset Password</h1>
                              </td>
                          </tr>
                          <tr>
                              <td class="content">
                                  <h2>Hello!</h2>
                                  <p>We received a request to reset your account password. If you made this request, click the button below to create a new password.</p>

                                  <div class="button-container">
                                      <a href="${url}" class="reset-button">Reset My Password</a>
                                  </div>

                                  <div class="security-info">
                                      <h3>🛡️ Security Information</h3>
                                      <p>This link is valid for 1 hour and can only be used once. If you did not request a password reset, you can safely ignore this email.</p>
                                  </div>

                                  <p>If the button doesn't work, you can also copy and paste the link below into your browser:</p>
                                  <p style="word-break: break-all; color: #6366f1; font-size: 14px;">${url}</p>
                              </td>
                          </tr>
                          <tr>
                              <td class="footer">
                                  <p>This is an automatic email, please do not reply.</p>
                                  <p class="company">Zipway - Security Team</p>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>

      </html>`,
      });
    },
    resetPasswordTokenExpiresIn: 3600,
  },
  socialProviders: {
    github: {
      prompt: "select_account+consent",
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      scopes: [`read:user`, `user:email`],
    },
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(";") ?? [];

          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: UserRole.ADMIN } };
          }
          return { data: { user } };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as Array<UserRole>,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    nextCookies(),
    admin({
      ac,
      roles,
      defaultRole: UserRole.USER,
      adminRoles: [UserRole.ADMIN],
    }),
  ],
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
