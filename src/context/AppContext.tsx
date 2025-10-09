// src/context/AppContext.tsx
// src/context/AppContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";


// création du contexte
const AppContext = createContext<any>(null);

// hook pratique
export const useApp = () => useContext(AppContext);

type AppProviderProps = {
    children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
    // variables globales
    const [username, setUsername] = useState("Invité");
    const [score, setScore] = useState(0);

    // fonctions globales
    const incrementScore = () => setScore((prev) => prev + 1);
    const resetScore = () => setScore(0);
    const socketRef = useRef<Socket | null>(null);


    useEffect(() => {
        console.log("Connexion au serveur Socket.IO...");
        // socketRef.current = io("http://localhost:3001");
        // socketRef.current = io("http://10.5.1.92:3001")
        socketRef.current = io(import.meta.env.VITE_API_URL);
        console.log("je suis : ", socketRef.current);
        //socketRef.current = socket;

        socketRef.current.on("connect", () => {
            console.log("Connecté au serveur, id =", socketRef.current?.id);
            socketRef.current?.emit("teste", "Hello from client");
        });

        socketRef.current.on("teste_recu", () => {
        console.log("Serveur a reçu le message");
    });

        window.addEventListener("beforeunload", (event) => {
            // Ici tu peux prévenir ton serveur
            console.log("La page va se fermer");
            socketRef.current?.emit("client_quit");
        });

    }, []);

    function getSocket() {
        return socketRef.current;
    }



    return (
        <AppContext.Provider
            value={{ username, setUsername, score, incrementScore, resetScore, getSocket }}
        >
            {children}
        </AppContext.Provider>
    );
};
