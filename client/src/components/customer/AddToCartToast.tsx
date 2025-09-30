import React from "react";

// Define the props for the Toast component
interface ToastProps {
  message: string;
  onUndo: () => void;
  onClose: () => void;
}

const AddToCartToast: React.FC<ToastProps> = ({ message, onUndo, onClose }) => {
  return (
    // Outer container, note the 'data-hs-toast' attribute is often used by
    // utility libraries like Preline UI (which seems to be the source of the original classes)
    <div
      className="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
      role="alert"
      tabIndex={-1}
      aria-labelledby="hs-toast-condensed-label"
    >
      <div className="flex p-4">
        {/* Message label */}
        <p
          id="hs-toast-condensed-label"
          className="text-sm text-gray-700 dark:text-neutral-400"
        >
          {message}
        </p>

        <div className="ms-auto flex items-center space-x-3">
          {/* Undo Button */}
          <button
            type="button"
            className="text-violet-600 decoration-2 hover:underline font-medium text-sm focus:outline-hidden focus:underline dark:text-violet-500"
            onClick={onUndo}
          >
            Undo
          </button>

          {/* Close Button */}
          <button
            type="button"
            className="inline-flex shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-hidden focus:opacity-100 dark:text-white"
            aria-label="Close"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            {/* Close icon (X) */}
            <svg
              className="shrink-0 size-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartToast;
