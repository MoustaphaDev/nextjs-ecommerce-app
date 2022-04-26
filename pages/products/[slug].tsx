/* eslint-disable @next/next/no-img-element */
import groq from "groq";
import { GetStaticProps } from "next";
import { client, urlFor } from "../../lib/client";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";
import { useState } from "react";
import cn from "classnames";
import similarProductsQuery from "../../sanity-queries/similarProductsQuery";
import productDetailsQuery from "../../sanity-queries/productDetailsQuery";
import useStore from "../../store/store";
import shallow from "zustand/shallow";

const ProductDetails = ({ product, similarProducts }: any) => {
  const { onAdd } = useStore(
    (state) => ({
      onAdd: state.onAdd,
    }),
    shallow
  );
  const { image, name, details, price } = product;
  const displayPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(+price);
  const [imageIndex, setImageIndex] = useState(0);
  const handleChangeImage = (index: number) => () => setImageIndex(index);

  const [qty, setQty] = useState(1);
  const handleIncQty = () => setQty(qty + 1);
  const handleDecQty = () => qty - 1 > 0 && setQty(qty - 1);

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[imageIndex]) as unknown as string}
              alt={name}
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {(image as Array<Array<string>>)?.map((item, idx) => (
              <img
                key={idx}
                src={urlFor(item) as unknown as string}
                alt={name}
                className={cn(
                  imageIndex === idx && "selected-image",
                  "small-image"
                )}
                onMouseEnter={handleChangeImage(idx)}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1> {name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details</h4>
          <p>{details}</p>
          <p className="price">{displayPrice}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc" style={{ userSelect: "none" }}>
              <button type="button" className="minus" onClick={handleDecQty}>
                <AiOutlineMinus />
              </button>
              <span className="num">{qty}</span>
              <button type="button" className="plus" onClick={handleIncQty}>
                <AiOutlinePlus />
              </button>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={onAdd(product, qty)}
            >
              Add to cart
            </button>
            <button type="button" className="buy-now">
              Buy now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {(similarProducts as Array<any>)?.map((item: any) => (
              <Product product={item} key={item._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  const product = await client.fetch(productDetailsQuery(slug as string));

  const similarProducts: Array<any> = await client.fetch(similarProductsQuery);
  return {
    props: {
      product,
      similarProducts,
    },
  };
};

export async function getStaticPaths() {
  const query = groq`*[_type == "product"]{
    slug{
      current
    }
  }`;
  const products = await client.fetch(query);
  const paths = products.map((product: { slug: { current: string } }) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}
