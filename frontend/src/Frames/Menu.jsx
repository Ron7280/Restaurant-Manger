import { useMemo } from "react";
import {
  FaUtensils,
  FaReceipt,
  FaBoxOpen,
  FaUsers,
  FaTruck,
  FaClipboardList,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { HiBuildingStorefront } from "react-icons/hi2";
import { Outlet } from "react-router-dom";
import { BsFillBoxSeamFill } from "react-icons/bs";
import SideBar from "./SideBar";

const Menu = ({ roleProp }) => {
  const role = roleProp || localStorage.getItem("role");
  // const role = "delivery";

  const roleOptions = useMemo(() => {
    const options = {
      customer: [
        {
          text1: "View Menu",
          text2: "Browse dishes",
          nav: "/menu/viewMenu",
          icon: <FaUtensils size={30} />,
        },
        {
          text1: "My Orders",
          text2: "Track your orders",
          nav: "/menu/MyOrders",
          icon: <FaClipboardList size={30} />,
        },
      ],
      admin: [
        {
          text1: "Manage Menu",
          text2: "Add/edit dishes",
          nav: "/menu/manage",
          icon: <FaUtensils size={30} />,
        },
        {
          text1: "Manage Inventory",
          text2: "Stock & ingredients",
          nav: "/menu/inventory",
          icon: <FaBoxOpen size={30} />,
        },
        {
          text1: "View Orders",
          text2: "See all orders",
          nav: "/menu/viewOrders",
          icon: <FaReceipt size={30} />,
        },
        {
          text1: "Assign Deliveries",
          text2: "Manage drivers",
          nav: "/menu/assignDeliveries",
          icon: <FaTruck size={30} />,
        },
        {
          text1: "Manage Users",
          text2: "Add/edit users",
          nav: "/menu/manageUsers",
          icon: <FaUsers size={30} />,
        },
        {
          text1: "Buy Supplies",
          text2: "Add/edit users",
          nav: "/menu/buySupplies",
          icon: <HiBuildingStorefront size={30} />,
        },
      ],
      kitchen: [
        {
          text1: "Pending Orders",
          text2: "Orders to cook",
          nav: "/orders/pending",
          icon: <FaReceipt size={30} />,
        },
        {
          text1: "Update Order Status",
          text2: "Mark as ready",
          nav: "/orders/update",
          icon: <FaClipboardList size={30} />,
        },
        {
          text1: "Order History",
          text2: "Completed orders",
          nav: "/orders/history",
          icon: <FaBoxOpen size={30} />,
        },
      ],
      delivery: [
        {
          text1: "Assigned Deliveries",
          text2: "Orders to deliver",
          nav: "/menu/assigned",
          icon: <FaTruck size={30} />,
        },
        {
          text1: "Track Map",
          text2: "See delivery locations",
          nav: "/menu/trackMap",
          icon: <FaMapMarkedAlt size={30} />,
        },
        {
          text1: "Delivery History",
          text2: "Completed deliveries",
          nav: "/menu/history",
          icon: <BsFillBoxSeamFill size={30} />,
        },
      ],
    };
    return options[role] || [];
  }, [role]);

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 text-white">
      <SideBar roleOptions={roleOptions} />
      <div className="w-[85%]">
        <Outlet context={{ role, roleOptions }} />
      </div>
    </div>
  );
};

export default Menu;
