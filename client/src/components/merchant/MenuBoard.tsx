import { useState, useEffect } from "react";
import merchantService from "../../services/MerchantService";
import AddMenuItem from "./AddMenuItemCard";
import EditMenuItem from "./EditMenuItemCard";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

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
    const itemToEdit = menuItems.find((item) => item.id === id);
    if (itemToEdit) {
      setEditingItem(itemToEdit);
      setShowEditModal(true);
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      setDeleteLoading(id);

      const result = await merchantService.removeMenuItem({ menuItemId: id });

      if (result.success) {
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
        console.log("Menu item deleted successfully");
      } else {
        setError(result.error || "Failed to delete menu item");
      }
    } catch (error: any) {
      console.error("Error deleting menu item:", error);
      setError("Failed to delete menu item");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleMenuItemSuccess = (newItem: MenuItem) => {
    setMenuItems((prev) => [...prev, newItem]);
  };

  const handleEditSuccess = (updatedItem: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder-image.jpg";

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    const baseUrl = "http://localhost:3000";

    const cleanImageUrl = imageUrl.startsWith("/")
      ? imageUrl.slice(1)
      : imageUrl;

    return `${baseUrl}/${cleanImageUrl}`;
  };

  const stripHtmlTags = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
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
                          <div className="flex items-center gap-x-3">
                            {item.imageUrl ? (
                              <img
                                className="inline-block w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                src={getImageUrl(item.imageUrl)}
                                alt={item.name}
                                onError={(e) => {
                                  console.error(
                                    "Image failed to load:",
                                    item.imageUrl
                                  );
                                  e.currentTarget.src =
                                    "/placeholder-image.jpg"; // Fallback
                                }}
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
                          <span className="text-sm text-gray-800 dark:text-neutral-200 break-words">
                            {stripHtmlTags(item.description).length > 50
                              ? stripHtmlTags(item.description).slice(0, 50) +
                                "..."
                              : stripHtmlTags(item.description)}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-1/6">
                          <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                            $
                            {typeof item.price === "number"
                              ? item.price.toFixed(2)
                              : parseFloat(item.price || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-end w-1/6">
                          <div className="flex gap-x-2 justify-end">
                            <button
                              onClick={() => handleEditMenuItem(item.id)}
                              className="inline-flex items-center gap-x-1 text-sm text-blue-600 hover:underline"
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
                              onClick={() => handleDeleteMenuItem(item.id)}
                              disabled={deleteLoading === item.id}
                              className="inline-flex items-center gap-x-1 text-sm text-red-600 hover:underline disabled:opacity-50"
                            >
                              {deleteLoading === item.id ? (
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

      {showEditModal && editingItem && (
        <EditMenuItem
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          restaurantId={restaurantId}
          menuItem={editingItem}
        />
      )}
    </div>
  );
};

export default MenuBoard;
