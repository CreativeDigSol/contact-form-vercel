export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('Missing RESEND_API_KEY in environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'contact@updates.creativedigisol.com', // make sure this is a verified sender
      to: 'contact@updates.creativedigisol.com',   // where you want to receive messages
      subject: `New Contact from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Email send failed:', errorText);
    return res.status(500).json({ error: 'Failed to send email', details: errorText });
  }

  return res.status(200).json({ success: true });
}
