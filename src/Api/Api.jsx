import React, { useEffect, useState } from "react";
import PokemonDetails from "./PokeDtails";
import Navbar from "../components/Navbar";
import pokeball from "../assets/pokeballForTitle.svg";

function Api({ hide }) {
  const [allPokemons, setAllPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState(null);
  const [offset, setOffset] = useState(0);
  const limit = 20; 

 
  const fetchPokemons = async () => {
    if (offset >= 648) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch Pokémon list");
      }
      const data = await res.json();
      setAllPokemons((prev) => [...prev, ...data.results]); 
      setOffset((prev) => prev + limit); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchPokemons();
  }, []);

  
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 100
      ) {
        fetchPokemons(); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]); 

  return (
    <>
      {!selectedPokemonUrl && <Navbar />}
      {selectedPokemonUrl ? (
        <PokemonDetails
          url={selectedPokemonUrl}
          onBack={() => {
            setSelectedPokemonUrl(null);
            hide();
          }}
          onNavigate={(newId) =>
            setSelectedPokemonUrl(`https://pokeapi.co/api/v2/pokemon/${newId}`)
          }
        />
      ) : (
        <div className="flex justify-center bg-white min-h-screen rounded-2xl mt-16 mx-12">
          <div className="flex gap-8 flex-wrap justify-center pt-10 rounded w-full">
            {error && (
              <p className="text-center text-red-500 font-semibold">{error}</p>
            )}
            {allPokemons.map((elem, idx) => {
              const pokeId = idx + 1; 
              const pokeName = elem.name;
              if (pokeId > 648) {
                return null;
              }
              return (
                <div
                  key={pokeId} 
                  className="relative transform rounded-xl h-60 w-64 sm:h-64 sm:w-64 bg-gray-200 shadow-xl transition duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => {
                    setSelectedPokemonUrl(elem.url);
                    hide();
                  }}
                >
                  
                  <span className="absolute top-2 left-2 text-sm font-bold text-black">
                    #{pokeId}
                  </span>
                  <div className="flex h-full flex-col justify-center items-center">
                    <img
                      className="h-36 sm:h-40"
                      src={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokeId}.svg`}
                      alt={pokeName}
                    />
                    <h1 className="font-bold text-gray-800 mt-5 flex gap-2">
                      <img src={pokeball} alt=" logo" />
                      {pokeName.toUpperCase()}
                    </h1>
                  </div>
                </div>
              );
            })}
            {loading && (
              <p className="text-center text-gray-700 font-medium">
                Loading more Pokémon...
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Api;
