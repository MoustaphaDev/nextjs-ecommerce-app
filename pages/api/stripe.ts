import { NextApiHandler } from "next";
import Stripe from "stripe";
import { CartItem } from "../../store/store";

type LineItems = Stripe.Checkout.SessionCreateParams.LineItem[] | undefined;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
  typescript: true,
});
type CartItems = CartItem[];
const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const { cartItems }: { cartItems: CartItems } = req.body;
    const line_items: LineItems = cartItems.map((item) => {
      const imgRef: string = item.image[0].asset._ref;
      const imgUrl = imgRef
        .replace(
          "image-",
          `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJEC_ID}/production/`
        )
        .replace("-webp", ".webp");
      console.log(imgUrl);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [imgUrl],
          },
          unit_amount: item.price * 100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });
    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        line_items: line_items,
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          {
            shipping_rate: process.env.STRIPE_FREE_SHIPPING_RATE_ID,
          },
          {
            shipping_rate: process.env.STRIPE_FAST_SHIPPING_RATE_ID,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default handler;
