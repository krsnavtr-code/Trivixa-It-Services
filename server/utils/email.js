import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  },
  debug: false, // Disable detailed debug output
  logger: process.env.NODE_ENV === 'development' // Only log in development
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? 'Set' : 'Not Set',
      from: process.env.EMAIL_FROM_ADDRESS
    });
  }
});

/**
 * Send an email with a PDF attachment
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email text content
 * @param {string} options.html - Email HTML content
 * @param {Object} options.attachments - Email attachments
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendEmail = async ({
  to,
  subject,
  text = '',
  html = '',
  attachments = [],
}) => {
  try {
    console.log('Preparing to send email to:', to);
    
    if (!to) {
      throw new Error('Recipient email is required');
    }

    if (!subject) {
      throw new Error('Email subject is required');
    }

    const fromEmail = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER;
    if (!fromEmail) {
      throw new Error('Sender email address is not configured');
    }

    // Process attachments to ensure they're in the correct format
    const processedAttachments = (Array.isArray(attachments) ? attachments : []).map(attachment => {
      // If content is a buffer, convert it to base64
      if (Buffer.isBuffer(attachment.content)) {
        return {
          ...attachment,
          content: attachment.content.toString('base64'),
          encoding: 'base64'
        };
      }
      return attachment;
    });

    console.log('Processed attachments:', processedAttachments.map(a => ({
      filename: a.filename,
      type: a.contentType,
      size: typeof a.content === 'string' ? a.content.length : 'unknown'
    })));

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${fromEmail}>`,
      to: to,
      subject: subject,
      text: text,
      html: html || text.replace(/\n/g, '<br>'),
      attachments: processedAttachments,
    };

    console.log('Mail options prepared:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasAttachments: processedAttachments.length,
      attachmentCount: processedAttachments.length,
      attachmentNames: processedAttachments.map(a => a.filename)
    });

    // Test connection first
    await new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP Connection Error:', error);
          reject(new Error(`SMTP Connection Error: ${error.message}`));
        } else {
          console.log('SMTP Server is ready to take our messages');
          resolve();
        }
      });
    });

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { 
      success: true, 
      messageId: info.messageId,
      response: info.response 
    };
  } catch (error) {
    console.error('Error in sendEmail function:', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      syscall: error.syscall,
      path: error.path,
      response: error.response
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send a course PDF to a student's email
 * @param {string} email - Student's email address
 * @param {Object} course - Course details
 * @param {Buffer|string} pdfBuffer - PDF file buffer or path
 * @param {string} [fileName] - Name for the PDF file
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendCoursePdfEmail = async (email, course, pdfBuffer, fileName = '') => {
  const subject = `Your Course Material: ${course.title}`;
  const text = `Hello,\n\nPlease find attached the course material for ${course.title}.\n\nThank you for learning with us!`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello,</h2>
      <p>Please find attached the course material for <strong>${course.title}</strong>.</p>
      <p>Course Description: ${course.description || 'No description available'}</p>
      <p>Thank you for learning with us!</p>
      <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
    </div>
  `;

  const attachments = [];
  
  // If pdfBuffer is a string, treat it as a file path
  if (typeof pdfBuffer === 'string') {
    attachments.push({
      filename: fileName || `course-${course.slug || course._id}.pdf`,
      path: pdfBuffer,
    });
  } else if (pdfBuffer instanceof Buffer) {
    // If it's a Buffer, use it directly
    attachments.push({
      filename: fileName || `course-${course.slug || course._id}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    });
  }

  return sendEmail({
    to: email,
    subject,
    text,
    html,
    attachments,
  });
};

/**
 * Send contact form submission notifications
 * @param {Object} contact - Contact form submission data
 * @returns {Promise} - Promise that resolves when emails are sent
 */

// --- Style Configuration ---
const COLORS = {
  primary: '#0a0f2d', // Deep Navy
  accent: '#F47C26',  // Neon Orange
  bg: '#f4f7f6',
  white: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  border: '#e0e0e0'
};

