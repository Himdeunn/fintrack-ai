import { Resend } from 'resend'

/**
 * EMAIL CONFIGURATION
 * -------------------
 * Ganti 're_123456789' dengan API Key Anda dari https://resend.com
 * Anda bisa menyimpan API Key ini di file .env dengan nama RESEND_API_KEY
 */
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789')

export async function sendPasswordResetEmail(email: string, token: string, language: string = 'en') {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`

  const subject = language === 'id' ? 'Atur Ulang Kata Sandi - FinTrack AI' : 'Password Reset Request - FinTrack AI'
  
  const html = language === 'id' ? `
    <div style="font-family: sans-serif; padding: 20px; color: #212842;">
      <h2 style="font-weight: 900; text-transform: uppercase;">Halo!</h2>
      <p>Anda menerima email ini karena kami menerima permintaan atur ulang kata sandi untuk akun Anda.</p>
      <div style="margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #212842; color: #F0E7D5; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 12px;">Atur Ulang Kata Sandi</a>
      </div>
      <p>Link ini akan kadaluwarsa dalam 1 jam.</p>
      <p>Jika Anda tidak merasa melakukan permintaan ini, abaikan saja email ini.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 10px; color: #999;">© 2026 FinTrack AI. Build for the future of finance.</p>
    </div>
  ` : `
    <div style="font-family: sans-serif; padding: 20px; color: #212842;">
      <h2 style="font-weight: 900; text-transform: uppercase;">Hello!</h2>
      <p>You are receiving this email because we received a password reset request for your account.</p>
      <div style="margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #212842; color: #F0E7D5; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 12px;">Reset Password</a>
      </div>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request a password reset, no further action is required.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
      <p style="font-size: 10px; color: #999;">© 2026 FinTrack AI. Build for the future of finance.</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: 'FinTrack AI <onboarding@resend.dev>', // Ganti dengan domain terverifikasi Anda
      to: email,
      subject: subject,
      html: html,
    })
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { error: 'Failed to send email' }
  }
}
