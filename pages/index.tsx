import { InferGetStaticPropsType } from "next";
import { HeroBanner, FooterBanner, Product } from "../components";
import { client } from "../lib/client";
import allProductsQuery from "../sanity-queries/allProductsQuery";
import bannerQuery from "../sanity-queries/bannerQuery";

const Home = ({
  bannerData,
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <HeroBanner banner={bannerData.length && bannerData[0]} />
      <div className="products-heading">
        <h2>Best selling product</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {products?.map((product: any) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <FooterBanner banner={bannerData && bannerData[0]} />
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const products = await client.fetch(allProductsQuery);

  const bannerData: Array<any> = await client.fetch(bannerQuery);
  return {
    props: {
      products,
      bannerData,
    },
  };
};
