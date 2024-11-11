import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import PMReport from "./pages/PMReport";
import HCReport from "./pages/HCReport";
import PMCheckpointHistory from "./pages/PMCheckpointHistory";
import HCCheckpointHistory from "./pages/HCCheckPointHistory";
const App = () => (
    <Router>
        <DashboardLayout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/report" element={<Report />} />
                <Route path="/pmreport" element={<PMReport />} />
                <Route path="/hcreport" element={<HCReport />} />
                <Route path="/pmCheckpointHistory" element={<PMCheckpointHistory />} />
                <Route path="/hcCheckpointHistory" element={<HCCheckpointHistory />} />
            </Routes>
        </DashboardLayout>
    </Router>
);

export default App;
