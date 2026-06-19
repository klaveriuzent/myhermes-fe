import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchCurrentUser,
  logout,
  type AuthUser,
} from "../../features/auth/api";
import AvatarText from "../ui/avatar/AvatarText";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [alignRight, setAlignRight] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const displayName = user?.name?.trim() || user?.email || "Mode Lokal";
  const accountStatus = user ? user.email : "Belum login";

  function closeDropdown() {
    setIsOpen(false);
  }

  async function handleLogout() {
    try {
      await logout();
    } finally {
      setUser(null);
      closeDropdown();
      navigate("/login");
    }
  }

  function handleToggle() {
    // Resolve alignment before opening
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      // If button center is in left half of viewport → align left
      // If button center is in right half → align right
      setAlignRight(rect.left + rect.width / 2 > viewportWidth / 2);
    }
    setIsOpen((open) => !open);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetchCurrentUser();
        if (!cancelled) {
          setUser(response.authenticated ? response.user ?? null : null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      }
    }

    loadUser();
    window.addEventListener("focus", loadUser);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", loadUser);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        className={
          user
            ? "dropdown-toggle inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-2 text-gray-700 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            : "dropdown-toggle inline-flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
        }
        aria-label={`Akun pengguna: ${displayName}`}
        aria-expanded={isOpen}
      >
        {user ? (
          <>
            <span className="hidden max-w-[140px] truncate pl-2 font-medium text-theme-sm sm:block">
              {displayName}
            </span>
            <AvatarText name={displayName} className="h-8 w-8" />
            <svg
              className={`stroke-gray-500 transition-transform duration-200 dark:stroke-gray-400 ${
                isOpen ? "rotate-180" : ""
              }`}
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-success-500" />
            <span>Mode Lokal</span>
          </>
        )}
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className={`absolute mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg z-[999999] dark:border-gray-800 dark:bg-gray-dark ${
          alignRight ? "right-0 origin-top-right" : "left-0 right-auto origin-top-left"
        }`}
      >
        <div className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2 dark:bg-white/[0.03]">
          <div className="min-w-0 flex-1 text-right">
            <span className="block truncate font-medium text-gray-700 text-theme-sm dark:text-gray-300">
              {displayName}
            </span>
            <span className="mt-0.5 block truncate text-theme-xs text-gray-500 dark:text-gray-400">
              {accountStatus}
            </span>
          </div>
          {user ? (
            <AvatarText name={displayName} className="h-10 w-10 shrink-0" />
          ) : null}
        </div>

        <ul className="flex flex-col gap-1 border-b border-gray-200 pb-3 pt-4 dark:border-gray-800">
          <li>
            <DropdownItem
              tag="button"
              onClick={toggleTheme}
              className="flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              {theme === "dark" ? (
                <svg
                  className="-ml-0.5 h-[26px] w-[26px] shrink-0 fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12 3.75a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V4.5a.75.75 0 0 1 .75-.75Zm0 3.25a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 9a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0v-1.25a.75.75 0 0 1 .75-.75ZM3.75 12a.75.75 0 0 1 .75-.75h1.25a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Zm14.5-.75h1.25a.75.75 0 0 1 0 1.5h-1.25a.75.75 0 0 1 0-1.5ZM5.697 5.697a.75.75 0 0 1 1.06 0l.884.884a.75.75 0 0 1-1.06 1.06l-.884-.884a.75.75 0 0 1 0-1.06Zm10.662 10.662a.75.75 0 0 1 1.06 0l.884.884a.75.75 0 0 1-1.06 1.06l-.884-.884a.75.75 0 0 1 0-1.06Zm1.944-10.662a.75.75 0 0 1 0 1.06l-.884.884a.75.75 0 0 1-1.06-1.06l.884-.884a.75.75 0 0 1 1.06 0ZM7.641 16.359a.75.75 0 0 1 0 1.06l-.884.884a.75.75 0 0 1-1.06-1.06l.884-.884a.75.75 0 0 1 1.06 0Z" />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 shrink-0 stroke-gray-500 group-hover:stroke-gray-700 dark:stroke-gray-400 dark:group-hover:stroke-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M20.7 14.2C19.8 18.1 16.3 21 12.1 21C7.1 21 3 16.9 3 11.9C3 7.8 5.8 4.2 9.8 3.3C8.8 4.5 8.2 6 8.2 7.7C8.2 12.2 11.8 15.8 16.3 15.8C18 15.8 19.5 15.2 20.7 14.2Z"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {theme === "dark" ? "Mode terang" : "Mode gelap"}
            </DropdownItem>
          </li>
        </ul>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <svg
              className="h-6 w-6 fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M15.1 19.247a.75.75 0 0 1-.75-.75v-4.252h-1.5v4.252a2.25 2.25 0 0 0 2.25 2.25h3.4a2.25 2.25 0 0 0 2.25-2.25V5.496a2.25 2.25 0 0 0-2.25-2.25h-3.4a2.25 2.25 0 0 0-2.25 2.25v4.249h1.5V5.496a.75.75 0 0 1 .75-.75h3.4a.75.75 0 0 1 .75.75v13.001a.75.75 0 0 1-.75.75h-3.4ZM3.25 11.998c0 .216.091.411.237.548l4.608 4.61a.75.75 0 1 0 1.06-1.061l-3.344-3.347H16a.75.75 0 0 0 0-1.5H5.815l3.341-3.342a.75.75 0 1 0-1.061-1.061l-4.572 4.575a.748.748 0 0 0-.273.578Z" />
            </svg>
            Keluar
          </button>
        ) : (
          <Link
            to="/login"
            onClick={closeDropdown}
            className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-gray-700 group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            <svg
              className="h-6 w-6 fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M15.1 19.247a.75.75 0 0 1-.75-.75v-4.252h-1.5v4.252a2.25 2.25 0 0 0 2.25 2.25h3.4a2.25 2.25 0 0 0 2.25-2.25V5.496a2.25 2.25 0 0 0-2.25-2.25h-3.4a2.25 2.25 0 0 0-2.25 2.25v4.249h1.5V5.496a.75.75 0 0 1 .75-.75h3.4a.75.75 0 0 1 .75.75v13.001a.75.75 0 0 1-.75.75h-3.4ZM3.25 11.998c0 .216.091.411.237.548l4.608 4.61a.75.75 0 1 0 1.06-1.061l-3.344-3.347H16a.75.75 0 0 0 0-1.5H5.815l3.341-3.342a.75.75 0 1 0-1.061-1.061l-4.572 4.575a.748.748 0 0 0-.273.578Z" />
            </svg>
            Masuk
          </Link>
        )}
      </Dropdown>
    </div>
  );
}
