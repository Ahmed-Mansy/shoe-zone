import PropTypes from "prop-types";

// const Input = ({
//   label,
//   type,
//   name,
//   value,
//   onChange,
//   extraStyle,
//   showLabel = true,
// }) => {
//   return (
//     <div>
//       {showLabel && (
//         <label
//           htmlFor={label.toLowerCase()}
//           className="block text-sm font-medium text-gray-700">
//           {label}
//         </label>
//       )}

//       <input
//         id={label.toLowerCase()}
//         name={name}
//         value={value}
//         onChange={onChange}
//         type={type}
//         className={
//           extraStyle
//             ? extraStyle
//             : "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
//         }
//         placeholder={!showLabel ? label : ""}
//       />
//     </div>
//   );
// };

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  extraStyle = "",
  showLabel = true,
  error = "",
}) => {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="mb-4">
      {showLabel && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={`
          block w-full rounded-md px-3 py-2 shadow-sm
          border ${error ? "border-red-500" : "border-gray-300"}
          focus:outline-none focus:ring-1 
          ${
            error
              ? "focus:ring-red-500 focus:border-red-500"
              : "focus:ring-blue-500 focus:border-blue-500"
          }
          ${extraStyle}
        `}
        placeholder={!showLabel ? label : ""}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
  error: PropTypes.string,
};

export default Input;
