const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // Check if SMTP is configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured, email service disabled');
    return null;
  }
  
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send enterprise contact email
const sendEnterpriseContactEmail = async (email, content, budget) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email service disabled - SMTP not configured');
      return { success: true, message: 'Email service disabled' };
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'support@smartreportpro.aizetecc.com',
      subject: 'New Enterprise Contact Inquiry',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">New Enterprise Contact Inquiry</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Requirements</h3>
            <div style="white-space: pre-wrap; line-height: 1.6;">${content}</div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-left: 4px solid #3B82F6; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af;"><strong>Action Required:</strong> Please contact the customer within 24 hours to discuss their requirements.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Enterprise contact email sent:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending enterprise contact email:', error);
    throw error;
  }
};

// Send payment approval email
const sendPaymentApprovalEmail = async (userEmail, plan) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email service disabled - SMTP not configured');
      return { success: true, message: 'Email service disabled' };
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: 'Payment Approved - SmartReport Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">Payment Approved! 🎉</h2>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <h3 style="color: #166534; margin-top: 0;">Your ${plan} subscription is now active!</h3>
            <p style="color: #166534; margin-bottom: 0;">You can now access all the features included in your plan.</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">What's Next?</h3>
            <ul style="color: #6b7280; line-height: 1.6;">
              <li>Log in to your dashboard</li>
              <li>Explore your new features</li>
              <li>Start creating professional reports</li>
              <li>Contact support if you need any help</li>
            </ul>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://smartreportpro.aizetecc.com/dashboard" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Payment approval email sent:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending payment approval email:', error);
    throw error;
  }
};

// Send payment rejection email
const sendPaymentRejectionEmail = async (userEmail, plan, reason) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email service disabled - SMTP not configured');
      return { success: true, message: 'Email service disabled' };
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: 'Payment Review - SmartReport Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EF4444;">Payment Review Required</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444;">
            <h3 style="color: #dc2626; margin-top: 0;">Your payment for ${plan} plan needs attention</h3>
            <p style="color: #dc2626; margin-bottom: 0;">We couldn't verify your payment. Please check the details and try again.</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Reason:</h3>
            <p style="color: #6b7280; line-height: 1.6;">${reason}</p>
            
            <h3 style="color: #374151;">What to do next:</h3>
            <ul style="color: #6b7280; line-height: 1.6;">
              <li>Double-check your payment details</li>
              <li>Ensure the transaction ID is correct</li>
              <li>Make sure the payment proof is clear and readable</li>
              <li>Submit a new payment request if needed</li>
            </ul>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://smartreportpro.aizetecc.com/dashboard" 
               style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Payment rejection email sent:', result.messageId);
    return result;

  } catch (error) {
    console.error('Error sending payment rejection email:', error);
    throw error;
  }
};

module.exports = {
  sendEnterpriseContactEmail,
  sendPaymentApprovalEmail,
  sendPaymentRejectionEmail
};
