import React, { useState } from "react";

interface MerchantSidebarProps {
  children?: React.ReactNode;
  onNavigate?: (page: string) => void;
  activePage?: string;
}

const MerchantSidebar = ({
  children,
  onNavigate,
  activePage = "dashboard",
}: MerchantSidebarProps) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const toggleAccordion = (accordionId: string) => {
    setActiveAccordion(activeAccordion === accordionId ? null : accordionId);
  };

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const getBreadcrumbText = () => {
    switch (activePage) {
      case "dashboard":
        return "Dashboard";
      case "menu":
        return "Menu Management";
      case "add-menu":
        return "Add Menu Item";
      case "categories":
        return "Categories";
      case "active-orders":
        return "Active Orders";
      case "order-history":
        return "Order History";
      case "order-analytics":
        return "Order Analytics";
      case "restaurant-profile":
        return "Restaurant Profile";
      case "business-hours":
        return "Business Hours";
      case "payment-settings":
        return "Payment Settings";
      case "analytics":
        return "Analytics";
      case "profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  return (
    <>
      <div className="sticky top-16 inset-x-0 z-20 bg-white border-y border-gray-200 px-4 sm:px-6 lg:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
        <div className="flex items-center py-2">
          <button
            type="button"
            className="size-8 flex justify-center items-center gap-x-2 border border-gray-200 text-gray-800 hover:text-gray-500 rounded-lg focus:outline-hidden focus:text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:text-neutral-200 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="hs-application-sidebar"
            aria-label="Toggle navigation"
            data-hs-overlay="#hs-application-sidebar"
          >
            <span className="sr-only">Toggle Navigation</span>
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
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M15 3v18" />
              <path d="m8 9 3 3-3 3" />
            </svg>
          </button>
          <ol className="ms-3 flex items-center whitespace-nowrap">
            <li className="flex items-center text-sm text-gray-800 dark:text-neutral-400">
              Restaurant Management
              <svg
                className="shrink-0 mx-3 overflow-visible size-2.5 text-gray-400 dark:text-neutral-500"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </li>
            <li
              className="text-sm font-semibold text-gray-800 truncate dark:text-neutral-400"
              aria-current="page"
            >
              {getBreadcrumbText()}
            </li>
          </ol>
        </div>
      </div>

      <div
        id="hs-application-sidebar"
        className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-65 hidden fixed start-0 z-50 bg-gray-900 lg:block lg:translate-x-0 lg:end-auto dark:bg-neutral-800 dark:border-neutral-700"
        style={{ height: "calc(100vh - 64px)" }}
        role="dialog"
        tabIndex={-1}
        aria-label="Sidebar"
      >
        <div className="relative flex flex-col h-full max-h-full">
          <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <nav
              className="hs-accordion-group p-3 w-full flex flex-col flex-wrap"
              data-hs-accordion-always-open
            >
              <ul className="flex flex-col space-y-1">
                <li>
                  <button
                    onClick={() => handleNavigation("dashboard")}
                    className={`w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                      activePage === "dashboard" ? "bg-white/10" : ""
                    }`}
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
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Dashboard
                  </button>
                </li>

                <li className="hs-accordion">
                  <button
                    type="button"
                    className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10"
                    aria-expanded={activeAccordion === "menu"}
                    onClick={() => toggleAccordion("menu")}
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
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" x2="21" y1="6" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    Menu Management
                    <svg
                      className={`ms-auto size-4 transition-transform ${
                        activeAccordion === "menu" ? "rotate-180" : ""
                      }`}
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <div
                    className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                      activeAccordion === "menu" ? "block" : "hidden"
                    }`}
                  >
                    <ul className="ps-8 pt-1 space-y-1">
                      <li>
                        <button
                          onClick={() => handleNavigation("menu")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "menu" ? "bg-white/10" : ""
                          }`}
                        >
                          View Menu Items
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigation("add-menu")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "add-menu" ? "bg-white/10" : ""
                          }`}
                        >
                          Add Menu Item
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigation("categories")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "categories" ? "bg-white/10" : ""
                          }`}
                        >
                          Categories
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Orders */}
                <li className="hs-accordion">
                  <button
                    type="button"
                    className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10"
                    aria-expanded={activeAccordion === "orders"}
                    onClick={() => toggleAccordion("orders")}
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
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    Orders
                    <svg
                      className={`ms-auto size-4 transition-transform ${
                        activeAccordion === "orders" ? "rotate-180" : ""
                      }`}
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <div
                    className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                      activeAccordion === "orders" ? "block" : "hidden"
                    }`}
                  >
                    <ul className="ps-8 pt-1 space-y-1">
                      <li>
                        <button
                          onClick={() => handleNavigation("active-orders")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "active-orders" ? "bg-white/10" : ""
                          }`}
                        >
                          Active Orders
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigation("order-history")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "order-history" ? "bg-white/10" : ""
                          }`}
                        >
                          Order History
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigation("order-analytics")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "order-analytics"
                              ? "bg-white/10"
                              : ""
                          }`}
                        >
                          Order Analytics
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="hs-accordion">
                  <button
                    type="button"
                    className="hs-accordion-toggle w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10"
                    aria-expanded={activeAccordion === "settings"}
                    onClick={() => toggleAccordion("settings")}
                  >
                    <svg
                      className="shrink-0 mt-0.5 size-4"
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
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                    <svg
                      className={`ms-auto size-4 transition-transform ${
                        activeAccordion === "settings" ? "rotate-180" : ""
                      }`}
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <div
                    className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${
                      activeAccordion === "settings" ? "block" : "hidden"
                    }`}
                  >
                    <ul className="ps-8 pt-1 space-y-1">
                      <li>
                        <button
                          onClick={() => handleNavigation("restaurant-profile")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "restaurant-profile"
                              ? "bg-white/10"
                              : ""
                          }`}
                        >
                          Restaurant Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigation("business-hours")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "business-hours" ? "bg-white/10" : ""
                          }`}
                        >
                          Business Hours
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigation("payment-settings")}
                          className={`w-full text-left flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-white rounded-lg hover:bg-white/10 focus:outline-hidden focus:bg-white/10 ${
                            activePage === "payment-settings"
                              ? "bg-white/10"
                              : ""
                          }`}
                        >
                          Payment Settings
                        </button>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="w-full pt-6 px-4 sm:px-6 md:px-8 lg:ps-72">
        {children}
      </div>
    </>
  );
};

export default MerchantSidebar;
