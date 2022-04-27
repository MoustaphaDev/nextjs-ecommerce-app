import toast from "react-hot-toast";
import { CartItem } from "../store/store";
import getStripe from "./getStripe";

function handleCheckout({ cartItems }: { cartItems: CartItem[] }) {
  return async () => {
    const stripe = await getStripe();
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItems }),
    };
    const response = await fetch("/api/stripe", options);

    if (response.status === 500) return;
    const data = await response.json();
    toast.loading("Redirecting...");
    stripe?.redirectToCheckout({ sessionId: data.id });
  };
}

export default handleCheckout;
