import { Link, useLocation } from "react-router";

import { GridIcon, HorizontaLDots, ShootingStarIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <ShootingStarIcon />,
    name: "Scraped Jobs",
    path: "/scraped-jobs",
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isMobileHeaderExpanded, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const showLogo = !isMobileOpen;
  const mobileSidebarContentOffsetClasses = isMobileHeaderExpanded
    ? "pt-[144px]"
    : "pt-[80px]";

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => (
        <li key={nav.name}>
          <Link
            to={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {nav.icon}
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text">{nav.name}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 h-screen flex flex-col px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showLogo && (

      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" aria-label="Hermes Agent">
          {isExpanded || isHovered || isMobileOpen ? (
            <span className="flex items-center gap-3">
              <img
                src="/images/logo/hermes.webp"
                alt=""
                className="size-10 rounded-xl border border-gray-200 object-cover shadow-theme-xs dark:border-white/10"
              />
              <span className="flex flex-col text-[18px] font-bold leading-[17px] tracking-[0.18em]">
                <span className="text-gray-900 dark:text-white">HERMES</span>
                <span className="text-secondary-500">AGENT</span>
              </span>
            </span>
          ) : (
            <img
              src="/images/logo/hermes.webp"
              alt=""
              className="size-10 rounded-xl border border-gray-200 object-cover shadow-theme-xs dark:border-white/10"
            />
          )}
        </Link>
      </div>
      )}
      <div
        className={`flex h-full min-h-0 flex-col overflow-y-auto duration-300 ease-linear no-scrollbar ${
          isMobileOpen ? mobileSidebarContentOffsetClasses : "lg:pt-0"
        }`}
      >
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
