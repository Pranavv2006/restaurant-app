const { PlaceOrderService } = require("../services/PlaceOrderService");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dinedashorder@gmail.com",
    pass: "jzsvsrzyddflypch",
  },
});

const placeOrderController = async (req, res) => {
  const { customerId, restaurantId, items, customerEmail } = req.body;

  // Validate required parameters
  if (!customerId) {
    return res.status(400).json({
      success: false,
      message: "Customer ID is required.",
    });
  }

  if (!restaurantId) {
    return res.status(400).json({
      success: false,
      message: "Restaurant ID is required.",
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one item is required to place an order.",
    });
  }

  // Validate customer ID and restaurant ID are numbers
  const custId = parseInt(customerId);
  const restId = parseInt(restaurantId);

  if (isNaN(custId) || custId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid customer ID. Must be a positive integer.",
    });
  }

  if (isNaN(restId) || restId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid restaurant ID. Must be a positive integer.",
    });
  }

  // Validate items array structure
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    if (!item.id || !item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} is missing required fields (id, quantity).`,
      });
    }

    const itemId = parseInt(item.id);
    const quantity = parseInt(item.quantity);

    if (isNaN(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} has invalid ID. Must be a positive integer.`,
      });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: `Item at index ${i} has invalid quantity. Must be a positive integer.`,
      });
    }

    // Update the item with validated values
    items[i] = { id: itemId, quantity: quantity };
  }

  const formatCurrency = (amount) => `${Number(amount).toFixed(2)}`;

  const formatDate = (date) => date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  try {
    const result = await PlaceOrderService({
      customerId: custId,
      restaurantId: restId,
      items: items,
    });

    if (result.success) {
      const { data, message } = result; 
      
      const htmlBody = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 600;">Order Confirmed!</h1>
                      <p style="margin: 10px 0 0 0; color: #f0f0f0; font-size: 16px;">Order #${data.orderId}</p>
                    </td>
                  </tr>

                  <!-- Message Section -->
                  <tr>
                    <td style="padding: 40px 30px; text-align: center;">
                      <div style="background-color: #f8f9ff; border-left: 4px solid #667eea; padding: 20px; border-radius: 6px; text-align: left;">
                        <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.6;">${message}</p>
                      </div>
                    </td>
                  </tr>

                  <!-- Order Details -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-weight: 600;">Order Details</h2>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                            <strong style="color: #555555;">Delivery Address:</strong>
                          </td>
                          <td style="padding: 15px; background-color: #f8f9fa; text-align: right; border-bottom: 1px solid #e9ecef;">
                            <span style="color: #333333;">${data.address}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                            <strong style="color: #555555;">Order Date:</strong>
                          </td>
                          <td style="padding: 15px; background-color: #f8f9fa; text-align: right; border-bottom: 1px solid #e9ecef;">
                            <span style="color: #333333;">${formatDate(data.orderDate)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 15px; background-color: #ffffff; border-bottom: 1px solid #e9ecef;">
                            <strong style="color: #555555;">Status:</strong>
                          </td>
                          <td style="padding: 15px; background-color: #ffffff; text-align: right; border-bottom: 1px solid #e9ecef;">
                            <span style="display: inline-block; padding: 6px 12px; background-color: #fef3c7; color: #92400e; border-radius: 20px; font-size: 14px; font-weight: 600;">${data.status}</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Price Breakdown -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 10px 0; color: #555555; font-size: 16px;">Subtotal:</td>
                            <td style="padding: 10px 0; text-align: right; color: #333333; font-size: 16px;">₹${formatCurrency(data.total - data.deliveryFee)}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; color: #555555; font-size: 16px;">Delivery Fee:</td>
                            <td style="padding: 10px 0; text-align: right; color: #333333; font-size: 16px;">₹${formatCurrency(data.deliveryFee)}</td>
                          </tr>
                          <tr>
                            <td colspan="2" style="padding: 15px 0 10px 0; border-top: 2px solid #667eea;"></td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; color: #333333; font-size: 20px; font-weight: 700;">Total:</td>
                            <td style="padding: 10px 0; text-align: right; color: #667eea; font-size: 24px; font-weight: 700;">₹${formatCurrency(data.total)}</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>

                  <!-- CTA Button -->
                  <tr>
                    <td style="padding: 0 30px 40px 30px; text-align: center;">
                      <a href="#" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 30px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">Track Your Order</a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e9ecef;">
                      <p style="margin: 0 0 10px 0; color: #888888; font-size: 14px;">Questions? Contact us at support@dinedash.com</p>
                      <p style="margin: 0; color: #aaaaaa; font-size: 12px;">© 2025 DineDash. All rights reserved.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const textBody = `
        Order Confirmation - Order #${data.orderId}

        ${message}

        Order Details:
        - Order Date: ${formatDate(data.orderDate)}
        - Status: ${data.status}
        - Delivery Address: ${data.address}

        Price Breakdown:
        - Subtotal: ₹${formatCurrency(data.total - data.deliveryFee)}
        - Delivery Fee: ₹${formatCurrency(data.deliveryFee)}
        - Total: ₹${formatCurrency(data.total)}

        Track your order: [link]

        Questions? Contact us at support@dinedash.com
        © 2025 DineDash. All rights reserved.
      `;

      const info = await transporter.sendMail({
        from: '"DineDash" <dinedashorder@gmail.com>',
        to: customerEmail,
        subject: `Order Confirmation #${data.orderId} ✔`,
        text: textBody,
        html: htmlBody,
      });

      return res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }
  } catch (error) {
    console.error("PlaceOrder Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error while placing the order.",
    });
  }
};

module.exports = { placeOrderController };
