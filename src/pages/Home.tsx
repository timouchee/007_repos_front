/* 
    faire une page home basique permetant de voire le nom du jeux en haut en gros 
    un gros bouton "trouver une partie" et au dessus "Bienvenue sur le jeux de 007"
    mais juste au dessus du bouton rejoidnre une game y a un input pour mettre son pseudo
    tu peux faire sa ?
*/

import { use, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

function Home() {
    const [pseudo, setPseudo] = useState("");
    const [idGame, setIdGame] = useState("");
    const Navigate = useNavigate();
    const { getSocket } = useApp();
    let socket = getSocket();

    function findGame() {
        // pour le moment pas d'apelle BD on va faire en static
        console.log(socket);
        // pour émettre
        socket.emit("join_party", pseudo);
        socket.on("party_joined", (gameId: string) => {
            console.log("Rejoint la partie avec l'ID :", gameId);
            setIdGame(gameId);
        });
        // setIdGame("1AB2C3");
    }

    function focusOnNameInput() {
        document.getElementById("inputName")?.focus();
    }

    useEffect(() => {
        focusOnNameInput();
    }, []);

    useEffect(() => {
        if (idGame) {
            Navigate("/game/" + idGame);
        }
    }, [idGame]);

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-green-100">
            <div className="flex flex-col gap-4 w-full max-w-md text-center">
                <h1 className="text-3xl font-bold">Bienvenue sur le jeu de 007</h1>
                <form className="flex flex-col items-center gap-4" onSubmit={(e) => { e.preventDefault(); findGame(); }}>
                    <input
                        id="inputName"
                        type="text"
                        placeholder="Entrez votre pseudo"
                        className="p-2 text-lg border rounded mb-4"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                    />
                    <button className="p-4 text-2xl cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600" type="submit">
                        Trouver une partie
                    </button>
                </form>

                <p className="text-sm text-gray-600">
                    Votre pseudo: {pseudo}
                </p>
                {idGame && (
                    <p className="text-lg text-green-700 font-semibold">
                        Partie trouvée ! ID de la partie: {idGame}
                    </p>
                )}
                <div>
                    <button type="button" className="p-2 text-xl cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => Navigate("/rules")}>Voir les règles</button>
                </div>
                <div>
                    <button type="button" className="p-2 text-xl cursor-pointer bg-gray-500 text-white rounded hover:bg-gray-900" onClick={() => Navigate("/adminPage")}>page admin</button>
                </div>
            </div>
        </div>

    );



}
export default Home;

