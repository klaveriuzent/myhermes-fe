import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import Ecommerce from "./pages/Dashboard/Ecommerce";
import ScrapedJobs from "./pages/Jobs/ScrapedJobs";
import { isPageEnabled } from "./config/menu";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Ecommerce />} />
          {isPageEnabled("/scraped-jobs") && (
            <Route path="/scraped-jobs" element={<ScrapedJobs />} />
          )}
        </Route>

        <Route path="/signin" element={<SignIn />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
