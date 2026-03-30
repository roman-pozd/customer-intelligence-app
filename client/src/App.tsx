import { Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CustomerList from "./components/CustomerList";
import CustomerDetail from "./components/CustomerDetail";
import DealsPipeline from "./components/DealsPipeline";
import SupportOverview from "./components/SupportOverview";
import NpsOverview from "./components/NpsOverview";
import "./index.css";

export default function App() {
  return (
    <div className="app">
      <nav className="sidebar">
        <h1 className="logo">CI</h1>
        <h2 className="logo-text">Customer Intelligence</h2>
        <ul>
          <li><NavLink to="/">Dashboard</NavLink></li>
          <li><NavLink to="/customers">Customers</NavLink></li>
          <li><NavLink to="/deals">Deals</NavLink></li>
          <li><NavLink to="/support">Support</NavLink></li>
          <li><NavLink to="/nps">NPS</NavLink></li>
        </ul>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/deals" element={<DealsPipeline />} />
          <Route path="/support" element={<SupportOverview />} />
          <Route path="/nps" element={<NpsOverview />} />
        </Routes>
      </main>
    </div>
  );
}
