import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.less";
import Home from "@/Views/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
