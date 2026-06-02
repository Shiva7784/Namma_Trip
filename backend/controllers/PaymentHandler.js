const express = require('express');
const axios = require('axios');
const { jsPDF } = require('jspdf');
require('jspdf-autotable');
const { body, validationResult } = require('express-validator');

// Store additional order info in memory (use DB in production)
const orderExtras = new Map(); // key: orderId, value: { address, city }

const router = express.Router();
const logo = require("./logo"); // adjust the path to your logo.js file


const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// ✅ PDF Generator
const generatePaymentSuccessPDF = async (paymentDetails) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Modern color scheme (without gradients)
    const colors = {
      primary: [41, 128, 185],
      primaryLight: [100, 181, 246],
      secondary: [52, 73, 94],
      success: [46, 204, 113],
      danger: [231, 76, 60],
      background: [248, 249, 250],
      white: [255, 255, 255],
      accent: [255, 193, 7]
    };

    // Creative background with subtle elements
    doc.setFillColor(...colors.background);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Decorative corner elements (simplified)
    doc.setFillColor(...colors.primaryLight);
    doc.circle(10, 10, 30, 'F');
    doc.circle(pageWidth - 10, pageHeight - 10, 30, 'F');
    
    // Modern watermark
    doc.setTextColor(230, 230, 230);
    doc.setFontSize(48);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: -15,
      opacity: 0.1
    });

    // Header with solid color (replacing gradient)
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 80, 'F');
    
    // Logo placement with shadow effect
    const imgWidth = 70;
    const imgHeight = 25;
    const xPos = (pageWidth - imgWidth) / 2;
    
    if (logo) {
      try {
        // Add shadow
        doc.setFillColor(0, 0, 0, 20);
        doc.roundedRect(xPos + 2, 22 + 2, imgWidth, imgHeight, 3, 3, 'F');
        // Add logo
        doc.addImage(logo, 'JPEG', xPos, 22, imgWidth, imgHeight);
      } catch (e) {
        console.warn('Could not add logo:', e.message);
      }
    }

    // Creative title with accent
    doc.setFontSize(26);
    doc.setTextColor(...colors.white);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT CONFIRMATION', pageWidth / 2, 60, { align: 'center' });
    
    // Add decorative line under title
    doc.setDrawColor(...colors.accent);
    doc.setLineWidth(1.5);
    doc.line(pageWidth/2 - 60, 65, pageWidth/2 + 60, 65);

    let yPosition = 85;

    // Payment summary card with shadow
    doc.setFillColor(...colors.white);
    doc.setDrawColor(200, 200, 200);
    // Shadow effect
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(22, yPosition + 2, pageWidth - 44, 80, 5, 5, 'F');
    // Main card
    doc.setFillColor(...colors.white);
    doc.roundedRect(20, yPosition, pageWidth - 40, 80, 5, 5, 'FD');
    
    // Amount display with currency symbol
    doc.setFontSize(32);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('INR', 30, yPosition + 30);
    doc.text(`${formatCurrency(paymentDetails.amount || '0.00')}`, 50, yPosition + 30);

    // Payment status as a ribbon (simplified)
    const status = paymentDetails.paymentStatus || 'Completed';
    const isSuccess = !['Failed', 'Cancelled', 'Declined'].includes(status);
    const statusColor = isSuccess ? colors.success : colors.danger;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const statusWidth = doc.getStringUnitWidth(status) * 6 + 24;
    
    // Simplified ribbon shape (rectangle with triangle)
    doc.setFillColor(...statusColor);
    doc.roundedRect(pageWidth - 30 - statusWidth, yPosition, statusWidth, 25, 3, 3, 'F');
    // Triangle part
    doc.triangle(
      pageWidth - 30 - statusWidth, yPosition + 25,
      pageWidth - 30 - statusWidth + 15, yPosition + 12.5,
      pageWidth - 30 - statusWidth, yPosition,
      'F'
    );
    
    doc.setTextColor(...colors.white);
    doc.text(status.toUpperCase(), pageWidth - 30 - statusWidth/2, yPosition + 16, { align: 'center' });

    // Transaction details
    doc.setFontSize(12);
    doc.setTextColor(...colors.secondary);
    doc.text(`Transaction ID: ${paymentDetails.orderId || 'N/A'}`, pageWidth - 30 - statusWidth - 20, yPosition + 20);
    
    const transactionDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Date: ${transactionDate}`, pageWidth - 30 - statusWidth - 20, yPosition + 30);

    yPosition += 90;

    // Customer information in modern card layout
    doc.setFillColor(...colors.white);
    doc.roundedRect(20, yPosition, pageWidth - 40, 120, 5, 5, 'FD');
    
    // Section title with icon placeholder
    doc.setFontSize(16);
    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS', 30, yPosition + 15);
    
    // Divider line
    doc.setDrawColor(...colors.primaryLight);
    doc.setLineWidth(0.5);
    doc.line(30, yPosition + 20, pageWidth - 30, yPosition + 20);

    // Customer info in two columns
    const customerInfo = [
      { label: 'Name', value: paymentDetails.name || 'N/A' },
      { label: 'Email', value: paymentDetails.email || 'N/A' },
      { label: 'Phone', value: paymentDetails.phone || 'N/A' },
      { label: 'Address', value: paymentDetails.address || 'N/A' },
      { label: 'City', value: paymentDetails.city || 'N/A' },
      { label: 'Country', value: paymentDetails.country || 'N/A' }
    ];

    let infoY = yPosition + 35;
    customerInfo.forEach((info, index) => {
      const col = index % 2 === 0 ? 30 : pageWidth / 2 + 2;
      if (index % 2 === 0 && index !== 0) infoY += 20;
      
      doc.setFontSize(9);
      doc.setTextColor(...colors.secondary);
      doc.text(`${info.label}:`, col, infoY);
      
      doc.setFont('helvetica', 'normal');
      doc.text(info.value, col + 20, infoY);
    });

    yPosition += 130;

    // Thank you section with creative design
    doc.setFillColor(...colors.primaryLight);
    doc.roundedRect(20, yPosition, pageWidth - 40, 40, 5, 5, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(...colors.white);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for your payment!', pageWidth / 2, yPosition + 15, { align: 'center' });
    
    doc.setFontSize(11);
    doc.text('We appreciate your business. Your support means everything to us!', 
      pageWidth / 2, yPosition + 25, { align: 'center' });

    // Footer with creative elements
    doc.setFillColor(...colors.primary);
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(...colors.white);
    doc.text('Need help? Contact our support team at support@example.com', 
      pageWidth / 2, pageHeight - 20, { align: 'center' });
    
    doc.text(`© ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'Your Company'}. All rights reserved.`,
      pageWidth / 2, pageHeight - 10, { align: 'center' });

    return doc.output('arraybuffer');
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate receipt: ' + error.message);
  }
};

// Enhanced currency formatting
function formatCurrency(amount) {
  const num = parseFloat(amount || 0);
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}


// ✅ Fetch Order Helper
const fetchOrderDetails = async (orderId) => {
  try {
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          'x-api-version': '2022-09-01',
          'x-client-id': APP_ID,
          'x-client-secret': SECRET_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error?.response?.data || error.message);
    throw new Error('Failed to fetch order details');
  }
};

// ✅ Create Order Route
router.post('/create-order', [
  body('amount').isNumeric().withMessage('Amount must be a number')
    .isFloat({ min: 100, max: 100000 }).withMessage('Amount must be between ₹100 and ₹10,000'),
  body('customerPhone').matches(/^[6-9]\d{9}$/).withMessage('Phone must be valid 10 digits'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }

  const {
    amount,
    customerId,
    customerEmail,
    customerPhone,
    firstName,
    lastName,
    address,
    city
  } = req.body;

  const orderId = 'order_' + Math.random().toString(36).substring(2, 15);

  const payload = {
    order_id: orderId,
    order_amount: amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: customerId,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_name: `${firstName} ${lastName}`
    },
    order_meta: {
      return_url: `${process.env.FRONTEND_URL}/payment-success?order_id={order_id}`
    }
  };

  try {
    const response = await axios.post(
      'https://sandbox.cashfree.com/pg/orders',
      payload,
      {
        headers: {
          'x-api-version': '2022-09-01',
          'Content-Type': 'application/json',
          'x-client-id': APP_ID,
          'x-client-secret': SECRET_KEY,
        }
      }
    );

   // ✅ Use Cashfree-confirmed order ID here
  const confirmedOrderId = response.data.order_id;
  orderExtras.set(confirmedOrderId, { address, city }); 
  console.log("Saving extras for order:", confirmedOrderId, { address, city });


    res.json({
      payment_session_id: response.data.payment_session_id,
      paymentUrl: response.data.payments?.url,
      order_amount: response.data.order_amount,
      order_id: confirmedOrderId,
    });
  } catch (error) {
    console.error('Create order failed:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Payment order creation failed',
      error: error.response?.data || error.message
    });
  }
});

// ✅ Fetch Order API
router.get("/fetch-order/:orderId", async (req, res) => {
  try {
    const order = await fetchOrderDetails(req.params.orderId);
    const extras = orderExtras.get(req.params.orderId) || {};
    res.json({ ...order, ...extras }); // ✅ Return extras if needed by frontend
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
});

// ✅ PDF Receipt Download
router.get("/receipt/:orderId", async (req, res) => {
  try {
    const order = await fetchOrderDetails(req.params.orderId);
    const extras = orderExtras.get(req.params.orderId) || {};
    console.log("Fetched extras:", extras);

    const payload = {
      orderId: order.order_id,
      name: order.customer_details.customer_name,
      email: order.customer_details.customer_email,
      phone: order.customer_details.customer_phone,
      amount: order.order_amount,
      address: extras.address || 'N/A',
      city: extras.city || 'N/A',
      country: 'India',
      paymentStatus: order.order_status
    };

    const pdfBuffer = await generatePaymentSuccessPDF(payload);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=receipt_${order.order_id}.pdf`
    });

    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error('Receipt generation error:', error);
    res.status(500).json({
      error: 'Failed to generate receipt',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
