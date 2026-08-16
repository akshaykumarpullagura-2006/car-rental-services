const WHATSAPP_PHONE_NUMBER = '15552345678'; // Primary WhatsApp Contact

export function getWhatsAppLink(params?: {
  carName?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  customMessage?: string;
}) {
  let message = 'Hello Hail Mary Rental Services! I would like to inquire about luxury car rentals.';

  if (params?.carName) {
    message = `Hello Hail Mary Rental Services! I am interested in reserving the *${params.carName}*.\n\n`;
    if (params.startDate && params.endDate) {
      message += `📅 Dates: ${params.startDate} to ${params.endDate}\n`;
    }
    if (params.location) {
      message += `📍 Delivery Location: ${params.location}\n`;
    }
    message += `\nPlease provide availability and final quote.`;
  } else if (params?.customMessage) {
    message = params.customMessage;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
}

export async function logWhatsAppLeadAndOpen(carName?: string, clientPhone?: string) {
  try {
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carName: carName || 'WhatsApp General Inquiry',
        clientName: 'WhatsApp Visitor',
        clientPhone: clientPhone || 'Via WhatsApp Click',
        source: 'whatsapp-click',
        notes: `User clicked WhatsApp CTA for ${carName || 'General Inquiry'}`,
      }),
    }).catch(() => null);
  } catch (e) {
    // Ignore async logging errors
  }

  const url = getWhatsAppLink({ carName });
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
