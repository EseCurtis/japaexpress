import { MdAddBox, MdHome, MdPerson } from "react-icons/md";

export const dashboardPages = [
  {
    label: "home",
    icon: <MdHome />,
    route: "/dashboard"
  },

  {
    label: "shipments",
    icon: <MdAddBox />,
    route: "/dashboard/shipments"
  },

  {
    label: "profile",
    icon: <MdPerson />,
    route: "/dashboard/profile"
  }
];
