import ProfileDropdown from "./ProfileDropdown";

interface CurrentUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface NavbarMerchantProps {
  handleLogout?: () => void;
}

const NavbarMerchant = ({ handleLogout }: NavbarMerchantProps) => {
  let currentUser: CurrentUser | null = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) currentUser = JSON.parse(raw) as CurrentUser;
  } catch {
    currentUser = null;
  }

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
        <a
          className="sm:order-1 flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80"
          href="#"
        >
          DineDash
        </a>
        <div className="sm:order-3 flex items-center gap-x-2">
          <ProfileDropdown user={currentUser} onLogout={handleLogout} />
        </div>
      </nav>
    </header>
  );
};

export default NavbarMerchant;