const STYLES = {
  container: `max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${COLORS.bg};`,
  mainCard: `background-color: ${COLORS.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);`,
  header: `background-color: ${COLORS.primary}; padding: 30px; text-align: center;`,
  logo: `font-size: 24px; font-weight: bold; color: ${COLORS.white}; text-decoration: none; letter-spacing: 1px;`,
  logoAccent: `color: ${COLORS.accent};`,
  body: `padding: 40px 30px;`,
  h1: `color: ${COLORS.primary}; margin: 0 0 20px; font-size: 22px; font-weight: 700;`,
  p: `color: ${COLORS.textLight}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;`,
  meetingBox: `background-color: #f8f9fa; border: 1px solid ${COLORS.border}; border-left: 5px solid ${COLORS.accent}; border-radius: 4px; padding: 20px; margin: 25px 0;`,
  meetingLabel: `display: block; font-size: 12px; text-transform: uppercase; color: ${COLORS.textLight}; font-weight: 600; margin-bottom: 4px;`,
  meetingValue: `display: block; font-size: 16px; color: ${COLORS.primary}; font-weight: 700; margin-bottom: 12px;`,
  button: `display: inline-block; background-color: ${COLORS.accent}; color: ${COLORS.white}; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;`,
  footer: `text-align: center; padding: 30px; color: #999999; font-size: 12px;`
};

