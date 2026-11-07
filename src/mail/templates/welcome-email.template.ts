const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const welcomeEmailTemplate = (name: string, courseName: string) => {
  // Theme palette: Vibrant Purple & Indigo for Education / Onboarding
  const purple = "#7c3aed";
  const purpleDark = "#4c1d95";
  const purpleTint = "#f5f3ff";
  const purpleBorder = "#ddd6fe";
  const ink = "#0f172a";
  const slate = "#64748b";
  const line = "#e2e8f0";
  const page = "#f8fafc";
  const emerald = "#059669";

  const brand = "LMS Academy";
  const supportEmail = "support@lmsacademy.com";
  const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
  const startLearningUrl = `${baseUrl}/api`;

  const firstName = escapeHtml(name.trim().split(" ")[0] || "there");
  const safeCourse = escapeHtml(courseName);
  const enrolledOn = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const year = new Date().getFullYear();
  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <title>Welcome to ${safeCourse}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${page};font-family:${font};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Welcome ${firstName}! You're officially enrolled in ${safeCourse}.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${page}" style="background-color:${page};">
      <tr>
        <td align="center" style="padding:28px 12px;">

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${line};border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(15,23,42,0.04);">

            <!-- Top Brand Bar -->
            <tr>
              <td bgcolor="${purpleDark}" style="background-color:${purpleDark};padding:20px 32px;font-size:16px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
                🎓 ${brand}
              </td>
            </tr>

            <!-- Hero Welcome -->
            <tr>
              <td style="padding:32px 32px 0;">
                <div style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${emerald};padding-bottom:8px;">
                  🚀 You're officially in!
                </div>
                <h1 style="margin:0 0 10px;font-size:24px;line-height:32px;font-weight:800;color:${ink};letter-spacing:-0.4px;">
                  Welcome to the course, ${firstName}!
                </h1>
                <p style="margin:0;font-size:14px;line-height:22px;color:${slate};">
                  Your enrollment is confirmed. You now have full lifetime access to all lessons and materials.
                </p>
              </td>
            </tr>

            <!-- Course Highlight Card -->
            <tr>
              <td style="padding:24px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${purpleTint}" style="background-color:${purpleTint};border:1px solid ${purpleBorder};border-radius:10px;">
                  <tr>
                    <td style="padding:18px 20px;">
                      <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${purple};padding-bottom:4px;">Enrolled Course</div>
                      <div style="font-size:17px;line-height:24px;font-weight:700;color:${ink};">${safeCourse}</div>
                      <div style="font-size:12px;color:${slate};padding-top:4px;">Enrolled on: ${enrolledOn}</div>
                    </td>
                    <td align="right" valign="middle" style="padding:18px 20px;white-space:nowrap;">
                      <span style="display:inline-block;padding:6px 12px;background-color:#ffffff;border:1px solid ${purpleBorder};border-radius:20px;font-size:12px;font-weight:700;color:${purple};">
                        Lifetime Access
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Action Button -->
            <tr>
              <td style="padding:24px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" bgcolor="${purple}" style="background-color:${purple};border-radius:8px;">
                      <a href="${startLearningUrl}" style="display:block;padding:15px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:${font};letter-spacing:0.2px;">
                        Start watching lessons →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- What's next / checklist -->
            <tr>
              <td style="padding:28px 32px 0;">
                <div style="font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:${ink};padding-bottom:12px;">
                  What's waiting for you:
                </div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${line};border-radius:10px;padding:8px 16px;">
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:${slate};border-bottom:1px solid ${line};">
                      ⚡ <strong>Self-paced lessons</strong> — Learn at your own schedule
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:${slate};border-bottom:1px solid ${line};">
                      📊 <strong>Progress tracking</strong> — Resume right where you left off
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:${slate};">
                      🏆 <strong>Verified Certificate</strong> — Earn upon 100% completion
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Support / Help -->
            <tr>
              <td style="padding:24px 32px 0;">
                <p style="margin:0;font-size:13px;line-height:20px;color:${slate};">
                  Have questions or need help? Just reply to this email or write to
                  <a href="mailto:${supportEmail}" style="color:${purple};text-decoration:none;font-weight:600;">${supportEmail}</a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 32px 28px;font-size:12px;line-height:18px;color:${slate};border-top:1px solid ${line};margin-top:24px;">
                Happy learning,<br />
                <strong style="color:${ink};">${brand} Team</strong><br />
                <span style="color:#94a3b8;font-size:11px;">&copy; ${year} ${brand}. You received this email because you enrolled in a course.</span>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;
};