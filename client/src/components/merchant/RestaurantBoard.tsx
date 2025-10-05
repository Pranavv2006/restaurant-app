import { useEffect, useState } from "react";
import merchantService from "../../services/MerchantService";
import CreateRestaurant from "./CreateRestaurant";
import EditRestaurantCard from "./EditRestaurantCard";

interface Restaurant {
  id: number;
  name: string;
  location?: string;
  phone?: string;
  cuisine?: string;
  imageUrl?: string;
}

interface RestaurantBoardProps {
  merchantId: number;
  onRestaurantUpdated: () => void;
}

function extractCityState(address?: string): string {
  if (!address) return "-";
  const parts = address.split(",").map((s) => s.trim());
  if (parts.length >= 2) {
    const state = parts[parts.length - 2];
    const city = parts[parts.length - 3] || "";
    return `${city ? city + ", " : ""}${state}`;
  }
  return address;
}

const ITEMS_PER_PAGE = 10;

const RestaurantBoard = ({
  merchantId,
  onRestaurantUpdated,
}: RestaurantBoardProps) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRestaurants();
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [merchantId]);

  const fetchRestaurants = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await merchantService.getMerchantRestaurants(merchantId);
      if (result.success && result.data) {
        setRestaurants(result.data);
      } else {
        setError(result.message || "No restaurants found.");
      }
    } catch (err: any) {
      setError("Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  // compute pagination
  const totalRestaurants = restaurants.length;
  const totalPages = Math.ceil(totalRestaurants / ITEMS_PER_PAGE);

  const indexOfFirst = (currentPage - 1) * ITEMS_PER_PAGE;
  const indexOfLast = indexOfFirst + ITEMS_PER_PAGE;
  const currentRestaurants = restaurants.slice(indexOfFirst, indexOfLast);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleAddRestaurant = () => {
    setShowAddModal(true);
  };

  const handleEditRestaurant = (id: number) => {
    const restaurantToEdit = restaurants.find((r) => r.id === id);
    if (restaurantToEdit) {
      setEditingRestaurant(restaurantToEdit);
      setShowEditModal(true);
    }
  };

  const handleDeleteRestaurant = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this restaurant?")) {
      return;
    }
    try {
      setDeleteLoading(id);
      const result = await merchantService.removeRestaurant({
        restaurantId: id,
      });
      if (result.success) {
        setRestaurants((prev) => prev.filter((r) => r.id !== id));
        setError("");
        if (restaurants.length - 1 <= indexOfFirst && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      } else {
        setError(
          result.error || result.message || "Failed to delete restaurant"
        );
      }
    } catch (error: any) {
      setError("Failed to delete restaurant");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRestaurantSuccess = () => {
    setShowAddModal(false);
    fetchRestaurants();
  };

  const handleEditSuccess = () => {
    fetchRestaurants();
    setShowEditModal(false);
    setEditingRestaurant(null);
    setError("");
    if (onRestaurantUpdated) {
      onRestaurantUpdated();
    }
  };

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/placeholder-image.jpg";
    if (imageUrl.startsWith("http")) return imageUrl;
    const baseUrl = "http://localhost:3000";
    const cleanImageUrl = imageUrl.startsWith("/")
      ? imageUrl.slice(1)
      : imageUrl;
    return `${baseUrl}/${cleanImageUrl}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[85rem]">
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Restaurants
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Add, edit, or remove your restaurants.
                  </p>
                  {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  )}
                </div>
                <div>
                  <div className="inline-flex gap-x-2">
                    <button
                      onClick={handleAddRestaurant}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 focus:outline-hidden focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
                      type="button"
                    >
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
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Add Restaurant
                    </button>
                  </div>
                </div>
              </div>

              {currentRestaurants.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">
                    No restaurants found. Add your first restaurant!
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-start">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Name
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-start">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Location
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-start">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Cuisine
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-start">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Phone
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-start">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Image
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-end">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Actions
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {currentRestaurants.map((restaurant) => (
                      <tr key={restaurant.id}>
                        <td className="px-6 py-4 w-1/4">
                          <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200 break-words">
                            {restaurant.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-1/4">
                          <span className="text-sm text-gray-800 dark:text-neutral-200 break-words">
                            {extractCityState(restaurant.location) || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-1/6">
                          <span className="text-sm text-gray-800 dark:text-neutral-200 break-words">
                            {restaurant.cuisine || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-1/6">
                          <span className="text-sm text-gray-800 dark:text-neutral-200 break-words">
                            {restaurant.phone || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-1/6">
                          {restaurant.imageUrl ? (
                            <img
                              className="inline-block w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              src={getImageUrl(restaurant.imageUrl)}
                              alt={restaurant.name}
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder-image.jpg";
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-gray-500">
                                No Image
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-end w-1/6">
                          <div className="flex gap-x-2 justify-end">
                            <button
                              onClick={() =>
                                handleEditRestaurant(restaurant.id)
                              }
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 hover:underline"
                              type="button"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteRestaurant(restaurant.id)
                              }
                              disabled={deleteLoading === restaurant.id}
                              className="inline-flex items-center gap-x-1 text-sm text-red-600 hover:underline disabled:opacity-50"
                              type="button"
                            >
                              {deleteLoading === restaurant.id ? (
                                <>
                                  <svg
                                    className="w-4 h-4 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {/* Pagination controls */}
              <div className="mt-4 flex justify-center items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mb-3 bg-violet-600 rounded disabled:opacity-50 text-white"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 mb-3 bg-violet-600 rounded disabled:opacity-50 text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <CreateRestaurant
          onClose={() => setShowAddModal(false)}
          onSuccess={handleRestaurantSuccess}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && editingRestaurant && (
        <EditRestaurantCard
          restaurant={{
            ...editingRestaurant,
            location: editingRestaurant.location ?? "",
            phone: editingRestaurant.phone ?? "",
            cuisine: editingRestaurant.cuisine ?? "",
            imageUrl: editingRestaurant.imageUrl,
          }}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default RestaurantBoard;
