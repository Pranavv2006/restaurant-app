import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import merchantService from "../../services/MerchantService";
import type { AddMenuItemData as ServiceAddMenuItemData } from "../../services/MerchantService";
import RichTextEditor from "../common/RichTextEditor";

interface AddMenuItemFormData {
  name: string;
  description: string;
  price: string;
  imageFile?: File;
}

interface AddMenuItemProps {
  onClose: () => void;
  onSuccess: (newItem: any) => void;
  restaurantId: number;
}

const AddMenuItem = ({
  onClose,
  onSuccess,
  restaurantId,
}: AddMenuItemProps) => {
  const [formData, setFormData] = useState<AddMenuItemFormData>({
    name: "",
    description: "",
    price: "",
    imageFile: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageFile: acceptedFiles[0],
      }));
      setError("");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024,
  });

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

  const handleDescriptionChange = (html: string) => {
    console.log("Description updated:", html);
    setFormData((prev) => ({
      ...prev,
      description: html,
    }));
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

      if (!formData.imageFile) {
        setError("Please select an image file");
        setLoading(false);
        return;
      }

      const requestData: ServiceAddMenuItemData = {
        restaurantId: restaurantId,
        name: formData.name,
        description: formData.description,
        price: priceNum,
        imageFile: formData.imageFile,
      };

      console.log("Submitting form data:", {
        ...requestData,
        imageFile: formData.imageFile.name,
      });

      const response = await merchantService.addMenuItem(requestData);

      if (response.success) {
        setSuccess(response.message || "Menu item added successfully");

        setTimeout(() => {
          if (response.data?.menuItem) {
            onSuccess(response.data.menuItem);
          }
          onClose();
        }, 1000);
      } else {
        setError(response.error || "Failed to add menu item");
      }
    } catch (error: any) {
      console.error("Add menu item error:", error);
      setError(
        error?.response?.data?.error ||
          error?.message ||
          "An error occurred while adding the menu item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-lg w-full max-h-screen overflow-hidden m-3 dark:bg-neutral-900 dark:border-neutral-800">
        <div className="p-4 sm:p-6">
          <div className="text-center">
            <h3 className="block text-xl font-bold text-gray-800 dark:text-neutral-200">
              Add Menu Item
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
              Create a new menu item for your restaurant
            </p>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div className="mt-3 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
              <strong>Success:</strong> {success}
            </div>
          )}

          <div className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-3">
                <div>
                  <label className="block text-sm mb-1 dark:text-white">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="py-2 px-3 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    required
                    placeholder="Enter item name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 dark:text-white">
                    Price ₹ *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="py-2 px-3 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-violet-500 focus:ring-violet-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    required
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 dark:text-white">
                    Description *
                  </label>
                  <div className="dark:bg-neutral-900 border rounded-lg overflow-hidden">
                    <RichTextEditor
                      initialContent={formData.description}
                      onContentChange={handleDescriptionChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1 dark:text-white">
                    Image Upload *
                  </label>
                  <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                      isDragActive
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-300 hover:border-violet-500"
                    } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <input {...getInputProps()} />
                    {formData.imageFile ? (
                      <div className="text-center">
                        <svg
                          className="mx-auto h-6 w-6 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          {formData.imageFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(formData.imageFile.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg
                          className="mx-auto h-6 w-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">
                          {isDragActive
                            ? "Drop the image here"
                            : "Drag & drop an image, or click to select"}
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  {formData.imageFile && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          imageFile: undefined,
                        }))
                      }
                      className="mt-1 text-xs text-red-600 hover:text-red-800"
                      disabled={loading}
                    >
                      Remove image
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || success !== ""}
                  className="w-full py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 focus:outline-hidden focus:bg-violet-700 disabled:opacity-50 disabled:pointer-events-none"
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
                      Adding Item...
                    </>
                  ) : success ? (
                    "Item Added!"
                  ) : (
                    "Add Menu Item"
                  )}
                </button>
              </div>
            </form>

            <button
              onClick={onClose}
              disabled={loading}
              className="mt-3 w-full py-2 px-3 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItem;
