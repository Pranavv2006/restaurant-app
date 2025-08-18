interface FormData {
    name: string;
    location: string;
    phone: string;
    cuisine: string;
    submit: () => void;
}

const CreateRestaurantModal = ({ name, location, phone, cuisine, submit }: FormData) => {
    return (
         <div className="relative bg-white dark:bg-neutral-900 rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-100">
                  Add Restaurant
                </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="peer py-2.5 ps-8 block w-full bg-transparent border-b-2 border-b-gray-200 sm:text-sm focus:border-b-blue-500 focus:ring-0 dark:border-b-neutral-700 dark:text-neutral-200"
                        placeholder="Restaurant Name"
                        required
                        disabled={submitting}
                    />
                    <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                        <svg
                        className="w-4 h-4 text-gray-500 dark:text-neutral-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        >
                            <path d="M3 21h18V8H3v13Zm2-11h14v9H5v-9Z" />
                        </svg>
                    </div>
                </div>

                <div className="relative">
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="peer py-2.5 ps-8 block w-full bg-transparent border-b-2 border-b-gray-200 sm:text-sm focus:border-b-blue-500 focus:ring-0 dark:border-b-neutral-700 dark:text-neutral-200"
                    placeholder="Location"
                    required
                    disabled={submitting}
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-neutral-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M12 21s-6-6.1-6-10a6 6 0 1 1 12 0c0 3.9-6 10-6 10Z" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <input
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="peer py-2.5 ps-8 block w-full bg-transparent border-b-2 border-b-gray-200 sm:text-sm focus:border-b-blue-500 focus:ring-0 dark:border-b-neutral-700 dark:text-neutral-200"
                    placeholder="Location"
                    required
                    disabled={submitting}
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-neutral-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M12 21s-6-6.1-6-10a6 6 0 1 1 12 0c0 3.9-6 10-6 10Z" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <input
                    name="cuisine"
                    type="text"
                    value={formData.cuisine}
                    onChange={handleChange}
                    className="peer py-2.5 ps-8 block w-full bg-transparent border-b-2 border-b-gray-200 sm:text-sm focus:border-b-blue-500 focus:ring-0 dark:border-b-neutral-700 dark:text-neutral-200"
                    placeholder="Cuisine"
                    required
                    disabled={submitting}
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500 dark:text-neutral-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M12 21s-6-6.1-6-10a6 6 0 1 1 12 0c0 3.9-6 10-6 10Z" />
                    </svg>
                  </div>
                </div>
              </form>
            </div>
          </div>
    );
}

export default CreateRestaurantModal;