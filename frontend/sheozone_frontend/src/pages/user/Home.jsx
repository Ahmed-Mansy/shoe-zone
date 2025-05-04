import { useState , useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-toastify";

// const categories = [
//   {
//     id: 1,
//     name: "Category 1",
//     description: "Category 1 Description",
//     image: "/assets/images/cat1.jpg",
//   },
//   {
//     id: 2,
//     name: "Category 2",
//     description: "Category 2 Description",
//     image: "/assets/images/cat2.jpg",
//   },
//   {
//     id: 3,
//     name: "Category 3",
//     description: "Category 3 Description",
//     image: "/assets/images/cat3.jpg",
//   },
// ];

const Home = () => {
  // const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  const [topRated, setTopRated] = useState([]);
  const [latest, setLatest] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/products/home/')
      .then(res => {
        setTopRated(res.data.top_rated);
        setLatest(res.data.latest);
      })
      .catch(err => console.error(err));
  }, []);


  return (
    <div>
      <div className="w-full">
        <img
          src="/assets/images/banner.jpg"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-5 my-5 px-10 py-10 ">
        {/* Top Rated Section */}
        <section className="mb-10 ">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center ">Top Rated Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {topRated.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Latest Products Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Latest Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {latest.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>


      {/* <div className="wrapper mt-10 flex justify-start gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="w-[calc(100%/3-32px/3)] relative"
            onMouseEnter={() => setShowButton(true)}
            onMouseLeave={() => setShowButton(false)}>
            <div className="w-full">
              <img
                src={category.image}
                alt={category.name}
                className="w-full"
              />
            </div>
            <div className="absolute z-1 top-0 left-0 w-full h-full  hover:bg-black/40 transform duration-500 flex flex-col justify-between items-center py-16 text-light">
              <div className="text-center space-y-4">
                <h2 className=" text-2xl font-semibold">{category.name}</h2>
                <p className="text-lg">{category.description}</p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => navigate(`/collections/${category.id}`)}
                  className={`uppercase cursor-pointer bg-white text-black hover:bg-black hover:text-white font-medium text-medium tracking-wider rounded-xs px-6 py-2 transform duration-500 ${
                    showButton ? "" : "hidden"
                  }`}>
                  shop now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      <div className="w-full mt-10 relative">
        <img src="/assets/images/bg.jpg" className="w-full" />
        <div className="absolute top-0 left- w-full h-full flex-center">
          <div className="text-center space-y-6 w-1/2 text-white">
            <h2 className="text-base font-medium uppercase tracking-wider lg:text-2xl ">
              We Make Better Things In A Better Way
            </h2>
            <p className="text-base font-medium tracking-wide">
              By looking to the world’s greatest innovator—Nature—we create
              shoes that deliver unrivaled comfort that you feel good in and
              feel good about.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
