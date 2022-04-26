import Link from "next/link";
import { urlFor } from "../lib/client";

const Product = ({ product: { image, name, slug, price } }: any) => {
  const displayPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(+price);

  return (
    <div>
      <Link href={`/products/${slug.current}`}>
        <a>
          <div className="product-card">
            <img
              src={urlFor(image && image[0]) as unknown as string}
              width={250}
              height={250}
              className="product-image"
              alt={name}
            />
            <p className="product-name">{name}</p>
            <p className="product-price">{displayPrice}</p>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default Product;
