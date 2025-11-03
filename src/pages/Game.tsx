/* 
    une page qui dit tu est dans la game ID: (l'id de la game recupere dans l'url)
*/
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { use, useEffect, useState } from "react";
import { useApp } from "../context/AppContext";


function Game() {
    const { gameId } = useParams();
    const Navigate = useNavigate();
    const { getSocket } = useApp();
    let socket = getSocket();
    type Joueur = {
        name: string;
        cooldown_miroire: number;
        state: string;
        recharge: number;
    };

    type ListeJoueur = { [key: string]: Joueur };
    // exempel action "recharge": { "type": 1, "cout": 0, "priority": 1, "nb_cible": 0 },
    type Action = { type: number, cout: number, priority: number, nb_cible: [number] };
    type DicoActionPossible = { [key: string]: Action };
    //     "bouclier": { "type": 3, "cout": 0, "beaten": ["bazooka", "pisto_lame_2"], "priority": 1, "nb_cible": 0 },
    type DicoAction = { [key: string]: { type: number, cout: number, beaten: string[], negate: string[], priority: number, nb_cible: number } };
    // unMessgae = const message = {author: msg.author || "Anonyme",text: msg.text || "",time: new Date().toLocaleTimeString(),};
    type unMessage = { author: string, text: string, time: string };
    //  "joueur 4": { "action": "double_pistolet", "target": ["joueur 3", "joueur 1"], "priority": 1 },
    type unFeedBack = { action: string, target?: string[], id_joueur: string, name_joueur?: string };

    // Informations sur la partie   
    type InfoParty = { id_party: string, max_joueur: number, min_joueur: number, etat_party: string, tour_party: number, nb_joueur: number }

    const [liste_joueur, setListeJoueur] = useState<ListeJoueur>({});
    const [info_party, setInfo_party] = useState<InfoParty>({
        id_party: "",
        max_joueur: 0,
        min_joueur: 0,
        etat_party: "",
        tour_party: 0,
        nb_joueur: 0
    }); const [actionPossible, setActionPossible] = useState<DicoActionPossible>({});
    const [dico_action, setDico_action] = useState<DicoAction>({});
    const [lstTargetSelect, setLstTargetSelect] = useState<string[]>([]);
    const [actionWithTargetSelect, setActionWithTargetSelect] = useState("");
    const [isValidAction, setIsValidAction] = useState(false);
    // temps avant la prochaine party 
    const [timeBeforeNextParty, setTimeBeforeNextParty] = useState(11);
    // historique des messages recu
    const [messages, setMessages] = useState<unMessage[]>([]);
    const [feedBackLastRound, setFeedBackLastRound] = useState<unMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [feedBackLastRoundRaw, setFeedBackLastRoundRaw] = useState<unFeedBack[]>([]);
    const [listPlayerIdWhoChoose, setListPlayerIdWhoChoose] = useState<string[]>([]);
    const [nbTour, setNbTour] = useState(0);


    useEffect(() => {
        if (!socket || !gameId) {
            // attendre 1 seconde et reessayer
            Navigate("/");
            return;
        }

        socket.on("action_possible", (data: any) => {
            console.log("Tes actions possible sont :", data);
            setActionPossible(data);
        });

        socket.on("load_history", (oldMessages: any) => {
            setMessages(oldMessages);
        });

        socket.on("players_list_who_choose", (newListe: any) => {
            console.log("listPlayerIdWhoChoose===========", listPlayerIdWhoChoose);
            setListPlayerIdWhoChoose(newListe);
        });

        socket.on("last_round_feedback", (feedback: unFeedBack[]) => {
            console.log("Feedback dernier tour reçu :", feedback);
            setFeedBackLastRoundRaw(feedback);
        });

        // Recevoir les nouveaux messages
        socket.on("receive_message", (msg: any) => {
            console.log("Nouveau message reçu :", msg);
            setMessages((prevMessages) => [...prevMessages, msg]);
            //setMessages([...messages, msg]);
        });

        // demander l'etat de la game
        socket.emit("get_dico_action");
        socket.on("dico_action", (data: any) => {
            console.log("Dico des actions :", data);
            setDico_action(data);
        });

        socket.emit("get_game_state", gameId);
        socket.on("game_state", (data: any) => {
            let { info_party_for_client, liste_joueur_for_client } = data;
            console.log("Etat de la game :", info_party_for_client);
            console.log("Liste des joueurs :", liste_joueur_for_client);
            setInfo_party(info_party_for_client);
            setListeJoueur(liste_joueur_for_client);
            if (info_party_for_client.etat_party === "ended") {
                // INTERDICTION FORMEL DE FAIRE DES ALERT sa fige le code de tt les joueur 
                console.log("La partie est terminé");

            }
        });

        socket.on("new_game_in", (temps: any) => {
            setTimeBeforeNextParty(temps);
        });

        socket.on("party_started", (data: any) => {
            let { info_party_for_client, liste_joueur_for_client } = data;
            console.log("Etat de la game :", info_party_for_client);
            console.log("Liste des joueurs :", liste_joueur_for_client);
            setInfo_party(info_party_for_client);
            setListeJoueur(liste_joueur_for_client);
            setTimeBeforeNextParty(11);
            setIsValidAction(false);
        });

        socket.on("action_not_valid", () => {
            console.log("L'action n'est pas valide");
            setIsValidAction(false);
        });

        socket.on("tour_annuler", () => {
            console.log("Le tour a été annulé");
            setIsValidAction(false);
        });

        socket.on("action_valid", () => {
            console.log("L'action est valide");
            setIsValidAction(true);
        });

        socket.on("you_win", () => {
            console.log("Tu as gagné la partie");
            setTimeBeforeNextParty(11);
            setIsValidAction(false);
        });

        socket.on("resolutionDuTour", (effect: any[]) => {
            console.log("La résolution du tour est terminée");
            // effect = [[],[]]
            for (let Oneffect of effect) {
                switch (Oneffect[0]) {
                    case "remove_pv":
                    case "remove":
                    case "add":
                    default:
                        console.log("Effet non géré :", Oneffect);
                        break;
                }
            }
            socket.emit("get_game_state", gameId);
            setIsValidAction(false);
            setActionWithTargetSelect("");
            setLstTargetSelect([]);
            setActionPossible({});
        });


    }, []);// pour le moment coté serveur il n'y a que 1 game qui existe ok


    // 0 = pas dans la game mais dans la party
    // 1 = dans la party
    // 2 = mort ce qui est en sois pareil que 0

    function call_manualy_action_possible() {
        socket.emit("iWantToKnowMyActionPossible", {});
    }

    // Envoi d’un message
    const sendMessage = () => {
        if (newMessage.trim() === "") return;
        socket.emit("send_message", { author: liste_joueur[socket.id]?.name, text: newMessage });
        setNewMessage("");
    };

    function quit_the_game() {
        // faire un emit pour prévenir le serveur
        socket.emit("client_quit",);
        Navigate("/");
    }

    function sendMyAction(actionName: string) {
        console.log("Tu as choisi l'action :", actionName);
        console.log("voici la liste des cible :", lstTargetSelect);
        if (lstTargetSelect.length > 1) {
            socket.emit("thisIsMyAction", { action: actionName, target: lstTargetSelect });// trouver un systeme car la cible et tous la triche etc...
        }
        else if (lstTargetSelect.length === 1) {
            socket.emit("thisIsMyAction", { action: actionName, target: [lstTargetSelect[0]] });// trouver un systeme car la cible et tous la triche etc...
        }
        else if (lstTargetSelect.length === 0) {
            socket.emit("thisIsMyAction", { action: actionName });// trouver un systeme car la cible et tous la triche etc...
        }
        setLstTargetSelect([]);
        setActionWithTargetSelect("");
    }

    function verifySendAction(actionName: string) {
        // verifier que le nombre de cible est supérieur a 0 ou egal au nombre de cible demandé par l'action
        if (actionPossible[actionName].nb_cible.includes(lstTargetSelect.length)) {
            sendMyAction(actionName);
        } else {
            console.log("Tu dois sélectionner le bon nombre de cibles pour cette action");
        }
    }

    function addOrRemoveTarget(targetId: string) {
        console.log("Tu as cliqué sur la cible :", targetId);
        if (lstTargetSelect.includes(targetId)) {
            // si elle est deja dans la liste on l'enleve
            setLstTargetSelect(lstTargetSelect.filter(id => id !== targetId));
        } else {
            // sinon on l'ajoute
            // que si en l'ajoutant on depasse pas le nombre de cible max
            // si y a un nombre plus grand que lstTargetSelect.length dans actionPossible[actionWithTargetSelect].nb_cible
            if (Math.max(...actionPossible[actionWithTargetSelect].nb_cible) > lstTargetSelect.length) {
                setLstTargetSelect([...lstTargetSelect, targetId]);
            }
            else {
                console.log("Tu ne peux pas sélectionner plus de cibles pour cette action");
            }
        }
    }

    console.log("actionWithTargetSelect", actionWithTargetSelect);
    console.log("actionValider ?", isValidAction);

    function buttonForAction(key: string) {
        // faut afficher differemment les action avec 0 cible et celles avec plus que 0 cible
        //dico_action.[nom action].nb_cible
        if (actionPossible[key].nb_cible[0] === 0) {// pas de cible a choisir
            return (
                // afficher le truc en griser si isValidAction est a true
                <button key={key} disabled={isValidAction} onClick={() => { sendMyAction(key) }} className={`p-2 rounded border border-2 ${isValidAction ? "bg-gray-300 text-gray-500" : " bg-white text-black hover:border-blue-600 "} border-black`}>
                    {key} - Coût: {actionPossible[key].cout}
                </button>
            );
        } else if (actionPossible[key].nb_cible[0] > 0) { // il faut choisir au moin 1 cible
            return (
                <span key={key} className=" rounded border border-2">
                    <button key={key} disabled={isValidAction} onClick={() => { setActionWithTargetSelect(key) }} className={`w-full p-2 rounded border border-2 ${isValidAction ? "bg-gray-300 text-gray-500" : actionWithTargetSelect == key ? "bg-blue-500 text-black hover:border-blue-600" : " bg-white text-black hover:border-blue-600 "} border-black`}>
                        {key} - Coût: {actionPossible[key].cout}
                    </button>
                    {/* on doit pouvoir selectionner autant de cible que il y a de actionPossible[key].nb_cibl  */}
                    {actionWithTargetSelect == key && (
                        <span key={key + "1"}>
                            <h3 className="text-xl font-bold">Sélectionnez vos cibles :</h3>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-2">
                                {Object.keys(liste_joueur).filter((key) => key !== socket.id && liste_joueur[key].state == "player").map((key) => (

                                    <button
                                        key={key}
                                        disabled={isValidAction}
                                        onClick={() => addOrRemoveTarget(key)}
                                        className={`px-4 py-2 ${lstTargetSelect.includes(key) ? "bg-blue-500" : "bg-white"} text-black rounded border border-2 hover:border-blue-600 border-black w-auto`}
                                    >
                                        {liste_joueur[key].name}
                                    </button>

                                ))}
                            </div>
                        </span>
                    )}

                    {actionPossible[key].nb_cible.includes(lstTargetSelect.length) && actionWithTargetSelect === key && (
                        // a afficher que si l'action associer a se bouton ai ete cibler :/
                        // un bouton pour valider l'action avec les cible selectionné
                        <button onClick={() => { verifySendAction(key) }} className="p-2 bg-green-500 text-white rounded border border-2 hover:border-green-600 border-black m-1">
                            Valider l'action avec les cibles sélectionnées
                        </button>
                    )}
                </span>
            );
        }
        else {
            return <p>Erreur dans le dico des actions possible</p>;
        }



    }

    // si le socket marche pas encore ou met rien sur la page 
    if (!socket || !socket.id || !gameId) {
        return <div className="h-screen w-screen flex items-center justify-center bg-red-100">
            <div className="flex flex-col gap-4 w-full max-w-md text-center">
                <h1 className="text-3xl font-bold">Problème de connexion au serveur ou id de la game invalide</h1>
                <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={() => Navigate("/")}>
                    Retour à l'accueil
                </button>
            </div>
        </div>;
    }

    let whichPartInTurn = liste_joueur[socket?.id]?.state || "spectator";
    switch (whichPartInTurn) {

        case "winner":
        case "dead":
        case "spectator":
            // dans une game mais pas encore dans une partie (genre si tu rejoin en cour de route)
            return (


                <div className="h-screen w-screen flex flex-row bg-blue-100">

                    <div className="w-64 h-screen bg-blue-200 flex flex-col border-r border-blue-300 shadow-md">
                        {/* Liste des joueurs scrollable */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <h2 className="text-xl font-bold mb-2 text-center text-blue-700">Joueurs</h2>
                            {Object.keys(liste_joueur).map((key) => {
                                const joueur = liste_joueur[key];
                                const isSelf = key === socket.id;
                                let color = "text-gray-700";
                                let add_str = "";
                                let hasPlay = listPlayerIdWhoChoose.includes(key);
                                console.log("hasPlay", hasPlay, "listPlayerIdWhoChoose", listPlayerIdWhoChoose, "key", key);

                                switch (joueur.state) {
                                    case "player":
                                        color = "text-green-600";
                                        add_str = "🎮";
                                        break;
                                    case "spectator":
                                        color = "text-yellow-600";
                                        add_str = "👀";
                                        break;
                                    case "dead":
                                        color = "text-red-600";
                                        add_str = "💀";
                                        break;
                                    case "winner":
                                        color = "text-blue-800 font-semibold";
                                        add_str = "🎉🎉🏆";
                                        break;
                                    case "quit":
                                        color = "text-gray-800";
                                        add_str = "🚪";
                                        break;

                                    default:
                                        color = "text-blue-800 font-semibold";
                                        add_str = "⚠️⚠️⚠️";
                                        break;
                                }


                                return (
                                    <div
                                        key={key}
                                        className={`p-2 my-1 rounded-lg shadow-sm ${hasPlay ? "bg-green-300" : "bg-white"}`}
                                    >
                                        <p className={`font-medium ${color}`}>
                                            {joueur.name} {isSelf && <span className=" ng-blue-300 text-sm text-blue-700">(vous)</span>} {add_str}
                                        </p>
                                        <p className="text-xs text-gray-500 italic">État : {joueur.state}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bloc Votre état */}
                        <div className="p-4 bg-white shadow-inner rounded-t-lg border-t border-gray-300">
                            <h3 className="text-lg font-semibold text-center text-blue-700 mb-2">Votre état</h3>
                            <p className="text-center">Recharge : {liste_joueur[socket.id]?.recharge}</p>
                        </div>

                        {/* Bouton quitter */}
                        <div className="p-4">
                            <button
                                className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => quit_the_game()}
                            >
                                Quitter la game
                            </button>
                        </div>
                    </div>


                    {/* ✅ Zone principale */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {/* <p>Je suis le joueur : {liste_joueur[socket.id]?.name}</p>
                        <p>dont l'id est {socket.id}</p> */}

                        <div className="flex flex-col gap-4 w-full max-w-md text-center">
                            <h2 className="text-2xl font-bold">Vous êtes {whichPartInTurn} de la game</h2>
                            <h2 className="text-3xl font-bold">dans la game ID: {gameId}</h2>
                            {/* compteur avant le debut de la prochiane game SI timeBeforeNextParty < 11 */}
                            {timeBeforeNextParty < 11 && (
                                <p className="text-lg text-green-700 font-semibold">
                                    Nouvelle partie dans : {timeBeforeNextParty} secondes
                                </p>
                            )}

                        </div>

                    </div>

                    {/* ✅ Panneau de chat à droite */}
                    <div className="w-80 bg-blue-200 p-4 border-l border-blue-300 flex flex-col justify-between">

                        {/* Chat global */}
                        <div className="flex flex-col h-1/2 mb-4 bg-white rounded-lg shadow-inner p-2">
                            <h2 className="text-lg font-semibold text-center text-blue-700 mb-2">💬 Chat Global</h2>

                            {/* zone des messages */}
                            <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-2 space-y-1">
                                {messages.map((msg, i) => (
                                    <div key={i} className="text-sm">
                                        <span className="font-semibold">{msg.author} :</span>{" "}
                                        <span>{msg.text}</span>
                                        <span className="text-gray-400 text-xs ml-1">{msg.time}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex mt-2">
                                <input
                                    type="inputMessage"
                                    placeholder="Écrire un message..."
                                    className="flex-1 p-2 rounded-l border border-blue-400 focus:outline-none"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button className="bg-blue-500 text-white px-3 rounded-r hover:bg-blue-600" onClick={sendMessage}>
                                    Envoyer
                                </button>
                            </div>
                        </div>

                        {/* Chat feedback */}
                        <div className="flex flex-col h-1/2 bg-white rounded-lg shadow-inner p-2">
                            <h2 className="text-lg font-semibold text-center text-blue-700 mb-2">Dernier tour (n° {info_party.tour_party})</h2>

                            <div className="flex-1 overflow-y-auto space-y-1">
                                {feedBackLastRoundRaw.map((fb, index) => {
                                    // récupérer le nom du joueur qui a fait l'action
                                    const joueurNom = fb.id_joueur === socket.id
                                        ? "toi"
                                        : liste_joueur[fb.id_joueur]?.name || fb.id_joueur;

                                    // formater les targets
                                    const targetsFormatees = fb.target?.map(targetId => {
                                        const targetNom = liste_joueur[targetId]?.name || targetId;
                                        const targetIdSuffix = targetId.slice(-2); // les 2 derniers caractères
                                        return `${targetNom}(${targetIdSuffix})`;
                                    }).join(", ");

                                    return (
                                        <p key={index}>
                                            <b>{joueurNom}:</b>{" "}
                                            {targetsFormatees
                                                ? `A attaqué ${targetsFormatees} avec ${fb.action}`
                                                : `A joué ${fb.action}`}
                                        </p>
                                    );
                                })}

                            </div>

                        </div>

                    </div>
                </div>



            );
            break;
        case "player":
            if (timeBeforeNextParty != 11) {
                setTimeBeforeNextParty(11);
            }
            // afficher les actionPossible et ton état (ton nombre de recharge , trouvable dans liste_joueur[socket.id].recharge)
            if (actionPossible && Object.keys(actionPossible).length === 0) {
                call_manualy_action_possible();
            }
            return (
                <div className="h-screen w-screen flex flex-row bg-blue-100">

                    <div className="w-64 h-screen bg-blue-200 flex flex-col border-r border-blue-300 shadow-md">
                        {/* Liste des joueurs scrollable */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <h2 className="text-xl font-bold mb-2 text-center text-blue-700">Joueurs</h2>
                            {Object.keys(liste_joueur).map((key) => {
                                const joueur = liste_joueur[key];
                                const isSelf = key === socket.id;
                                let color = "text-gray-700";
                                let add_str = "";
                                let hasPlay = listPlayerIdWhoChoose.includes(key);
                                console.log("hasPlay", hasPlay, "listPlayerIdWhoChoose", listPlayerIdWhoChoose, "key", key);

                                switch (joueur.state) {
                                    case "player":
                                        color = "text-green-600";
                                        add_str = "🎮";
                                        break;
                                    case "spectator":
                                        color = "text-yellow-600";
                                        add_str = "👀";
                                        break;
                                    case "dead":
                                        color = "text-red-600";
                                        add_str = "💀";
                                        break;
                                    case "winner":
                                        color = "text-blue-800 font-semibold";
                                        add_str = "🎉🎉🏆";
                                        break;
                                    case "quit":
                                        color = "text-gray-800";
                                        add_str = "🚪";
                                        break;

                                    default:
                                        color = "text-blue-800 font-semibold";
                                        add_str = "⚠️⚠️⚠️";
                                        break;
                                }


                                return (
                                    <div
                                        key={key}
                                        className={`p-2 my-1 rounded-lg shadow-sm ${hasPlay ? "bg-green-300" : "bg-white"}`}
                                    >
                                        <p className={`font-medium ${color}`}>
                                            {joueur.name} {isSelf && <span className=" ng-blue-300 text-sm text-blue-700">(vous)</span>} {add_str}
                                        </p>
                                        <p className="text-xs text-gray-500 italic">État : {joueur.state}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bloc Votre état */}
                        <div className="p-4 bg-white shadow-inner rounded-t-lg border-t border-gray-300">
                            <h3 className="text-lg font-semibold text-center text-blue-700 mb-2">Votre état</h3>
                            <p className="text-center">Recharge : {liste_joueur[socket.id]?.recharge}</p>
                        </div>

                        {/* Bouton quitter */}
                        <div className="p-4">
                            <button
                                className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={() => quit_the_game()}
                            >
                                Quitter la game
                            </button>
                        </div>
                    </div>


                    {/* ✅ Zone principale */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {/* <p>Je suis le joueur : {liste_joueur[socket.id]?.name}</p>
                        <p>dont l'id est {socket.id}</p> */}

                        <div className="flex flex-col gap-4 w-full max-w-md text-center">
                            <h2 className="text-2xl font-bold">Actions possibles :</h2>
                            {Object.keys(actionPossible).map((key) => buttonForAction(key))}

                            {/* <h2 className="text-2xl font-bold">Votre état :</h2>
                            <p>Recharge: {liste_joueur[socket.id]?.recharge}</p> */}
                        </div>

                        {/* <button
                            className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            onClick={() => quit_the_game()}
                        >
                            Quitter la game
                        </button> */}
                    </div>

                    {/* ✅ Panneau de chat à droite */}
                    <div className="w-80 bg-blue-200 p-4 border-l border-blue-300 flex flex-col justify-between">

                        {/* Chat global */}
                        <div className="flex flex-col h-1/2 mb-4 bg-white rounded-lg shadow-inner p-2">
                            <h2 className="text-lg font-semibold text-center text-blue-700 mb-2">💬 Chat Global</h2>

                            {/* zone des messages */}
                            <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-2 space-y-1">
                                {messages.map((msg, i) => (
                                    <div key={i} className="text-sm">
                                        <span className="font-semibold">{msg.author} :</span>{" "}
                                        <span>{msg.text}</span>
                                        <span className="text-gray-400 text-xs ml-1">{msg.time}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex mt-2">
                                <input
                                    type="inputMessage"
                                    placeholder="Écrire un message..."
                                    className="flex-1 p-2 rounded-l border border-blue-400 focus:outline-none"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button className="bg-blue-500 text-white px-3 rounded-r hover:bg-blue-600" onClick={sendMessage}>
                                    Envoyer
                                </button>
                            </div>
                        </div>

                        {/* Chat feedback */}
                        <div className="flex flex-col h-1/2 bg-white rounded-lg shadow-inner p-2">
                            <h2 className="text-lg font-semibold text-center text-blue-700 mb-2">Dernier tour (n° {info_party.tour_party})</h2>

                            <div className="flex-1 overflow-y-auto space-y-1">
                                {feedBackLastRoundRaw.map((fb, index) => {
                                    // récupérer le nom du joueur qui a fait l'action
                                    const joueurNom = fb.id_joueur === socket.id
                                        ? "toi"
                                        : liste_joueur[fb.id_joueur]?.name || fb.id_joueur;

                                    // formater les targets
                                    const targetsFormatees = fb.target?.map(targetId => {
                                        const targetNom = liste_joueur[targetId]?.name || targetId;
                                        const targetIdSuffix = targetId.slice(-2); // les 2 derniers caractères
                                        return `${targetNom}(${targetIdSuffix})`;
                                    }).join(", ");

                                    return (
                                        <p key={index}>
                                            <b>{joueurNom}:</b>{" "}
                                            {targetsFormatees
                                                ? `A attaqué ${targetsFormatees} avec ${fb.action}`
                                                : `A joué ${fb.action}`}
                                        </p>
                                    );
                                })}

                            </div>

                        </div>

                    </div>
                </div>


            );


            break;

        default:
            return (
                <>
                    <p>je suis dans aucun des etat possible</p>
                    {/*  quitter la game , navigate dans Home */}
                    <button className="mt-4 p-2 bg-red-500 text-white rounded" onClick={() => quit_the_game()}>
                        Quitter la game
                    </button>
                </>
            )
            break;
    }

    return "";
}
export default Game;



