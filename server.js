import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email transporter configuration
// TODO: Configure with your actual email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your email password or app password
  },
});

// B2B Contact Form endpoint
app.post('/api/b2b-contact', async (req, res) => {
  try {
    const {
      companyName,
      cnpj,
      contactName,
      email,
      phone,
      city,
      state,
      volume,
      productsInterest,
      message,
    } = req.body;

    // Email to your team
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'contato@ghenortrs.com.br',
      subject: `Nova Solicitação B2B - ${companyName}`,
      html: `
        <h2>Nova Solicitação de Proposta B2B</h2>
        <h3>Dados da Empresa:</h3>
        <ul>
          <li><strong>Empresa:</strong> ${companyName}</li>
          <li><strong>CNPJ:</strong> ${cnpj}</li>
          <li><strong>Contato:</strong> ${contactName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Telefone:</strong> ${phone}</li>
          <li><strong>Localização:</strong> ${city}/${state}</li>
          <li><strong>Volume Mensal:</strong> ${volume || 'Não informado'}</li>
          <li><strong>Produtos de Interesse:</strong> ${productsInterest || 'Não informado'}</li>
        </ul>
        <h3>Mensagem:</h3>
        <p>${message || 'Nenhuma mensagem adicional'}</p>
        <hr>
        <p><small>Enviado via formulário B2B do site GhenoRTRS</small></p>
      `,
    };

    // Auto-reply to the customer
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recebemos sua solicitação - GhenoRTRS',
      html: `
        <h2>Olá, ${contactName}!</h2>
        <p>Obrigado pelo interesse em se tornar um revendedor GhenoRTRS.</p>
        <p>Recebemos sua solicitação e nossa equipe comercial entrará em contato em breve com uma proposta personalizada para <strong>${companyName}</strong>.</p>
        <h3>Dados recebidos:</h3>
        <ul>
          <li>Empresa: ${companyName}</li>
          <li>CNPJ: ${cnpj}</li>
          <li>Localização: ${city}/${state}</li>
          <li>Volume estimado: ${volume || 'Não informado'}</li>
        </ul>
        <p>Enquanto isso, você pode:</p>
        <ul>
          <li>Visitar nossa loja online: <a href="https://store.ghenortrs.com.br">store.ghenortrs.com.br</a></li>
          <li>Nos seguir no Instagram: <a href="https://www.instagram.com/gheno_rtrs">@gheno_rtrs</a></li>
        </ul>
        <br>
        <p>Atenciosamente,<br><strong>Equipe GhenoRTRS</strong></p>
        <p><small>contato@ghenortrs.com.br</small></p>
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    res.status(200).json({
      success: true,
      message: 'Solicitação enviada com sucesso!',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar solicitação. Por favor, tente novamente.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
