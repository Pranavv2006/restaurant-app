import { useState, useEffect } from "react";
import merchantService from "../../services/MerchantService";
import AddMenuItem from "./AddMenuItemCard";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface MenuBoardProps {
  restaurantId: number;
  restaurantData?: any;
}

const MenuBoard = ({ restaurantId, restaurantData }: MenuBoardProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!restaurantId) return;

      try {
        setLoading(true);
        setError("");

        console.log("Fetching menu for restaurant:", restaurantId);

        const result = await merchantService.retrieveMenu({ restaurantId });

        if (result.success && result.data) {
          const mappedItems = result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            imageUrl: item.imageUrl,
          }));

          setMenuItems(mappedItems);
          console.log("Menu items loaded:", mappedItems);
        } else {
          console.log("No menu items found or error:", result.error);
          setMenuItems([]);
          if (result.error) {
            setError(result.error);
          }
        }
      } catch (error: any) {
        console.error("Error fetching menu items:", error);
        setError("Failed to load menu items");
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const handleAddMenuItem = () => {
    setShowAddModal(true);
  };

  const handleEditMenuItem = (id: number) => {
    console.log("Edit menu item:", id);
  };

  const handleDeleteMenuItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMenuItemSuccess = (newItem: MenuItem) => {
    setMenuItems((prev) => [...prev, newItem]);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                    Menu Items
                    {restaurantData && (
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        - {restaurantData.name}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Add menu items, edit prices and descriptions.
                  </p>
                  {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  )}
                </div>
                <div>
                  <div className="inline-flex gap-x-2">
                    <button
                      onClick={handleAddMenuItem}
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
                      Add Menu Item
                    </button>
                  </div>
                </div>
              </div>

              {menuItems.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-gray-500">
                    No menu items found. Add your first menu item!
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-start">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Item Name
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-start">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Description
                        </span>
                      </th>
                      <th scope="col" className="px-6 py-3 text-start">
                        <span className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200">
                          Price
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
                    {menuItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 w-1/3">
                          {" "}
                          <div className="flex items-center gap-x-3">
                            {item.imageUrl ? (
                              <img
                                className="inline-block w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                src={item.imageUrl}
                                alt={item.name}
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-gray-500">
                                  No Image
                                </span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200 break-words">
                                {item.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 w-1/3">
                          {" "}
                          <span className="text-sm text-gray-800 dark:text-neutral-200 break-words">
                            {item.description}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-1/6">
                          {" "}
                          <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                            $
                            {typeof item.price === "number"
                              ? item.price.toFixed(2)
                              : parseFloat(item.price || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-end w-1/6">
                          {" "}
                          {/* Added width control */}
                          <div className="flex gap-x-2 justify-end">
                            <button
                              onClick={() => handleEditMenuItem(item.id)}
                              className="text-sm text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddMenuItem
          onClose={handleCloseAddModal}
          onSuccess={handleMenuItemSuccess}
          restaurantId={restaurantId}
        />
      )}
    </div>
  );
};

export default MenuBoard;
