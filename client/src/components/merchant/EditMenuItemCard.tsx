import React, { useState } from "react";
import merchantService from "../../services/MerchantService";
import RichTextEditor from "../common/RichTextEditor"; // Add this import

interface EditMenuItemData {
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface EditMenuItemProps {
  onClose: () => void;
  onSuccess: (updatedItem: MenuItem) => void;
  restaurantId: number;
  menuItem: MenuItem;
}

const EditMenuItem = ({
  onClose,
  onSuccess,
  restaurantId,
  menuItem,
}: EditMenuItemProps) => {
  const [formData, setFormData] = useState<EditMenuItemData>({
    name: menuItem.name,
    description: menuItem.description,
    price: menuItem.price.toString(),
    imageUrl: menuItem.imageUrl || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  // Add this new handler for rich text description
  const handleDescriptionChange = (html: string) => {
    setFormData((prev) => ({
      ...prev,
      description: html,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        setError("Please enter a valid price");
        setLoading(false);
        return;
      }

      const requestData = {
        menuItemId: menuItem.id,
        restaurantId: restaurantId,
        name: formData.name,
        description: formData.description,
        price: priceNum,
        imageUrl: formData.imageUrl || "",
      };

      console.log("Menu Item ID being sent:", menuItem.id);
      console.log("Full request data:", requestData);

      const response = await merchantService.editMenuItem(requestData);
      console.log("Response received:", response);

      if (response.success) {
        setSuccess("Menu item updated successfully");

        setTimeout(() => {
          if (response.data) {
            onSuccess({
              id: response.data.id,
              name: response.data.name,
              description: response.data.description,
              price: response.data.price,
              imageUrl: response.data.imageUrl,
            });
          }
          onClose();
        }, 1000);
      } else {
        setError(response.error || "Failed to update menu item");
      }
    } catch (error: any) {
      console.error("Edit menu item error:", error);
      console.error("Error response:", error?.response?.data);
      setError(
        error?.response?.data?.error ||
          error?.message ||
          "An error occurred while updating the menu item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-lg w-full m-3 dark:bg-neutral-900 dark:border-neutral-800">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h3 className="block text-2xl font-bold text-gray-800 dark:text-neutral-200">
              Edit Menu Item
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Update your menu item details
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
              <strong>Success:</strong> {success}
            </div>
          )}

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    required
                    placeholder="Enter item name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Description *
                  </label>
                  <RichTextEditor
                    initialContent={formData.description}
                    onContentChange={handleDescriptionChange}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Price ₹ *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    required
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 dark:text-white">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="https://example.com/image.jpg"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || success !== ""}
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 focus:outline-hidden focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating Item...
                    </>
                  ) : success ? (
                    "Item Updated!"
                  ) : (
                    "Update Menu Item"
                  )}
                </button>
              </div>
            </form>

            <button
              onClick={onClose}
              disabled={loading}
              className="mt-4 w-full py-2 px-4 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMenuItem;
