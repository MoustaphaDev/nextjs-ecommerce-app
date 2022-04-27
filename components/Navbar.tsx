import Link from "next/link";
import { useState } from "react";
import { AiOutlineShopping } from "react-icons/ai";
import shallow from "zustand/shallow";
import useStore from "../store/store";
import { Cart } from "./";

const Navbar = () => {
  const [showCart, setShowCart] = useState(false);
  function handleCloseCart() {
    setShowCart(false);
  }
  function handleOpenCart() {
    setShowCart(true);
  }

  const { totalQuantities } = useStore(
    (state) => ({
      totalQuantities: state.totalQuantities,
    }),
    shallow
  );

  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">JSM Headphones</Link>
      </p>
      <button type="button" className="cart-icon" onClick={handleOpenCart}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>
      {showCart && <Cart handleCloseCart={handleCloseCart} />}
    </div>
  );
};

export default Navbar;
