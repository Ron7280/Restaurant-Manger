import { Route, Routes } from "react-router-dom";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useState } from "react";
import { Change_Theme_context, delivery_orders_context } from "./Contexts";
import { AuthProvider } from "./AuthContext";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Login from "./Frames/Login";
import Menu from "./Frames/Menu";
import MainDashboard from "./Frames/MainDashboard";
import ManageMenu from "./Frames/Admin/ManageMenu";
import ManageInventory from "./Frames/Admin/ManageInventory";
import ViewMenu from "./Frames/Customers/ViewMenu";
import OrderPage from "./Components/OrderPage";
import MyOrders from "./Frames/Customers/MyOrders";
import ManageUsers from "./Frames/Admin/ManageUsers";
import AssignDeliveries from "./Frames/Admin/AssignDeliveries";
import ViewOrders from "./Frames/Admin/ViewOrders";
import BuySupplies from "./Frames/Admin/BuySupplies";
import TrackMap from "./Frames/Delivery/TrackMap";
import AssignedDeliveries from "./Frames/Delivery/AssignedDeliveries";
import SignUp from "./Frames/SignUp";
import Background from "./Frames/Background";

function App() {
  const [changeTheme, setChangeTheme] = useState(false);
  const [delivery_orders, setDelivery_orders] = useState([]);

  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <Change_Theme_context.Provider value={[changeTheme, setChangeTheme]}>
          <delivery_orders_context.Provider
            value={[delivery_orders, setDelivery_orders]}
          >
            <Routes>
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Background />}>
                  <Route index element={<Login />} />
                  <Route path="/signUp" element={<SignUp />} />
                </Route>
              </Route>

              <Route element={<PrivateRoute />}>
                <Route path="/menu" element={<Menu />}>
                  <Route index element={<MainDashboard />} />
                  <Route path="manage" element={<ManageMenu />} />
                  <Route path="inventory" element={<ManageInventory />} />
                  <Route path="viewOrders" element={<ViewOrders />} />
                  <Route
                    path="assignDeliveries"
                    element={<AssignDeliveries />}
                  />
                  <Route path="manageUsers" element={<ManageUsers />} />
                  <Route path="buySupplies" element={<BuySupplies />} />

                  <Route path="viewMenu" element={<ViewMenu />} />
                  <Route path="orderPage" element={<OrderPage />} />
                  <Route path="myOrders" element={<MyOrders />} />

                  <Route path="assigned" element={<AssignedDeliveries />} />
                  <Route path="trackMap" element={<TrackMap />} />
                </Route>
              </Route>
            </Routes>
          </delivery_orders_context.Provider>
        </Change_Theme_context.Provider>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;
