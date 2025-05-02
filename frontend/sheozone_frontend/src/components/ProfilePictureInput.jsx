import PropTypes from "prop-types";
import { TbPhotoUp, TbPhotoEdit } from "react-icons/tb";

const ProfilePictureInput = ({
  handleImageChange,
  previewUrl,
  selectedImage,
  label = "Profile Picture",
}) => {
  return (
    <div className="flex items-center gap-[15%]">
      <label
        htmlFor="profilePicture"
        className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 right-0">
          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <label htmlFor="profilePicture">
            <div className="cursor-pointer w-[30px] h-[30px] flex-center rounded-full bg-white border border-gray-300 hover:bg-gray-100 focus:outline-none text-gray-700">
              {selectedImage ? (
                <TbPhotoEdit size={20} />
              ) : (
                <TbPhotoUp size={20} />
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

ProfilePictureInput.propTypes = {
  label: PropTypes.string,
  handleImageChange: PropTypes.func.isRequired,
  previewUrl: PropTypes.string.isRequired,
  selectedImage: PropTypes.object.isRequired,
};

export default ProfilePictureInput;
