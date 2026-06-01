import { Route, Routes } from "react-router-dom";
import Desktop from "./pages/Desktop.tsx";
import NotFound from "./pages/NotFound.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Desktop />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
