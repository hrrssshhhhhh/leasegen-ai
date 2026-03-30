import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import LeasePage from "./pages/LeasePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<LeasePage />} />
        <Route path="/lease/:id" element={<LeasePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;