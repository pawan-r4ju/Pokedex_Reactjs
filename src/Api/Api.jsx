import React, { useEffect, useState } from "react";
import PokemonDetails from "./PokeDtails";
import Navbar from "../components/Navbar";

function Api() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState(null);
  const [navhide, setNavhide] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20; // Number of Pokémon to load per request.

  const handleNav = () => {
    setNavhide(false);
  };

  // Function to fetch Pokémon in chunks
  const fetchPokemons = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch Pokémon list");
      }
      const data = await res.json();
      setAllPokemons((prev) => [...prev, ...data.results]); // Append new data
      setOffset((prev) => prev + limit); // Increment the offset for the next batch
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the first batch of Pokémon
  useEffect(() => {
    fetchPokemons();
  }, []);

  // Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.scrollHeight - 100
      ) {
        fetchPokemons(); // Load more Pokémon when near the bottom
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]); // Depend on offset to avoid redundant fetches

  return (
    <>
      {navhide ? <Navbar /> : null}

      {selectedPokemonUrl ? (
        <PokemonDetails
          url={selectedPokemonUrl}
          onBack={() => {
            setSelectedPokemonUrl(null);
            setNavhide(true);
          }}
          onNavigate={(newId) =>
            setSelectedPokemonUrl(`https://pokeapi.co/api/v2/pokemon/${newId}`)
          }
          hide={handleNav}
        />
      ) : (
        <div className="flex justify-center bg-white min-h-screen rounded-2xl mt-16 mx-12">
          <div className="flex gap-8 flex-wrap justify-center pt-10 rounded w-full">
            {error && (
              <p className="text-center text-red-500 font-semibold">{error}</p>
            )}
            {allPokemons.map((elem, idx) => {
              const pokeId = idx + 1; // Correct indexing
              const pokeName = elem.name;
              return (
                <div
                  key={pokeId} // Use `pokeId` as a unique key
                  className="relative transform rounded-xl h-60 w-64 sm:h-64 sm:w-64 bg-gray-200 shadow-xl transition duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => {
                    setSelectedPokemonUrl(elem.url);
                  }}
                >
                  {/* Pokémon ID */}
                  <span className="absolute top-2 left-2 text-sm font-bold text-black">
                    #{pokeId}
                  </span>
                  <div className="flex h-full flex-col justify-center items-center">
                    <img
                      className="h-36 sm:h-40"
                      src={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokeId}.svg`}
                      alt={pokeName}
                    />
                    <h1 className="font-bold text-gray-800 mt-4">
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
