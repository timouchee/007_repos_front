import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Game from "./pages/Game.tsx";
import Rules from "./pages/Rules.tsx";
import AdminPage from "./pages/AdminPage.tsx";

export default function Routeur() {
    return (
        <BrowserRouter>
            {/* <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link to="/">Accueil</Link>
        <Link to="/lobby">Lobby</Link>
        <Link to="/game">Game</Link>
      </nav> */}

            <Routes>
                {/* <Route path="/" element={<h1>Accueil</h1>} /> */}
                <Route path="/" element={<Home />} />
                <Route path="/lobby" element={<Home />} />
                <Route path="/rules" element={<Rules />} />
                <Route path="/adminPage" element={<AdminPage />} />
                <Route path="/game" element={<Home />} />
                <Route path="/game/:gameId" element={<Game />} />
            </Routes>
        </BrowserRouter>
    );
}
