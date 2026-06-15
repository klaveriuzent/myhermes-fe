import menuConfig from "virtual:menu-config";

export type MenuConfigItem = {
  name: string;
  path: string;
};

export const enabledMenuItems = menuConfig.filter(
  (item): item is MenuConfigItem =>
    typeof item === "object" &&
    item !== null &&
    "name" in item &&
    "path" in item &&
    typeof item.name === "string" &&
    typeof item.path === "string",
);

export const isPageEnabled = (path: string) =>
  enabledMenuItems.some((item) => item.path === path);
