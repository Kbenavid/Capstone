// server/frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginForm from "./LoginForm.jsx";
import Inventory from "./Inventory.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/inventory" replace />} />
      </Routes>
    </BrowserRouter>
  );
}