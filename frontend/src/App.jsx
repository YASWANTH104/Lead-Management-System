import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Leads from "./pages/Leads";
import LeadForm from "./components/LeadForm";
import LeadView from "./components/LeadView";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoutes from "./components/PublicRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoutes>
              <Register />
            </PublicRoutes>
          }
        />
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/create"
          element={
            <ProtectedRoute>
              <LeadForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/edit/:id"
          element={
            <ProtectedRoute>
              <LeadForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/view/:id"
          element={
            <ProtectedRoute>
              <LeadView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
