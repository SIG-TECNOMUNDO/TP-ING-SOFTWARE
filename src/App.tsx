import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import { BranchProvider } from "./context/BranchContext"
import CashFlow from "./pages/CashFlow"

// Pages
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Inventory from "./pages/Inventory"
import Sales from "./pages/Sales"
import ServiceList from "./pages/ServiceList"
import NewOrder from "./pages/NewOrder"
import OrderDetail from "./pages/OrderDetail"
import Clients from "./pages/Clients"
import Admin from "./pages/Admin"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <BranchProvider>
              <DashboardLayout />
            </BranchProvider>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route
          path="/ventas"
          element={
            <ProtectedRoute roles={["ADMIN", "SALES"]}>
              <Sales />
            </ProtectedRoute>
          }
        />
        <Route path="/servicio-tecnico" element={<ServiceList />} />
        <Route
          path="/servicio-tecnico/nueva"
          element={
            <ProtectedRoute roles={["ADMIN", "SALES"]}>
              <NewOrder />
            </ProtectedRoute>
          }
        />
        <Route path="/servicio-tecnico/:id" element={<OrderDetail />} />
        <Route path="/clientes" element={<Clients />} />
        <Route
          path="/administracion"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/caja"
          element={
            <ProtectedRoute roles={["ADMIN", "SALES"]}>
              <CashFlow />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
