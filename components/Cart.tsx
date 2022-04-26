/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { MouseEventHandler, useCallback, useEffect, useRef } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai";
import { TiDelete, TiDeleteOutline } from "react-icons/ti";
import useStore from "../store/store";
import shallow from "zustand/shallow";
import { urlFor } from "../lib/client";

import getStripe from "../lib/getStripe";
import toast from "react-hot-toast";

const Cart = () => {
  const cartRef = useRef<HTMLDivElement | null>(null);
  const backButtonRef = useRef<HTMLButtonElement | null>(null);
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    incCartItemQty,
    decCartItemQty,
    handleRemoveItem,
  } = useStore(
    (state) => ({
      totalPrice: state.totalPrice,
      totalQuantities: state.totalQuantities,
      cartItems: state.cartItems,
      setShowCart: state.setShowCart,
      incCartItemQty: state.incCartItemQty,
      decCartItemQty: state.decCartItemQty,
      handleRemoveItem: state.handleRemoveItem,
    }),
    shallow
  );
  async function handleCheckout() {
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
  }
  const handleCloseCart: MouseEventHandler = useCallback(
    (e) => {
      setShowCart(false);
    },
    [setShowCart]
  );
  const displayTotalPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(+totalPrice);

  // useEffect(() => {

  // }, []);

  return (
    <div className="cart-wrapper" ref={cartRef} onClick={() => {}}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          ref={backButtonRef}
          onClick={handleCloseCart}
        >
          <AiOutlineLeft />
          <span className="heading">Your cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>
        {cartItems.length < 1 && (
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href="/">
              <a>
                <button type="submit" onClick={handleCloseCart} className="btn">
                  Continue shopping
                </button>
              </a>
            </Link>
          </div>
        )}
        <div className="product-container">
          {cartItems.length >= 1 &&
            cartItems.map((item, idx) => {
              const displayPrice = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(+item.price);

              return (
                <div className="product" key={item._id}>
                  <img
                    src={urlFor(item?.image[0]) as unknown as string}
                    alt={item.name}
                    className="cart-product-image"
                  />
                  <div className="item-desc">
                    <div className="flex top">
                      <h5>{item.name}</h5>
                      <h4>{displayPrice}</h4>
                    </div>
                    <div className="flex bottom">
                      <div>
                        <p className="quantity-desc">
                          <button
                            type="button"
                            className="minus"
                            onClick={decCartItemQty(item._id, item.quantity)}
                          >
                            <AiOutlineMinus />
                          </button>
                          <span className="num">{item.quantity}</span>
                          <button
                            type="button"
                            className="plus"
                            onClick={incCartItemQty(item._id)}
                          >
                            <AiOutlinePlus />
                          </button>
                        </p>
                      </div>
                      <button
                        type="button"
                        className="remove-item"
                        onClick={handleRemoveItem(item._id)}
                      >
                        <TiDeleteOutline />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>{displayTotalPrice}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Pay with Stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
