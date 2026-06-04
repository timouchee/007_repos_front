import React from "react";
import { useNavigate } from "react-router-dom";
import '../assets/actions/spritesheet.css'


function Rules() {
  const navigate = useNavigate();


  return (
    <div className="min-h-screen w-screen flex justify-center bg-green-100 p-6">
      <div className="flex flex-col gap-6 w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
          Règles et Informations du Jeu 007
        </h1>

        <div className="text-left text-lg text-gray-700 leading-relaxed space-y-4">
          <p>
            Le jeu de 007 est un jeu de choix au tour par tour dont le but est d'être le dernier en vie.
            pour ce faire on a accès chaque tour à une action pour se setup ou pour attaquer les autres joueurs.
          </p>
          <p>
            Le but de chaque game est d'accumuler des munitions pour avoir le plus d'amplitude
            d'action possible et d'éliminer les autres joueurs.
          </p>
          <p>
            Vous trouverez ci-dessous un résumé des actions possibles et de leurs effets :
          </p>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-center text-gray-800 text-lg">
          <thead className="bg-blue-200">
            <tr>
              <th className="border border-gray-300 p-3">Action</th>
              <th className="border border-gray-300 p-3">Nombre de cible</th>
              <th className="border border-gray-300 p-3">Coût</th>
              <th className="border border-gray-300 p-3">Effet</th>
              <th className="border border-gray-300 p-3">Image</th>
            </tr>
          </thead>
          <tbody>
            {/* recharge */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">recharge</td>
              <td className="border border-gray-300 p-3">toi-même</td>
              <td className="border border-gray-300 p-3">0</td>
              <td className="border border-gray-300 p-3">Gagne 1 munition</td>
              <td className="action recharge"></td>
            </tr>

            {/* holy_recharge */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">holy_recharge</td>
              <td className="border border-gray-300 p-3">toi-même</td>
              <td className="border border-gray-300 p-3">0</td>
              <td className="border border-gray-300 p-3">Gagne 2 munition (cooldown: 1 tours)</td>
              <td className="action holy_recharge"></td>
            </tr>

            {/* cure */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">cure</td>
              <td className="border border-gray-300 p-3">toi-même</td>
              <td className="border border-gray-300 p-3">0</td>
              <td className="border border-gray-300 p-3">enlève l'effet de poison</td>
              <td className="action cure"></td>
            </tr>

            {/* ressurect */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">ressurect</td>
              <td className="border border-gray-300 p-3">un joueur mort & toi même</td>
              <td className="border border-gray-300 p-3">5</td>
              <td className="border border-gray-300 p-3">ressurect un joueur mort</td>
              <td className="action ressurect"></td>
            </tr>

            {/* rancune */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">rancune</td>
              <td className="border border-gray-300 p-3">toi même</td>
              <td className="border border-gray-300 p-3">3</td>
              <td className="border border-gray-300 p-3">te permet de ressuciter 3 tour apres ta mort</td>
              <td className="action rancune"></td>
            </tr>

            {/* pistolet */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">pistolet</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">Attaque un joueur avec une balle</td>
              <td className="action pistolet"></td>
            </tr>

            {/* double_pistolet */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">double_pistolet</td>
              <td className="border border-gray-300 p-3">1 ou 2</td>
              <td className="border border-gray-300 p-3">2</td>
              <td className="border border-gray-300 p-3">Tire sur deux cibles différentes</td>
              <td className="action double_pistolet"></td>
            </tr>
            <tr className="hover:bg-blue-50 text-gray-400 italic">
              <td className="border border-gray-300 p-3 font-semibold">double_pistolet_1</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">Variante serveur (attaque simple du double)</td>
            </tr>
            <tr className="hover:bg-blue-50 text-gray-400 italic">
              <td className="border border-gray-300 p-3 font-semibold">double_pistolet_2</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">2</td>
              <td className="border border-gray-300 p-3">Variante serveur (attaque renforcée)</td>
            </tr>

            {/* bazooka */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">bazooka</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">3</td>
              <td className="border border-gray-300 p-3">Attaque puissante qui traverse le bouclier</td>
              <td className="action bazooka"></td>
            </tr>

            {/* lame */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">lame</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">3</td>
              <td className="border border-gray-300 p-3">Attaque de mêlée qui perce les défenses faibles</td>
              <td className="action lame"></td>
            </tr>

            {/* pisto_lame */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">pisto_lame</td>
              <td className="border border-gray-300 p-3">1 ou 2</td>
              <td className="border border-gray-300 p-3">4</td>
              <td className="border border-gray-300 p-3">Attaque combinée distance et mêlée</td>
              <td className="action pisto_lame"></td>
            </tr>
            <tr className="hover:bg-blue-50 text-gray-400 italic">
              <td className="border border-gray-300 p-3 font-semibold">pisto_lame_1</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">2</td>
              <td className="border border-gray-300 p-3">Variante serveur (attaque légère)</td>
            </tr>
            <tr className="hover:bg-blue-50 text-gray-400 italic">
              <td className="border border-gray-300 p-3 font-semibold">pisto_lame_2</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">4</td>
              <td className="border border-gray-300 p-3">Variante serveur (attaque lourde)</td>
            </tr>

            {/* pisto_poison */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">pisto_poison</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">3</td>
              <td className="border border-gray-300 p-3">au bout de 3 tour si le joueur ne c'est pas cure il prendra 1 de degat</td>
              <td className="action pisto_poison"></td>
            </tr>

            {/* dague */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">dague</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">Ne provoque pas de clash lorsque vous visez quelqu'un vous attaquant</td>
              <td className="action dague"></td>
            </tr>

            {/* arrache */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">arrache</td>
              <td className="border border-gray-300 p-3">1</td>
              <td className="border border-gray-300 p-3">5</td>
              <td className="border border-gray-300 p-3">Annule l'action de la cible et l'empeche de refaire cette même action de la game</td>
              <td className="action arrache"></td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse border border-gray-300 text-center text-gray-800 text-lg">
          <thead className="bg-blue-200">
            <tr>
              <th className="border border-gray-300 p-3">Action</th>
              <th className="border border-gray-300 p-3">Nombre de cible</th>
              <th className="border border-gray-300 p-3">Coût</th>
              <th className="border border-gray-300 p-3">Effet</th>
              <th className="border border-gray-300 p-3">Battu par</th>
              <th className="border border-gray-300 p-3">Annule</th>
              <th className="border border-gray-300 p-3">cooldown</th>
              <th className="border border-gray-300 p-3">Image</th>
            </tr>
          </thead>
          <tbody>
            {/* bouclier */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">bouclier</td>
              <td className="border border-gray-300 p-3">toi-même</td>
              <td className="border border-gray-300 p-3">0</td>
              <td className="border border-gray-300 p-3">Protège des attaques classiques pendant un tour</td>
              <td className="border border-gray-300 p-3">bazooka, pisto_lame_2</td>
              <td className="border border-gray-300 p-3">—</td>
              <td className="border border-gray-300 p-3">—</td>
              <td className="action bouclier"></td>
            </tr>

            {/* miroire */}
            <tr className="hover:bg-blue-50">
              <td className="border border-gray-300 p-3 font-semibold">miroire</td>
              <td className="border border-gray-300 p-3">toi-même</td>
              <td className="border border-gray-300 p-3">0</td>
              <td className="border border-gray-300 p-3">Renvoie certaines attaques ou les annule</td>
              <td className="border border-gray-300 p-3">lame</td>
              <td className="border border-gray-300 p-3">pisto_lame_2, double_pistolet_2</td>
              <td className="border border-gray-300 p-3">1 tour</td>
              <td className="action miroire"></td>
            </tr>

          </tbody>
        </table>

        {/* Section d’explications après le tableau */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Bloc gauche */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm text-gray-700">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">Présision 1</h2>
            <p className="text-lg leading-relaxed">
              Je préscise ici que les attaque s'intercroisant entre 2 personne déclenche une comfronation d'attaque.
              <br></br>
              De la personne ayant l'attaque la plus puissante bypasse l'attaque de l'autre.
              (dans le cas du multi-cible il n'y a que l'attaque ciblant la confrontation qui sera pris en compte )
            </p>
          </div>

          {/* Bloc droit */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm text-gray-700">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Point 2</h2>
            <p className="text-lg leading-relaxed">
              Et ici, tu peux détailler un autre aspect — par exemple les interactions
              entre bouclier et attaques, ou des astuces pour débuter.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-3 text-xl cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retour à l’accueil
          </button>
        </div>
      </div>
    </div>
  );



}

export default Rules;