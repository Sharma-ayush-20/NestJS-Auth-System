const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const paymentReceiptTemplate = (
  name: string,
  courseName: string,
  amount: number,
  paymentId: string,
) => {
  // Palette
  const blue = "#2563eb";
  const blueDark = "#1e3a8a";
  const blueTint = "#eff6ff";
  const blueBorder = "#dbeafe";
  const ink = "#0f172a";
  const slate = "#64748b";
  const line = "#e2e8f0";
  const page = "#f1f5f9";
  const green = "#16a34a";

  const brand = "LMS Academy";
  const supportEmail = "support@lmsacademy.com";
  const baseUrl = 'Lms@Backend.com'
  const myCoursesUrl = `${baseUrl}/dashboard/my-courses`;

  const firstName = escapeHtml(name.trim().split(" ")[0] || "there");
  const safeCourse = escapeHtml(courseName);
  const safePaymentId = escapeHtml(paymentId);
  const money = `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const paidOn = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const year = new Date().getFullYear();
  const font = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

  const row = (label: string, value: string, last = false, extra = "") => `
    <tr>
      <td style="padding:10px 0;font-size:13px;color:${slate};${last ? "" : `border-bottom:1px solid ${line};`}">${label}</td>
      <td align="right" style="padding:10px 0;font-size:13px;font-weight:600;color:${ink};${last ? "" : `border-bottom:1px solid ${line};`}${extra}">${value}</td>
    </tr>`;

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light" />
    <title>Receipt for ${safeCourse}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${page};font-family:${font};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      You're enrolled in ${safeCourse}. Receipt for ${money}.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${page}" style="background-color:${page};">
      <tr>
        <td align="center" style="padding:24px 12px;">

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid ${line};border-radius:12px;overflow:hidden;">

            <!-- Brand bar -->
            <tr>
              <td bgcolor="${blueDark}" style="background-color:${blueDark};padding:18px 32px;font-size:16px;font-weight:700;color:#ffffff;letter-spacing:0.2px;">
                ${brand}
              </td>
            </tr>

            <!-- Confirmation -->
            <tr>
              <td style="padding:28px 32px 0;">
                <div style="font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:${green};padding-bottom:8px;">&#10003;&nbsp; Payment successful</div>
                <h1 style="margin:0 0 8px;font-size:22px;line-height:30px;font-weight:700;color:${ink};letter-spacing:-0.3px;">Welcome aboard, ${firstName}!</h1>
                <p style="margin:0;font-size:14px;line-height:22px;color:${slate};">
                  You're now enrolled. Your course is ready whenever you are.
                </p>
              </td>
            </tr>

            <!-- Course summary -->
            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${blueTint}" style="background-color:${blueTint};border:1px solid ${blueBorder};border-radius:10px;">
                  <tr>
                    <td style="padding:16px 18px;">
                      <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${blue};padding-bottom:4px;">Course</div>
                      <div style="font-size:16px;line-height:24px;font-weight:700;color:${ink};">${safeCourse}</div>
                    </td>
                    <td align="right" valign="middle" style="padding:16px 18px;white-space:nowrap;font-size:18px;font-weight:700;color:${blueDark};">${money}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:20px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" bgcolor="${blue}" style="background-color:${blue};border-radius:8px;">
                      <a href="${myCoursesUrl}" style="display:block;padding:14px 24px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;font-family:${font};">Start learning</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Receipt details -->
            <tr>
              <td style="padding:24px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Payment ID", safePaymentId, false, "font-family:'SFMono-Regular',Consolas,Menlo,monospace;font-size:12px;")}
                  ${row("Date", paidOn)}
                  ${row("Status", "Paid", true, `color:${green};`)}
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:22px 32px 26px;font-size:12px;line-height:18px;color:${slate};">
                Need help? Contact <a href="mailto:${supportEmail}" style="color:${blue};text-decoration:none;font-weight:600;">${supportEmail}</a><br />
                <span style="color:#94a3b8;">&copy; ${year} ${brand}. This is an automated receipt for your records.</span>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;
};