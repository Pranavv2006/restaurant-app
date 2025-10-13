import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onRegisterClick: () => void;
  onLoginClick: () => void;
}

const Navbar = ({ onRegisterClick, onLoginClick }: NavbarProps) => {
    const navigate = useNavigate();

    return (
        <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
          <nav className="max-w-[85rem] w-full mx-auto px-4 flex flex-wrap basis-full items-center justify-between">
            <button 
              onClick={() => navigate("/")}
              className="sm:order-1 flex-none text-xl font-semibold dark:text-white focus:outline-hidden focus:opacity-80 hover:opacity-80"
            >
              DineDash
            </button>
            <div className="sm:order-3 flex items-center gap-x-2">
              <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-violet-700 text-white shadow-2xs hover:bg-violet-400 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" onClick={onRegisterClick}>
                Register
              </button>
              <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-violet-700 text-white shadow-2xs hover:bg-violet-400 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" onClick={onLoginClick}>
                Login
              </button>
            </div>
          </nav>
        </header>
    );
};

export default Navbar;