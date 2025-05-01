import { Link, useParams } from "react-router";
import CollectionSidebar from "../../components/CollectionSidebar";
import ProductsList from "../../components/ProductsList";
import data from "../../data.json";

const Collection = () => {
  const { collectionTitle } = useParams();

  return (
    <div className="wrapper py-10">
      <div className="flex-between pb-2">
        <div className="text-xs font-medium capitalize">
          <span>Home / </span>
          <span>{collectionTitle} / </span>
        </div>
        <div className="border border-gray-300 rounded-full p-[2px] uppercase flex-center gap-1">
          <span
            className={`block rounded-full py-[2px] px-[4px] cursor-pointer w-[80px] font-medium text-center text-md ${
              collectionTitle == "women" ? "bg-primary text-light" : ""
            }`}>
            <Link to="/collections/women">women</Link>
          </span>
          <span
            className={`block rounded-full py-[2px] px-[4px] cursor-pointer w-[80px] font-medium text-center text-md ${
              collectionTitle == "men" ? "bg-primary text-light" : ""
            }`}>
            <Link to="/collections/men">men</Link>
          </span>
        </div>
      </div>
      <div className="flex justify-between items-start gap-10">
        <CollectionSidebar collectionTitle={collectionTitle} />
        <ProductsList products={data[collectionTitle]} />
      </div>
    </div>
  );
};

export default Collection;
