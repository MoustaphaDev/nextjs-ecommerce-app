import Link from "next/link";
import { AiOutlineShopping } from "react-icons/ai";
import shallow from "zustand/shallow";
import useStore from "../store/store";
import { Cart } from "./";

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStore(
    (state) => ({
      showCart: state.showCart,
      setShowCart: state.setShowCart,
      totalQuantities: state.totalQuantities,
    }),
    shallow
  );
  const handleShowCart = () => {
    setShowCart(true);
  };
  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href="/">JSM Headphones</Link>
      </p>
      <button type="button" className="cart-icon" onClick={handleShowCart}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>
      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
