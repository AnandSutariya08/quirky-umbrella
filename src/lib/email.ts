export interface EmailPayload {
  to: string[];
  subject: string;
  html: string;
}

const BRAND = {
  primary: '#FA00AC',
  secondary: '#274EFF',
  accent: '#DAF304',
  background: '#FAFBFC',
  foreground: '#1A1A1A',
  muted: '#4A5568',
  card: '#FFFFFF',
  border: 'rgba(45, 55, 72, 0.12)',
};

const bookingTypeNames: Record<string, string> = {
  discovery: 'Free Discovery Call',
  strategy: 'Growth Strategy Session',
  consultation: 'Service Consultation',
};

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatMeetingType = (meetingType: unknown): string => {
  const key = String(meetingType ?? '');
  return bookingTypeNames[key] ?? key;
};

const formatTime12h = (time: unknown): string => {
  const timeStr = String(time ?? '');
  const [hoursRaw, minutesRaw] = timeStr.split(':');
  const hours = Number(hoursRaw);
  if (Number.isNaN(hours) || !minutesRaw) {
    return timeStr;
  }
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutesRaw} ${ampm}`;
};

const formatDateLabel = (dateValue: unknown): string => {
  const date = new Date(String(dateValue ?? ''));
  if (Number.isNaN(date.getTime())) {
    return String(dateValue ?? '');
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const buildEmailShell = (content: string) => `
  <div style="margin:0;padding:32px 16px;background:${BRAND.background};font-family:'DM Sans','Segoe UI',Tahoma,Verdana,sans-serif;color:${BRAND.foreground};">
    <div style="max-width:640px;margin:0 auto;background:${BRAND.card};border:1px solid ${BRAND.border};border-radius:20px;overflow:hidden;box-shadow:0 20px 44px -28px rgba(250,0,172,0.22);">
      <div style="padding:28px 28px 22px;background:linear-gradient(135deg, rgba(250,0,172,0.14) 0%, rgba(39,78,255,0.12) 55%, rgba(218,243,4,0.2) 100%);border-bottom:1px solid ${BRAND.border};">
        <p style="margin:0 0 10px 0;display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(250,0,172,0.14);color:${BRAND.primary};font-size:12px;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;">Quirky Umbrella</p>
        <h1 style="margin:0;font-family:'Fraunces',Georgia,'Times New Roman',serif;font-size:30px;line-height:1.15;color:${BRAND.foreground};">Strategy Session Update</h1>
      </div>
      <div style="padding:28px;">
        ${content}
      </div>
      <div style="padding:18px 28px 24px;border-top:1px solid ${BRAND.border};background:linear-gradient(180deg, rgba(250,0,172,0.02) 0%, rgba(39,78,255,0.02) 100%);">
        <p style="margin:0;color:${BRAND.muted};font-size:12px;line-height:1.6;">
          Quirky Umbrella | <a href="https://quirkyumbrella.in" style="color:${BRAND.secondary};text-decoration:none;">quirkyumbrella.in</a> | <a href="mailto:hello@quirkyumbrella.in" style="color:${BRAND.secondary};text-decoration:none;">hello@quirkyumbrella.in</a>
        </p>
      </div>
    </div>
  </div>
