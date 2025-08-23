import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Props {
  user?: User | null;
  onLogout?: () => void;
}

const ProfileDropdown: React.FC<Props> = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const name = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Guest";
  const email = user?.email ?? "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleProfileClick = () => {
    setOpen(false);
    navigate('/merchant/profile');
  };

  const handleAddMenuClick = () => {
    setOpen(false);
    navigate('/merchant/add-menu');
  };

  const handleLogoutClick = () => {
    setOpen(false);
    onLogout?.();
  };

  return (
    <div ref={dropdownRef} className="relative text-start">
      <button
        id="hs-dnad"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="p-0.5 inline-flex shrink-0 items-center gap-x-3 text-start rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 dark:focus:bg-neutral-800 dark:focus:text-neutral-200 dark:text-neutral-500"
      >
        <img
          className="shrink-0 size-7 rounded-full"
          src="https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=3&w=320&h=320&q=80"
          alt={name || "Avatar"}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="hs-dnad"
          className="w-60 transition-opacity duration-150 z-20 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-neutral-900 dark:border-neutral-700 absolute right-0 mt-2"
        >
          <div className="py-2 px-3.5">
            <span className="font-medium text-gray-800 dark:text-neutral-300 block truncate" title={name}>
              {name || "Your name"}
            </span>
            <p className="text-sm text-gray-500 dark:text-neutral-500 truncate" title={email}>
              {email}
            </p>
          </div>

          <div className="p-1 border-t border-gray-200 dark:border-neutral-800">
            <button
              onClick={handleProfileClick}
              role="menuitem"
              className="w-full text-left flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
            
            <button
              onClick={handleAddMenuClick}
              role="menuitem"
              className="w-full text-left flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add menu
            </button>
            
            <button
              onClick={handleLogoutClick}
              role="menuitem"
              className="w-full text-left flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              type="button"
            >
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;