import React from "react";
import { FaUser, FaTimes } from "react-icons/fa";

interface ProfileErrorToastProps {
  message: string;
  onCreateProfile: () => void;
  onClose: () => void;
}

const ProfileErrorToast: React.FC<ProfileErrorToastProps> = ({
  message,
  onCreateProfile,
  onClose,
}) => {
  return (
    <div
      className="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 max-w-sm bg-violet-50 border border-violet-200 rounded-xl shadow-lg dark:bg-violet-900/20 dark:border-violet-800"
      role="alert"
      tabIndex={-1}
      aria-labelledby="hs-toast-error-label"
    >
      <div className="flex p-4">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <div className="flex justify-center items-center size-8 bg-violet-100 rounded-full dark:bg-violet-800">
            <FaUser className="text-violet-600 dark:text-violet-300 text-sm" />
          </div>
        </div>

        <div className="ms-3 flex-1">
          {/* Message */}
          <p
            id="hs-toast-error-label"
            className="text-sm text-violet-800 dark:text-violet-300 font-medium"
          >
            {message}
          </p>

          <div className="mt-3 flex items-center space-x-3">
            {/* Create Profile Button */}
            <button
              type="button"
              className="bg-violet-600 text-white px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-violet-700 focus:outline-hidden focus:bg-violet-700 transition-colors duration-200"
              onClick={onCreateProfile}
            >
              <FaUser className="inline mr-1" />
              Create Profile
            </button>

            {/* Close Button */}
            <button
              type="button"
              className="text-violet-600 hover:text-violet-800 font-medium text-sm focus:outline-hidden dark:text-violet-400 dark:hover:text-violet-200"
              onClick={onClose}
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Close X Button */}
        <button
          type="button"
          className="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-violet-800 opacity-50 hover:opacity-100 focus:outline-hidden focus:opacity-100 dark:text-violet-200 ml-2"
          aria-label="Close"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <FaTimes className="size-3" />
        </button>
      </div>
    </div>
  );
};

export default ProfileErrorToast;
