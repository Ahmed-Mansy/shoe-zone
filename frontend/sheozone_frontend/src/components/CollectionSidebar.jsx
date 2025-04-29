import PropTypes from "prop-types";

const CollectionSidebar = ({ collectionTitle }) => {
  return (
    <div className="w-1/4 bg-yellow-200 h-[200px]">
      <h2 className="text-2xl font-medium uppercase">{collectionTitle}</h2>
    </div>
  );
};

CollectionSidebar.propTypes = {
  collectionTitle: PropTypes.string.isRequired,
};

export default CollectionSidebar;
