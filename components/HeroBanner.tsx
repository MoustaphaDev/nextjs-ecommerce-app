/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { urlFor } from "../lib/client";

const HeroBanner = ({ banner }: { banner: any }) => {
  return (
    <div className="hero-banner-container">
      <div>
        <p className="beats-solo">{banner.smallText}</p>
        <h3>{banner.midText}</h3>
        <h1>{banner.largeText1}</h1>
        <img
          src={urlFor(banner.image) as unknown as string}
          alt="headphones"
          className="hero-banner-image"
        />
        <div>
          <Link href={`/products/${banner.product}`}>
            <a>
              <button> {banner.buttonText}</button>
            </a>
          </Link>
          <div className="desc">
            <h5>description</h5>
            <p>{banner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
