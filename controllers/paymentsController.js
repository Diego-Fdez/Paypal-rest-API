import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * It creates an order and returns the order ID.
 * @param req - The request object.
 * @param res - The response object.
 * @returns The response is a JSON object with the following properties:
 */
export const createOrder = async (req, res) => {
  try {
    /* This is the body of the request. */
    const order = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '105.70',
          },
        },
      ],
      application_context: {
        brand_name: 'mycompany.com',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.HOST}/getting-order`,
        cancel_url: `${process.env.HOST}/cancel-payment`,
      },
    };

    // format the body
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(process.env.PAYPAL_TOKEN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.PAYPAL_API_CLIENT,
        password: process.env.PAYPAL_API_SECRET,
      },
    });

    // make a request
    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    console.log(response.data);

    return res.json(response.data);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json('Something goes wrong');
  }
};

/**
 * It takes the token and PayerID from the query string, then sends a POST request to the PayPal API to
 * capture the payment.
 * @param req - The request object.
 * @param res - The response object.
 */
export const gettingOrder = async (req, res) => {
  try {
    const { token, PayerID } = req.query;

    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: process.env.PAYPAL_API_CLIENT,
          password: process.env.PAYPAL_API_SECRET,
        },
      }
    );
    console.log(response.data);
    res.redirect('/payed.html');
  } catch (error) {
    console.log(error.message);
    res.status(500).json('Internal server error');
  }
};

/**
 * It takes a request and a response, and then redirects the user to the home page.
 * @param req - The request object represents the HTTP request and has properties for the request query
 * string, parameters, body, HTTP headers, and so on.
 * @param res - The response object.
 */
export const cancelOrder = (req, res) => {
  res.redirect('/');
};
