// Executive Transactional Email Notification Service for New Leads

interface LeadEmailParams {
  leadNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  carName?: string | null;
  source: string;
  notes?: string | null;
}

export async function sendLeadNotificationEmail(params: LeadEmailParams): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@hailmaryrentals.com';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hailmaryrentals.com';
  const resendApiKey = process.env.RESEND_API_KEY;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; color: #E5E7EB; margin: 0; padding: 20px; }
          .card { max-width: 600px; margin: 0 auto; background-color: #0D1117; border: 1px solid #D4AF37; border-radius: 16px; padding: 32px; }
          .header { border-b: 1px solid #222; padding-bottom: 16px; margin-bottom: 24px; text-align: center; }
          .gold { color: #D4AF37; font-weight: bold; }
          .field { font-size: 14px; margin-bottom: 12px; }
          .label { color: #9CA3AF; text-transform: uppercase; font-size: 11px; font-weight: 600; display: block; margin-bottom: 4px; }
          .btn { display: inline-block; background: linear-gradient(135deg, #D4AF37, #AA820A); color: #050505; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 14px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2 style="color: #FFF; margin: 0;">HAIL MARY RENTAL SERVICES</h2>
            <p style="color: #D4AF37; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 2px;">New Lead Inquiry Received</p>
          </div>

          <div class="field">
            <span class="label">Lead Reference</span>
            <span class="gold">${params.leadNumber}</span>
          </div>

          <div class="field">
            <span class="label">Client Full Name</span>
            <strong style="color: #FFF;">${params.clientName}</strong>
          </div>

          <div class="field">
            <span class="label">Client Phone Number</span>
            <span>${params.clientPhone}</span>
          </div>

          ${params.clientEmail ? `
            <div class="field">
              <span class="label">Client Email</span>
              <span>${params.clientEmail}</span>
            </div>
          ` : ''}

          <div class="field">
            <span class="label">Requested Vehicle / Inquiry</span>
            <strong style="color: #FFF;">${params.carName || 'General Showroom Inquiry'}</strong>
          </div>

          <div class="field">
            <span class="label">Touchpoint Source</span>
            <span>${params.source}</span>
          </div>

          ${params.notes ? `
            <div class="field">
              <span class="label">Client Notes & Preferences</span>
              <p style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; font-style: italic; margin: 4px 0;">"${params.notes}"</p>
            </div>
          ` : ''}

          <div style="text-align: center;">
            <a href="${appUrl}/admin/leads" class="btn">View & Manage in CRM Inbox →</a>
          </div>
        </div>
      </body>
    </html>
  `;

  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Hail Mary Concierge <concierge@hailmaryrentals.com>',
          to: [adminEmail],
          subject: `[New Lead Alert] ${params.clientName} — ${params.carName || 'Fleet Inquiry'}`,
          html: htmlContent,
        }),
      });
      return response.ok;
    } catch (err) {
      console.error('Failed to send lead email via Resend API:', err);
    }
  }

  // Fallback: Log email payload cleanly
  console.log(`[EMAIL DISPATCH SIMULATED] To: ${adminEmail} | Subject: New Lead ${params.leadNumber} (${params.clientName})`);
  return true;
}
