import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

/* @dev: Importing the components
 */
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";

/* @dev: Importing the pages
 */
import CreateToken from "./pages/createToken/CreateToken";
import Wallet from "./pages/userWallet/userWallet";
import ErrorPaage from "./pages/error/errorPage";
import Home from "./pages/home/Home";
import Token from "./pages/token/Token";

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column justify-content-between">
        <Sidebar />
        <div className="r-side d-flex justify-content-between flex-column">
          <Header />
          <div className="main d-flex flex-column">
            <Container fluid className="dashboard-content px-0 pt-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/createtoken/*" element={<CreateToken />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/token/:tk" element={<Token />} />
                <Route path="*" element={<ErrorPaage />} />
              </Routes>
            </Container>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
