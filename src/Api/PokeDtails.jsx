import React, { useEffect, useState } from "react";
import backbtn from "../assets/back-to-home.svg";
import Api from "./Api";

const colours = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
};

function PokemonDetails({ url, onBack, onNavigate }) {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch Pokémon details");
        }
        const data = await res.json();
        setPokemon(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemonDetails();
  }, [url]);

  const getBackgroundColor = () => {
    if (pokemon && pokemon.types.length > 0) {
      const primaryType = pokemon.types[0].type.name;
      return colours[primaryType] || "#FF0000"; 
    }
    return "#FF0000"; 
  };
  return (
    <>
      <div
        className="pt-10 pb-16 h-full flex flex-col items-center "
        style={{ backgroundColor: getBackgroundColor() }}
      >
        {error && <p className="text-red-500 text-center">{error}</p>}

        {loading && <p className="text-white text-center">Loading...</p>}

        {!loading && pokemon && (
          <>
            <div className="flex ">
              <button className="bg-transparent " onClick={onBack}>
                <img src={backbtn} alt="back" className="mb-5 sm:mb-3" />{" "}
              </button>
              <h1 className="text-4xl mb-5 text-white">
                {" "}
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h1>
            </div>
            <div className="flex justify-between mt-8">
              <button
                className="px-4 py-2 bg-transparent rounded mr-10 text-white text-5xl"
                onClick={() => onNavigate(pokemon.id - 1)}
                disabled={pokemon.id === 1}
              >
                &lt;
              </button>
              <img
                className="mx-auto my-4 w-60 h-60"
                src={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                alt={pokemon.name}
              />
              <button
                className="px-4 py-2 bg-transparent ml-10 rounded text-white text-5xl"
                onClick={() => onNavigate(pokemon.id + 1)}
              >
                &gt;
              </button>
            </div>

            <div className="text-center text-black bg-white p-10 w-1/2">
              <p>
                <strong>ID:</strong> {pokemon.id}
              </p>
              <p>
                <strong>Height:</strong> {pokemon.height}
              </p>
              <p>
                <strong>Weight:</strong> {pokemon.weight}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {pokemon.types[0].type.name.toUpperCase()}
              </p>
              <p>
                <strong>Abilities:</strong>{" "}
                {pokemon.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}
              </p>
              <p>
                <strong>Base Stats:</strong>
              </p>
              <div className="mt-4 space-y-2">
                {pokemon.stats.map((stat) => {
                  const percentage = Math.min(
                    (stat.base_stat / 100) * 100,
                    100
                  ); 
                  return (
                    <div
                      key={stat.stat.name}
                      className="flex items-center space-x-4"
                    >
                      <span className="w-20 text-right capitalize">
                        {stat.stat.name}
                      </span>
                      <div className="flex-1 bg-gray-700 rounded">
                        <div
                          className="h-4 bg-green-500 rounded"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getBackgroundColor(),
                          }}
                        ></div>
                      </div>
                      <span className="ml-2">{stat.base_stat}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PokemonDetails;