`;

export const emailService = {
  async sendEmail(payload: EmailPayload): Promise<boolean> {
    try {
      const response = await fetch('https://sugandhamarketingnew.vercel.app/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Email API error:', errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  },

  async sendBookingEmails(booking: any) {
    // const adminEmail = 'hello@quirkyumbrella.in';
    const adminEmail = 'anandsutariya83@gmail.com';
    const clientEmail = booking.attendeeEmail;

    const dateStr = new Date(booking.scheduledDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const meetingType = escapeHtml(formatMeetingType(booking.meetingType));
    const attendeeName = escapeHtml(booking.attendeeName);
    const attendeeEmail = escapeHtml(booking.attendeeEmail);
    const attendeePhone = booking.attendeePhone ? escapeHtml(booking.attendeePhone) : '';
    const companyName = booking.companyName ? escapeHtml(booking.companyName) : '';
    const message = booking.message ? escapeHtml(booking.message) : '';
    const timezone = booking.timezone ? escapeHtml(booking.timezone) : '';
    const scheduledTime = escapeHtml(formatTime12h(booking.scheduledTime));
    const safeDate = escapeHtml(dateStr);

    const subject = `New Strategy Session Booking: ${booking.attendeeName}`;
    const adminHtml = buildEmailShell(`
      <p style="margin:0 0 16px 0;font-size:15px;color:${BRAND.muted};line-height:1.7;">
        A new strategy session has been booked. Here are the submitted details:
      </p>
      <div style="border:1px solid ${BRAND.border};border-radius:14px;background:#fff;padding:18px 18px 4px;">
        <p style="margin:0 0 14px 0;font-size:13px;font-weight:700;color:${BRAND.primary};text-transform:uppercase;letter-spacing:0.03em;">New Strategy Session Booking</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};width:34%;">Meeting</td><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:600;">${meetingType}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Name</td><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:600;">${attendeeName}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Email</td><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;"><a href="mailto:${attendeeEmail}" style="color:${BRAND.secondary};text-decoration:none;font-weight:600;">${attendeeEmail}</a></td></tr>
          ${attendeePhone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:600;">${attendeePhone}</td></tr>` : ''}
          ${companyName ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Company</td><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:600;">${companyName}</td></tr>` : ''}
          <tr><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Date</td><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:600;">${safeDate}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Time</td><td style="padding:10px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:600;">${scheduledTime}${timezone ? ` (${timezone})` : ''}</td></tr>
        </table>
      </div>
      ${message ? `<div style="margin-top:16px;border-radius:12px;background:rgba(39,78,255,0.06);border:1px solid rgba(39,78,255,0.16);padding:14px 16px;"><p style="margin:0 0 6px 0;color:${BRAND.secondary};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;">Message</p><p style="margin:0;color:${BRAND.foreground};font-size:14px;line-height:1.7;">${message}</p></div>` : ''}
    `);

    // Send to Admin
    await this.sendEmail({
      to: [adminEmail],
      subject: `[ADMIN] ${subject}`,
      html: adminHtml,
    });

    // Send to Client
    await this.sendEmail({
      to: [clientEmail],
      subject: `Booking Confirmed! ${formatMeetingType(booking.meetingType)}`,
      html: buildEmailShell(`
        <p style="margin:0;font-size:28px;font-family:'Fraunces',Georgia,'Times New Roman',serif;color:${BRAND.foreground};line-height:1.2;">Booking Confirmed!</p>
        <p style="margin:12px 0 0 0;font-size:15px;color:${BRAND.muted};line-height:1.7;">Hi ${attendeeName}, your strategy session is booked. We are excited to connect with you.</p>

        <div style="margin-top:20px;border-radius:16px;padding:18px;background:linear-gradient(135deg, rgba(250,0,172,0.08) 0%, rgba(39,78,255,0.07) 68%, rgba(218,243,4,0.16) 100%);border:1px solid ${BRAND.border};">
          <p style="margin:0 0 12px 0;font-size:12px;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;color:${BRAND.primary};">Session Details</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:9px 0;color:${BRAND.muted};width:34%;">Session</td><td style="padding:9px 0;color:${BRAND.foreground};font-weight:700;">${meetingType}</td></tr>
            <tr><td style="padding:9px 0;color:${BRAND.muted};">Date</td><td style="padding:9px 0;color:${BRAND.foreground};font-weight:700;">${safeDate}</td></tr>
            <tr><td style="padding:9px 0;color:${BRAND.muted};">Time</td><td style="padding:9px 0;color:${BRAND.foreground};font-weight:700;">${scheduledTime}${timezone ? ` (${timezone})` : ''}</td></tr>
            ${companyName ? `<tr><td style="padding:9px 0;color:${BRAND.muted};">Company</td><td style="padding:9px 0;color:${BRAND.foreground};font-weight:700;">${companyName}</td></tr>` : ''}
          </table>
        </div>

        <div style="margin-top:20px;padding:14px 16px;border-radius:12px;background:rgba(218,243,4,0.24);border:1px solid rgba(218,243,4,0.42);">
          <p style="margin:0;font-size:14px;line-height:1.7;color:${BRAND.foreground};">
            Need to share extra context before the call? Reply to this email and our team will update your booking notes.
          </p>
        </div>

        <p style="margin:20px 0 0 0;font-size:15px;color:${BRAND.foreground};line-height:1.7;">
          We look forward to speaking with you.<br/>
          <span style="font-weight:700;">Quirky Umbrella Team</span>
        </p>
      `),
    });
  },

  async sendBookingActionEmail({
    booking,
    action,
    previousDate,
    previousTime,
    forwardedTo,
    adminNotes,
  }: {
    booking: any;
    action: 'cancelled' | 'forwarded' | 'rescheduled';
    previousDate?: Date;
    previousTime?: string;
    forwardedTo?: string;
    adminNotes?: string;
  }) {
    if (!booking?.attendeeEmail) return;

    const attendeeName = escapeHtml(booking.attendeeName || 'there');
    const attendeeEmailRaw = String(booking.attendeeEmail || '');
    const meetingType = escapeHtml(formatMeetingType(booking.meetingType));
    const currentDate = escapeHtml(formatDateLabel(booking.scheduledDate));
    const currentTime = escapeHtml(formatTime12h(booking.scheduledTime));
    const timezone = booking.timezone ? escapeHtml(booking.timezone) : '';
    const oldDate = previousDate ? escapeHtml(formatDateLabel(previousDate)) : '';
    const oldTime = previousTime ? escapeHtml(formatTime12h(previousTime)) : '';
    const safeForwardedTo = forwardedTo ? escapeHtml(forwardedTo) : '';
    const safeAdminNotes = adminNotes ? escapeHtml(adminNotes) : '';

    const subjectMap = {
      cancelled: `Booking Update: Your session was cancelled`,
      forwarded: `Booking Update: Your session was forwarded`,
      rescheduled: `Booking Update: Your session was rescheduled`,
    } as const;

    const introMap = {
      cancelled: `Your scheduled strategy session has been cancelled by our team.`,
      forwarded: `Your booking has been forwarded to the relevant team member for better handling.`,
      rescheduled: `Your booking has been rescheduled by our team.`,
    } as const;

    const actionTagMap = {
      cancelled: 'Booking Cancelled',
      forwarded: 'Booking Forwarded',
      rescheduled: 'Booking Rescheduled',
    } as const;

    const actionStyleMap = {
      cancelled: {
        color: '#DC2626',
        softBg: 'rgba(220,38,38,0.10)',
        softBorder: 'rgba(220,38,38,0.28)',
      },
      forwarded: {
        color: '#274EFF',
        softBg: 'rgba(39,78,255,0.10)',
        softBorder: 'rgba(39,78,255,0.24)',
      },
      rescheduled: {
        color: '#D97706',
        softBg: 'rgba(217,119,6,0.10)',
        softBorder: 'rgba(217,119,6,0.26)',
      },
    } as const;

    const actionStyle = actionStyleMap[action];

    const detailsHtml =
      action === 'cancelled'
        ? `
          <div style="margin-top:20px;border-radius:14px;padding:16px;border:1px solid ${actionStyle.softBorder};background:${actionStyle.softBg};">
            <p style="margin:0 0 10px 0;font-size:12px;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;color:${actionStyle.color};">Cancelled Session</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:${BRAND.muted};width:34%;">Session</td><td style="padding:8px 0;color:${BRAND.foreground};font-weight:700;">${meetingType}</td></tr>
              <tr><td style="padding:8px 0;color:${BRAND.muted};">Date</td><td style="padding:8px 0;color:${BRAND.foreground};font-weight:700;">${currentDate}</td></tr>
              <tr><td style="padding:8px 0;color:${BRAND.muted};">Time</td><td style="padding:8px 0;color:${BRAND.foreground};font-weight:700;">${currentTime}${timezone ? ` (${timezone})` : ''}</td></tr>
            </table>
          </div>
        `
        : action === 'rescheduled'
          ? `
          <div style="margin-top:20px;border-radius:14px;padding:16px;border:1px solid ${actionStyle.softBorder};background:${actionStyle.softBg};">
            <p style="margin:0 0 10px 0;font-size:12px;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;color:${actionStyle.color};">Updated Session Time</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};width:34%;">Session</td><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:700;">${meetingType}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Previous</td><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:700;">${oldDate}${oldTime ? ` at ${oldTime}` : ''}</td></tr>
              <tr><td style="padding:8px 0;color:${BRAND.muted};">New</td><td style="padding:8px 0;color:${BRAND.foreground};font-weight:700;">${currentDate} at ${currentTime}${timezone ? ` (${timezone})` : ''}</td></tr>
            </table>
          </div>
        `
          : `
          <div style="margin-top:20px;border-radius:14px;padding:16px;border:1px solid ${actionStyle.softBorder};background:${actionStyle.softBg};">
            <p style="margin:0 0 10px 0;font-size:12px;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;color:${actionStyle.color};">Forwarding Details</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};width:34%;">Session</td><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:700;">${meetingType}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Date</td><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:700;">${currentDate}</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.muted};">Time</td><td style="padding:8px 0;border-bottom:1px solid #f1f3f5;color:${BRAND.foreground};font-weight:700;">${currentTime}${timezone ? ` (${timezone})` : ''}</td></tr>
              ${safeForwardedTo ? `<tr><td style="padding:8px 0;color:${BRAND.muted};">Forwarded To</td><td style="padding:8px 0;color:${BRAND.foreground};font-weight:700;">${safeForwardedTo}</td></tr>` : ''}
            </table>
          </div>
        `;

    await this.sendEmail({
      to: [attendeeEmailRaw],
      subject: subjectMap[action],
      html: buildEmailShell(`
        <p style="margin:0 0 10px 0;display:inline-block;padding:6px 12px;border-radius:999px;background:${actionStyle.softBg};border:1px solid ${actionStyle.softBorder};color:${actionStyle.color};font-size:12px;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;">${actionTagMap[action]}</p>
        <p style="margin:0;font-size:15px;color:${BRAND.muted};line-height:1.7;">Hi ${attendeeName},</p>
        <p style="margin:10px 0 0 0;font-size:15px;color:${BRAND.foreground};line-height:1.7;">${introMap[action]}</p>
        ${detailsHtml}
        ${safeAdminNotes ? `<div style="margin-top:16px;padding:14px 16px;border-radius:12px;background:${actionStyle.softBg};border:1px solid ${actionStyle.softBorder};"><p style="margin:0 0 6px 0;color:${actionStyle.color};font-size:12px;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;">Admin Note</p><p style="margin:0;color:${BRAND.foreground};font-size:14px;line-height:1.7;">${safeAdminNotes}</p></div>` : ''}
        <p style="margin:20px 0 0 0;font-size:15px;color:${BRAND.foreground};line-height:1.7;">
          For any questions, reply to this email at
          <a href="mailto:hello@quirkyumbrella.in" style="color:${BRAND.secondary};text-decoration:none;"> hello@quirkyumbrella.in</a>.
        </p>
      `),
    });
  },

  async sendGrowthAuditEmails(submission: any) {
    const adminEmail = 'hello@quirkyumbrella.in';
    const clientEmail = submission.email;

    const subject = `Growth Audit Request: ${submission.name}`;

    // Format answers for HTML
    let answersHtml = '';
    if (submission.answers) {
      answersHtml = `
        <div style="margin-top: 25px; background: #fcfcfc; padding: 20px; border-radius: 12px; border: 1px solid #eee;">
          <h3 style="margin-top: 0; color: #000; font-size: 18px; border-bottom: 2px solid #primary; padding-bottom: 8px;">Audit Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
      `;

      const questionMap: Record<string, string> = {
        q1: 'Primary Marketing Goal',
        q2: 'Current Channels',
        q3: 'Monthly Budget',
        q4: 'Biggest Challenges',
        q5: 'Success Metrics',
        q6: 'Target Audience Size',
        q7: 'Tools & Platforms',
        q8: 'Average CAC',
        q9: 'Current ROI Rating',
        q10: 'Areas for Improvement',
      };

      for (const [key, value] of Object.entries(submission.answers)) {
        const questionText = questionMap[key] || key;
        const formattedValue = Array.isArray(value) ? value.join(', ') : value;
        answersHtml += `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; width: 40%; font-weight: bold; color: #555;">${questionText}</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${formattedValue}</td>
          </tr>
        `;
      }
      answersHtml += '</table></div>';
    }

    const adminHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0; font-size: 24px;">New Growth Audit Request</h1>
          <p style="color: #666; margin-top: 5px;">A new lead has requested a growth audit.</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="margin-top: 0; font-size: 16px; color: #000;">Contact Information</h3>
          <p style="margin: 8px 0;"><strong>Name:</strong> ${submission.name}</p>
          <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${submission.email}" style="color: #0066cc; text-decoration: none;">${submission.email}</a></p>
          ${submission.mobile ? `<p style="margin: 8px 0;"><strong>Mobile:</strong> ${submission.mobile}</p>` : ''}
          ${submission.companyName ? `<p style="margin: 8px 0;"><strong>Company:</strong> ${submission.companyName}</p>` : ''}
          <p style="margin: 8px 0;"><strong>Initial Message:</strong> ${submission.message}</p>
        </div>

        ${answersHtml}
        
        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; pt: 20px;">
          <p>Sent via Quirky Umbrella Platform</p>
        </div>
      </div>
    `;

    const clientHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; margin: 0; font-size: 28px;">Your Growth Audit is Underway!</h1>
          <p style="color: #666; margin-top: 10px; font-size: 16px;">Hi ${submission.name}, thank you for reaching out.</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6;">We've successfully received your details for the <strong>Free Growth Audit</strong>. Our team of experts is now reviewing your responses to provide you with actionable, data-driven insights tailored to your business goals.</p>
        
        <div style="background: #f0f7ff; border-left: 4px solid #0066cc; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <h3 style="margin-top: 0; color: #004080; font-size: 18px;">What's Next?</h3>
          <ul style="margin: 10px 0 0 0; padding-left: 20px; line-height: 1.6;">
            <li>Our strategists will analyze your current marketing stack.</li>
            <li>We'll identify 3-5 immediate growth opportunities.</li>
            <li>Expect a detailed response within 24-48 business hours.</li>
          </ul>
        </div>

        <p style="font-size: 16px; line-height: 1.6;">In the meantime, feel free to check out our <a href="https://quirkyumbrella.in/blogs" style="color: #0066cc; text-decoration: underline;">latest growth insights</a> on our blog.</p>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="margin: 0; font-weight: bold; color: #000;">Best regards,</p>
          <p style="margin: 5px 0 0 0;">The Quirky Umbrella Team</p>
          <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">
            <a href="https://quirkyumbrella.in" style="color: #666; text-decoration: none;">www.quirkyumbrella.in</a> | 
            <a href="mailto:hello@quirkyumbrella.in" style="color: #666; text-decoration: none;">hello@quirkyumbrella.in</a>
          </p>
        </div>
      </div>
    `;

    // Send to Admin
    await this.sendEmail({
      to: [adminEmail],
      subject: `[ADMIN] ${subject}`,
      html: adminHtml,
    });

    // Send to Client
    await this.sendEmail({
      to: [clientEmail],
      subject: `Your Growth Audit Request: ${submission.name}`,
      html: clientHtml,
    });
  },
};
