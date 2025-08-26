interface RestaurantCreationToastProps {
  onCreateRestaurant: () => void;
  onDismiss: () => void;
}

const RestaurantCreationToast = ({
  onCreateRestaurant,
  onDismiss,
}: RestaurantCreationToastProps) => {
  return (
    <div className="space-y-3">
      <div
        className="max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
        role="alert"
        tabIndex={-1}
        aria-labelledby="restaurant-creation-toast-label"
      >
        <div className="flex p-4">
          <div className="shrink-0">
            <svg
              className="size-5 text-orange-600 mt-1"
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
          </div>
          <div className="ms-4">
            <h3
              id="restaurant-creation-toast-label"
              className="text-gray-800 font-semibold dark:text-white"
            >
              No Restaurant Found
            </h3>
            <div className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
              You need to create a restaurant to start managing your business.
            </div>
            <div className="mt-4">
              <div className="flex gap-x-3">
                <button
                  type="button"
                  onClick={onDismiss}
                  className="text-gray-500 decoration-2 hover:underline font-medium text-sm focus:outline-hidden focus:underline"
                >
                  Later
                </button>
                <button
                  type="button"
                  onClick={onCreateRestaurant}
                  className="text-orange-600 decoration-2 hover:underline font-medium text-sm focus:outline-hidden focus:underline"
                >
                  Create Restaurant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCreationToast;
