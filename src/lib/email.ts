export interface EmailPayload {
  to: string[];
  subject: string;
  html: string;
}

export const emailService = {
  async sendEmail(payload: EmailPayload): Promise<boolean> {
    try {
      const response = await fetch('https://marketingsugandha.vercel.app/api/send-contact', {
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
    const adminEmail = 'hello@quirkyumbrella.in';
    const clientEmail = booking.attendeeEmail;
    
    const dateStr = new Date(booking.scheduledDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const subject = `New Strategy Session Booking: ${booking.attendeeName}`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #000;">Strategy Session Details</h2>
        <p><strong>Name:</strong> ${booking.attendeeName}</p>
        <p><strong>Email:</strong> ${booking.attendeeEmail}</p>
        ${booking.attendeePhone ? `<p><strong>Phone:</strong> ${booking.attendeePhone}</p>` : ''}
        ${booking.companyName ? `<p><strong>Company:</strong> ${booking.companyName}</p>` : ''}
        <p><strong>Date:</strong> ${dateStr}</p>
        <p><strong>Time:</strong> ${booking.scheduledTime}</p>
        ${booking.message ? `<p><strong>Message:</strong> ${booking.message}</p>` : ''}
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">This is an automated notification from Quirky Umbrella.</p>
      </div>
    `;

    // Send to Admin
    await this.sendEmail({
      to: [adminEmail],
      subject: `[ADMIN] ${subject}`,
      html: html
    });

    // Send to Client
    await this.sendEmail({
      to: [clientEmail],
      subject: `Booking Confirmation: ${booking.meetingType}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">Booking Confirmed!</h2>
          <p>Hi ${booking.attendeeName},</p>
          <p>Your strategy session has been successfully booked. Here are the details:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Session:</strong> ${booking.meetingType}</p>
            <p><strong>Date:</strong> ${dateStr}</p>
            <p><strong>Time:</strong> ${booking.scheduledTime}</p>
          </div>
          <p>We look forward to speaking with you!</p>
          <p>Best regards,<br>Quirky Umbrella Team</p>
        </div>
      `
    });
  },

  async sendGrowthAuditEmails(submission: any) {
    const adminEmail = 'hello@quirkyumbrella.in';
    const clientEmail = submission.email;

    const subject = `New Growth Audit Submission: ${submission.name}`;
    
    // Format answers
    let answersHtml = '';
    if (submission.answers) {
      answersHtml = '<h3 style="margin-top: 20px;">Audit Answers:</h3><ul>';
      for (const [key, value] of Object.entries(submission.answers)) {
        answersHtml += `<li><strong>${key}:</strong> ${Array.isArray(value) ? value.join(', ') : value}</li>`;
      }
      answersHtml += '</ul>';
    }

    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #000;">Growth Audit Submission</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        ${submission.mobile ? `<p><strong>Mobile:</strong> ${submission.mobile}</p>` : ''}
        ${submission.companyName ? `<p><strong>Company:</strong> ${submission.companyName}</p>` : ''}
        <p><strong>Message:</strong> ${submission.message}</p>
        ${answersHtml}
      </div>
    `;

    // Send to Admin
    await this.sendEmail({
      to: [adminEmail],
      subject: `[ADMIN] ${subject}`,
      html: html
    });

    // Send to Client
    await this.sendEmail({
      to: [clientEmail],
      subject: `Growth Audit Received: ${submission.name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">Audit Received</h2>
          <p>Hi ${submission.name},</p>
          <p>Thank you for submitting your details for a Growth Audit. We've received your information and our team will review it shortly.</p>
          <p>We'll get back to you with personalized insights soon!</p>
          <p>Best regards,<br>Quirky Umbrella Team</p>
        </div>
      `
    });
  }
};
