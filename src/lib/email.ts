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
        'q1': 'Primary Marketing Goal',
        'q2': 'Current Channels',
        'q3': 'Monthly Budget',
        'q4': 'Biggest Challenges',
        'q5': 'Success Metrics',
        'q6': 'Target Audience Size',
        'q7': 'Tools & Platforms',
        'q8': 'Average CAC',
        'q9': 'Current ROI Rating',
        'q10': 'Areas for Improvement'
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
      html: adminHtml
    });

    // Send to Client
    await this.sendEmail({
      to: [clientEmail],
      subject: `Your Growth Audit Request: ${submission.name}`,
      html: clientHtml
    });
  }
};
