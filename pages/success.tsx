import Link from "next/link";
import { useEffect } from "react";
import { BsBagCheckFill } from "react-icons/bs";
import useStore from "../store/store";

const Success = () => {
  useEffect(() => {
    // @ts-ignore
    useStore.persist.clearStorage();
  }, []);

  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className="email-msg">Check you email inbox for your receipt</p>
        <p className="description">
          If you have any question, please email
          <a href="mailto:order@example.com" className="email">
            order@example.com
          </a>
        </p>
        <Link href="/">
          <a>
            <button type="button" style={{ width: "500px" }} className="btn">
              Continue Shopping
            </button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Success;
