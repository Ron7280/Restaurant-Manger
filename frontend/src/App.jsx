import { Route, Routes } from "react-router-dom";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { useState } from "react";
import { Change_Theme_context } from "./Contexts";
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

function App() {
  const [changeTheme, setChangeTheme] = useState(false);

  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <Change_Theme_context.Provider value={[changeTheme, setChangeTheme]}>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Login />} />
            </Route>

            <Route element={<PrivateRoute />}>
              <Route path="/menu" element={<Menu />}>
                <Route index element={<MainDashboard />} />
                <Route path="manage" element={<ManageMenu />} />
                <Route path="inventory" element={<ManageInventory />} />
                <Route path="viewMenu" element={<ViewMenu />} />
                <Route path="orderPage" element={<OrderPage />} />
              </Route>
            </Route>
          </Routes>
        </Change_Theme_context.Provider>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;
