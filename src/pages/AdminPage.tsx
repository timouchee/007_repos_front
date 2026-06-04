import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useEffect } from "react";
import { useState } from "react";




function AdminPage() {
    const navigate = useNavigate();
    const { getSocket } = useApp();
    let socket = getSocket();

    type Effet = (string | number)[];

    // Type pour infoParty
    type InfoParty = {
        id_party: string;
        max_joueur: number;
        min_joueur: number;
        etat_party: "waiting" | "started" | "ended";
        tour_party: number;
        nb_joueur: number;
    };

    // Type pour un joueur
    type Joueur = {
        name: string;
        cooldown_miroire: number;
        cooldown_holy: number;
        state: string;
        recharge: number;
        effect: Effet[];
        PV: number;
        sprite_joueur: number;
    };

    // Liste des joueurs : dictionnaire
    type ListeJoueur = {
        [id: string]: Joueur;
    };

    // Type pour une action joueur
    type ActionJoueur = {
        action: string;
        target: string[]; // ou number[] selon ce que tu envoies
        priority: number;
    };

    // Dictionnaire action par joueur
    type DicoActionJoueur = {
        [id: string]: ActionJoueur;
    };


    const [infoParty, setInfoParty] = useState<InfoParty | null>(null);
    const [listeJoueur, setListeJoueur] = useState<ListeJoueur>({});
    const [dicoActionJoueur, setDicoActionJoueur] = useState<DicoActionJoueur>({});
    const [list_sprite_perso, setList_sprite_perso] = useState<string[]>([]);
    const [list_sprite_perso_used, setList_sprite_perso_used] = useState<string[]>([]);


    useEffect(() => {
        if (!socket || socket.connected == false) {
            // attendre 1 seconde et reessayer
            console.log("serveur unrechable");
            navigate("/");
            return;
        }

        const getAllData = () => {
            socket.emit("admin_get_all");
        };

        // Première récupération immédiate
        getAllData();

        socket.on("game_state", (data: any) => {
            let { info_party_for_client, liste_joueur_for_client } = data;
            setInfoParty(info_party_for_client);
            setListeJoueur(liste_joueur_for_client);
        });

        // Écoute la réponse du serveur
        socket.on("admin_send_all", (data: any) => {
            setInfoParty(data.info_party_for_admin);
            console.log("dico action : ", data.info_party_for_admin)
            setListeJoueur(data.liste_joueur_for_admin);
            console.log("liste joueur : ", data.liste_joueur_for_admin)
            setDicoActionJoueur(data.dico_action_joueur_admin);
            console.log("action joueur : ", data.dico_action_joueur_admin)
            setList_sprite_perso(data.list_sprite_perso);
            console.log("list_sprite_perso : ", data.list_sprite_perso)
            setList_sprite_perso_used(data.list_sprite_perso_used);
            console.log("list_sprite_perso_used : ", data.list_sprite_perso_used)
        });

        // Intervalle pour récupérer toutes les 5 secondes
        const interval = setInterval(() => {
            getAllData();
        }, 5000);


        return () => {
            clearInterval(interval);
        };

    }, []);// pour le moment coté serveur il n'y a que 1 game qui existe ok

    function addOneRecharge() {
        socket.emit("admin_add_recharge");
    }

    function removeOneRecharge() {
        socket.emit("admin_remove_recharge");
    }
    function addOneRechargePlayer(id: string) {
        socket.emit("admin_add_recharge_player", id);
    }

    function removeOneRechargePlayer(id: string) {
        socket.emit("admin_remove_recharge_player", id);
    }
    function resetSpritUsed() {
        socket.emit("admin_reset_sprite");
    }


    console.log("list_sprite_perso : ", list_sprite_perso);
    console.log("list_sprite_perso_used : ", list_sprite_perso_used);
    return (
        <div className="min-h-screen w-screen p-6 bg-gray-100 flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-blue-700">Page Admin - Parties et Joueurs</h1>

            {/* Info Party */}
            {infoParty && (
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Informations de la Partie</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-800">
                        <div>ID : <span className="font-medium">{infoParty.id_party}</span></div>
                        <div>Etat : <span className="font-medium">{infoParty.etat_party}</span></div>
                        <div>Tour : <span className="font-medium">{infoParty.tour_party}</span></div>
                        <div>Joueurs max : <span className="font-medium">{infoParty.max_joueur}</span></div>
                        <div>Joueurs min : <span className="font-medium">{infoParty.min_joueur}</span></div>
                        <div>Joueurs actuels : <span className="font-medium">{infoParty.nb_joueur}</span></div>
                        <div>Sprites disponibles : <span className="font-medium">{list_sprite_perso.length ? list_sprite_perso.join(", ") : "-"}</span></div>
                        <div>Sprites utilisés : <span className="font-medium">{list_sprite_perso_used.length ? list_sprite_perso_used.join(", ") : "-"}</span> 
                            <button
                                type="button"  
                                className="p-1 text-l cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 m-1"
                                onClick={() => resetSpritUsed()}>
                                Reset Sprite Used
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Liste Joueurs */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Liste des Joueurs</h2>
                <table className="w-full border-collapse border border-gray-300 text-center text-gray-800">
                    <thead className="bg-blue-200">
                        <tr>
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">Nom</th>
                            <th className="border border-gray-300 p-2">État</th>
                            <th className="border border-gray-300 p-2">PV</th>
                            <th className="border border-gray-300 p-2">Sprite</th>
                            <th className="border border-gray-300 p-2">Cooldown Miroire</th>
                            <th className="border border-gray-300 p-2">Cooldown holy</th>
                            <th className="border border-gray-300 p-2">Recharge</th>
                            <th className="border border-gray-300 p-2">Effets</th>
                        </tr>
                        <tr>
                            <th className="border border-gray-300 p-2"></th>
                            <th className="border border-gray-300 p-2"></th>
                            <th className="border border-gray-300 p-2"></th>
                            <th className="border border-gray-300 p-2"></th>
                            <th className="border border-gray-300 p-2"></th>
                            <th className="border border-gray-300 p-2"></th>
                            <th className="border border-gray-300 p-2">
                                <button
                                    type="button"
                                    className="p-2 text-xl cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => addOneRecharge()}>
                                    +1
                                </button>
                                <button
                                    type="button"
                                    className="p-2 text-xl cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
                                    onClick={() => removeOneRecharge()}>
                                    -1
                                </button>
                            </th>
                            <th className="border border-gray-300 p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(listeJoueur).map(([id, joueur]) => (
                            <tr key={id} className="hover:bg-blue-50">
                                <td className="border border-gray-300 p-2">{id}</td>
                                <td className="border border-gray-300 p-2">{joueur.name}</td>
                                <td className="border border-gray-300 p-2">{joueur.state}</td>
                                <td className="border border-gray-300 p-2">{joueur.PV}</td>
                                <td className="border border-gray-300 p-2">{joueur.sprite_joueur}</td>
                                <td className="border border-gray-300 p-2">{joueur.cooldown_miroire}</td>
                                <td className="border border-gray-300 p-2">{joueur.cooldown_holy}</td>
                                <td className="border border-gray-300 p-2"> <button
                                    type="button"
                                    className="p-1 text-l cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 m-1"
                                    onClick={() => addOneRechargePlayer(id)}>
                                    +1
                                </button> 
                                {joueur.recharge}
                                    <button
                                        type="button"
                                        className="p-1 text-l cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 m-1"
                                        onClick={() => removeOneRechargePlayer(id)}>
                                        -1
                                    </button></td>
                                <td className="border border-gray-300 p-2">{joueur.effect.join(", ") || "-"}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Dico Action Joueur */}
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Actions des Joueurs</h2>
                <table className="w-full border-collapse border border-gray-300 text-center text-gray-800">
                    <thead className="bg-green-200">
                        <tr>
                            <th className="border border-gray-300 p-2">Joueur ID</th>
                            <th className="border border-gray-300 p-2">Action</th>
                            <th className="border border-gray-300 p-2">Cible(s)</th>
                            <th className="border border-gray-300 p-2">Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(dicoActionJoueur).map(([id, action]) => (
                            <tr key={id} className="hover:bg-green-50">
                                <td className="border border-gray-300 p-2">{id}</td>
                                <td className="border border-gray-300 p-2">{action.action}</td>
                                <td className="border border-gray-300 p-2">{action?.target?.join(", ")}</td>
                                <td className="border border-gray-300 p-2">{action.priority}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                type="button"
                onClick={() => navigate("/")}
                className="p-3 text-xl cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Retour à l’accueil
            </button>
        </div>
    );



}
export default AdminPage;

