import groq from "groq";
const productDetailsQuery = (slug: string) =>
  groq`*[_type == "product" && slug.current == "${slug}"][0]`;

export default productDetailsQuery;
