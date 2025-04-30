import AppRouter from "./routes/AppRouter";
// import { ToastContainer } from "react-toastify";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import "@smastrom/react-rating/style.css";

const App = () => {
  return (
    // <ToastContainer
    //   position="top-left" //position of the toast
    //   autoClose={3000} //auto close after 3 seconds
    //   newestOnTop={false} //show the newest toast on bottom
    //   closeOnClick={true} //close the toast on click
    // >
    <AppRouter />
    // </ToastContainer>
  );
};
export default App;
