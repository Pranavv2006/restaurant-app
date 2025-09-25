import React, { useState } from "react";
import { FaShoppingCart, FaInfoCircle, FaArrowLeft } from "react-icons/fa";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const RestaurantPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const menuData = {
    veg: [
      {
        id: 2,
        name: "Bruschetta",
        description:
          "Toasted bread topped with fresh tomatoes, garlic, and basil",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f",
      },
      {
        id: 5,
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with molten center",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1602351447937-745cb720612f",
      },
      {
        id: 6,
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee and mascarpone",
        price: 7.99,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9",
      },
    ],
    nonVeg: [
      {
        id: 1,
        name: "Crispy Calamari",
        description:
          "Fresh squid rings lightly battered and fried until golden",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1604909052743-94e838986d24",
      },
      {
        id: 3,
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon with lemon herb butter",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1567121938596-cf8d2c8dbf0e",
      },
      {
        id: 4,
        name: "Beef Tenderloin",
        description: "Prime cut beef served with roasted vegetables",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1558030006-450675393462",
      },
    ],
  };

  const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => (
    <div className="bg-grey rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1495195134817-aeb325a55b65";
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
        <p className="text-gray-600 mt-2 text-sm">{item.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-green-600">
            ${item.price.toFixed(2)}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => {
                setSelectedItem(item);
                setShowModal(true);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300"
            >
              <FaInfoCircle className="inline mr-1" /> Details
            </button>
            <button className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300">
              <FaShoppingCart className="inline mr-1" /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal: React.FC<{ item: MenuItem }> = ({ item }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-64 object-cover rounded-lg mt-4"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1495195134817-aeb325a55b65";
          }}
        />
        <p className="mt-4 text-gray-600">{item.description}</p>
        <p className="mt-4 text-2xl font-bold text-green-600">
          ${item.price.toFixed(2)}
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-gray-800 transition duration-300"
        >
          <FaArrowLeft className="inline text-2xl" />
        </button>
        <h1 className="text-4xl font-bold text-center flex-1 text-violet-800">
          Our Menu
        </h1>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Veg</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuData.veg.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Non-Veg</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuData.nonVeg.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {showModal && selectedItem && <Modal item={selectedItem} />}
    </div>
  );
};

export default RestaurantPage;
