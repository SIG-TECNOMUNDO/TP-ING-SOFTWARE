import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import DashboardLayout from "./layouts/DashboardLayout"

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
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route path="/ventas" element={<Sales />} />
        <Route path="/servicio-tecnico" element={<ServiceList />} />
        <Route path="/servicio-tecnico/nueva" element={<NewOrder />} />
        <Route path="/servicio-tecnico/:id" element={<OrderDetail />} />
        <Route path="/clientes" element={<Clients />} />
        <Route path="/administracion" element={<Admin />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
