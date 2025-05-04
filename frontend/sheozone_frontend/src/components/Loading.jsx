import Lottie from "lottie-react";
import loading from "../../public/assets/images/loading.json";

const Loading = () => {
  return (
    <div className="wrapper w-full h-[500px] flex justify-center items-center">
      <div className="w-1/6">
        <Lottie animationData={loading} loop={true} />
      </div>
    </div>
  );
};

export default Loading;
