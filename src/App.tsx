import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import AuthCallbackPage from "./pages/AuthPages/AuthCallbackPage";
import SignIn from "./pages/AuthPages/SignIn";
import Ecommerce from "./pages/Dashboard/Ecommerce";
import ScrapedJobs from "./pages/Jobs/ScrapedJobs";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Ecommerce />} />
          <Route path="/scraped-jobs" element={<ScrapedJobs />} />
        </Route>

        <Route path="/login" element={<SignIn />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
