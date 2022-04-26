import groq from "groq";

export default groq`*[_type == "product"][0...10]`;
