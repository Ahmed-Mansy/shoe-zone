import { Link } from "react-router";
import PropTypes from "prop-types";

const Logo = ({ goHome = true }) => {
  return (
    <h3 className="text-4xl font-bold text-dark">
      {goHome ? <Link to="/">ShoeZone</Link> : "ShoeZone"}
    </h3>
  );
};

Logo.propTypes = {
  goHome: PropTypes.bool,
};

export default Logo;