export const sendContactNotifications = async (contact) => {
  try {
    // 1. Send confirmation email to the user
    const appName = 'Trivixa IT Solutions';
    const isMeeting = !!contact.meetingDate;
    const userSubject = isMeeting
      ? `Meeting Confirmed: ${contact.meetingType} on ${new Date(contact.meetingDate).toLocaleDateString()}`
      : `We received your message | ${appName}`;

    const userHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: ${COLORS.bg};">
        <div style="${STYLES.container}">
          <br>
          <div style="${STYLES.mainCard}">
            <div style="${STYLES.header}">
              <div style="${STYLES.logo}">TRIVIXA<span style="${STYLES.logoAccent}">.</span></div>
            </div>
            
            <div style="${STYLES.body}">
              <h2 style="${STYLES.h1}">Hello ${contact.name},</h2>
              
              ${isMeeting ? `
                <p style="${STYLES.p}">Your meeting request has been successfully scheduled. We are looking forward to discussing your project.</p>
                
                <div style="${STYLES.meetingBox}">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td width="50%" style="padding-bottom: 10px;">
                        <span style="${STYLES.meetingLabel}">DATE</span>
                        <span style="${STYLES.meetingValue}">${new Date(contact.meetingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </td>
                      <td width="50%" style="padding-bottom: 10px;">
                        <span style="${STYLES.meetingLabel}">TIME</span>
                        <span style="${STYLES.meetingValue}">${contact.meetingTime}</span>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <span style="${STYLES.meetingLabel}">TOPIC</span>
                        <span style="${STYLES.meetingValue}">${contact.meetingType || 'Initial Consultation'}</span>
                      </td>
                    </tr>
                  </table>
                </div>
                
                <p style="${STYLES.p}">A calendar invitation will follow shortly. If you need to reschedule, please reply to this email.</p>
              ` : `
                <p style="${STYLES.p}">Thank you for reaching out to <strong>${appName}</strong>. We have received your inquiry and our team is currently reviewing it.</p>
                <p style="${STYLES.p}">You can expect a response within 24 hours.</p>
                
                <div style="border-top: 1px solid ${COLORS.border}; margin: 20px 0;"></div>
                
                <p style="${STYLES.p} font-size: 14px; font-style: italic;">
                  "<strong>${contact.message || 'No message content'}</strong>"
                </p>
              `}
            </div>
          </div>
          
          <div style="${STYLES.footer}">
            <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
            <p>New Delhi, India | <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: ${COLORS.accent}; text-decoration: none;">Contact Support</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: contact.email,
      subject: userSubject,
      html: userHtml
    });

    // 2. Send notification to admin
    const adminSubject = isMeeting
      ? `📅 New Meeting: ${contact.name} (${new Date(contact.meetingDate).toLocaleDateString()})`
      : `🔔 New Lead: ${contact.name} - ${contact.subject || 'Web Inquiry'}`;
    
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: ${COLORS.bg};">
        <div style="${STYLES.container}">
          <br>
          <div style="${STYLES.mainCard}">
            <div style="${STYLES.header}; background-color: ${COLORS.white}; border-bottom: 3px solid ${COLORS.accent};">
               <h2 style="${STYLES.h1}; text-align: center;">New Submission Received</h2>
            </div>
            
            <div style="${STYLES.body}">
              
              <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: #f9f9f9; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td width="30%" style="font-weight: bold; color: ${COLORS.textLight}; border-bottom: 1px solid #eee;">Name</td>
                  <td style="color: ${COLORS.primary}; font-weight: 600; border-bottom: 1px solid #eee;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: ${COLORS.textLight}; border-bottom: 1px solid #eee;">Email</td>
                  <td style="color: ${COLORS.primary}; border-bottom: 1px solid #eee;"><a href="mailto:${contact.email}" style="color: ${COLORS.accent}; text-decoration: none;">${contact.email}</a></td>
                </tr>
                ${contact.phone ? `
                <tr>
                  <td style="font-weight: bold; color: ${COLORS.textLight}; border-bottom: 1px solid #eee;">Phone</td>
                  <td style="color: ${COLORS.primary}; border-bottom: 1px solid #eee;"><a href="tel:${contact.phone}" style="color: ${COLORS.primary}; text-decoration: none;">${contact.phone}</a></td>
                </tr>` : ''}
                ${contact.company ? `
                <tr>
                  <td style="font-weight: bold; color: ${COLORS.textLight}; border-bottom: 1px solid #eee;">Company</td>
                  <td style="color: ${COLORS.primary}; border-bottom: 1px solid #eee;">${contact.company}</td>
                </tr>` : ''}
              </table>

              ${isMeeting ? `
                <div style="${STYLES.meetingBox}">
                  <h3 style="margin-top: 0; color: ${COLORS.primary}; font-size: 18px;">🗓️ Meeting Request</h3>
                  <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(contact.meetingDate).toLocaleDateString()}</p>
                  <p style="margin: 5px 0;"><strong>Time:</strong> ${contact.meetingTime}</p>
                  <p style="margin: 5px 0;"><strong>Type:</strong> ${contact.meetingType}</p>
                </div>
              ` : ''}

              <h3 style="${STYLES.h1}; font-size: 18px; margin-top: 20px;">Message:</h3>
              <p style="background-color: #f0f4f8; padding: 15px; border-radius: 4px; color: ${COLORS.text}; font-style: italic;">
                "${contact.message || 'No additional message provided.'}"
              </p>

              ${contact.courseTitle ? `
                <div style="margin-top: 20px; padding: 10px; border: 1px dashed ${COLORS.accent}; border-radius: 4px;">
                  <strong>Interested Course:</strong> ${contact.courseTitle}
                </div>
              ` : ''}

              <div style="margin-top: 30px; text-align: center;">
                <a href="mailto:${contact.email}?subject=Re: ${isMeeting ? 'Your Meeting Request' : 'Your Inquiry'} - ${appName}" style="${STYLES.button}">Reply to Client</a>
              </div>
              
              <div style="margin-top: 20px; font-size: 11px; color: #aaa; text-align: center;">
                IP: ${contact.ipAddress || 'Unknown'} | Agent: ${contact.userAgent || 'Unknown'}
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: adminSubject,
      html: adminHtml
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending contact notifications:', error);
    throw error;
  }
};

/**
 * Send proposal emails to multiple colleges
 * @param {Array<string>} emailList - Array of recipient email addresses
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {Object} [attachments] - Optional attachments
 * @returns {Promise<Array>} - Array of results for each email sent
 */
export const sendBulkEmails = async (emailList, subject, htmlContent, attachments = []) => {
  const results = [];
  
  for (const email of emailList) {
    try {
      await sendEmail({
        to: email,
        subject,
        html: htmlContent,
        attachments
      });
      results.push({ email, status: 'success', message: 'Email sent successfully' });
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      results.push({ 
        email, 
        status: 'error', 
        message: error.message || 'Failed to send email' 
      });
    }
  }
  
  return results;
};

export default {
  sendEmail,
  sendCoursePdfEmail,
  sendContactNotifications,
  sendBulkEmails
};
