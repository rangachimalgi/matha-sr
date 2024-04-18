import { Fragment } from "react";
import Wrapper from "../components/wrapper/Wrapper";
import Section from "../components/Section";
import { products, discoutProducts } from "../utils/products";
import SliderHome from "../components/Slider";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";

const Home = () => {
  const newArrivalData = products.filter(
    (item) => item.category === "mobile" || item.category === "wireless"
  );
  const bestSales = products.filter((item) => item.category === "sofa");
  useWindowScrollToTop();
  return (
    <div>
       <h1>Sri Raghavendra Swamy Vrindavana samithi</h1>
      <br />
      <h1>3-4-183, Bagh Lingampally, Kachiguda, Hyderabad-500 027</h1>
      <h1>Ph: No 040-27565333</h1>
      <h1>Email: srsvs@yahoo.com</h1>
    </div>
  );
};

export default Home;
