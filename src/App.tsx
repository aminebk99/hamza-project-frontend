import { BrowserRouter, Route, Routes } from "react-router-dom";
import Article from "./Pages/Article";
import Client from "./Pages/Client";
import PageNotFound from "./Pages/PageNotFound";
import LoginPage from "./Pages/LoginPage";
import AdminDashboard1 from "./Pages/AdminDashboard1";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminDashboard1 />} />
        <Route path="/dashboard" element={<AdminDashboard1 />} />
        <Route path="/article" element={<Article />} />
        <Route path="/client" element={<Client />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin1" element={<AdminDashboard1 />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
