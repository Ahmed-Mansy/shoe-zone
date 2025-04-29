import PropTypes from "prop-types";

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  extraStyle,
  showLabel = true,
}) => {
  return (
    <div>
      {showLabel && (
        <label
          htmlFor={label.toLowerCase()}
          className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        id={label.toLowerCase()}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={
          extraStyle
            ? extraStyle
            : "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        }
        placeholder={!showLabel ? label : ""}
      />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  extraStyle: PropTypes.string,
  showLabel: PropTypes.bool,
};

export default Input;
