export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const apiKey = process.env.RESEND_API_KEY;

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiK}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'contact@updates.creativedigisol.com',
      to: 'contact@updates.creativedigisol.com',
      subject: `New Contact from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })
  });

  if (!send.ok) {
    return res.status(500).json({ error: 'Failed to send message' });
  }

  return res.status(200).json({ success: true });
}
