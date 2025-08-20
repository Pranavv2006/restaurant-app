interface NavbarMerchantProps {
    onLogout: () => void;
}

const NavbarMerchant = ({ onLogout }: NavbarMerchantProps) => {
    return (
        <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
          <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
            <a className="sm:order-1 flex-none text-xl font-semibold dark:text-white focus:outline-hidden focus:opacity-80" href="#">DineDash</a>
            <div className="sm:order-3 flex items-center gap-x-2">
              <a className="py-[7px] px-2.5 inline-flex items-center font-medium text-sm rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 focus:outline-hidden focus:bg-gray-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" href="#">
                Profile
              </a>
              <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-violet-700 text-white shadow-2xs hover:bg-violet-400 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" onClick={onLogout}>
                Logout
              </button>
            </div>
          </nav>
        </header>
    );
};

export default NavbarMerchant;