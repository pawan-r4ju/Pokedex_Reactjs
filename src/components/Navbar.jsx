import React, { useState, useEffect } from "react";
import pokeball from "../assets/pokeball.svg";
import searchIcon from "../assets/search.svg";
import searchByIcon from "../assets/searchBy.svg";
import PokemonDetails from "../Api/PokeDtails";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm === "") {
        setSearchResults([]);
        return;
      }

      const searchId = parseInt(searchTerm, 10);
      if (!isNaN(searchId) && searchId > 648) {
        setError(
          "This Pokedex only has 648 Pokémon, so please enter an ID below 648."
        );
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError(null); 
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
        );
        if (!res.ok) {
          throw new Error(`Enter valid Pokémon: ${res.statusText}`);
        }
        const data = await res.json();
        setSearchResults([data]);
      } catch (error) {
        setError(error.message);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleCardClick = (url) => {
    setSelectedPokemonUrl(url);
  };

  return (
    <>
      {selectedPokemonUrl ? (
        <PokemonDetails
          url={selectedPokemonUrl}
          onBack={() => {
            setSelectedPokemonUrl(null);
          }}
          onNavigate={(newId) =>
            setSelectedPokemonUrl(`https://pokeapi.co/api/v2/pokemon/${newId}`)
          }
        />
      ) : (
        <div className="w-full flex items-center justify-center pr-5 mt-10">
          <div className="w-11/12">
            <div className="flex gap-3 justify-start">
              <img src={pokeball} alt="logo" />
              <span className="text-white text-2xl font-bold">Pokedex</span>
            </div>
            <div className="flex items-center justify-between w-full gap-4">
              <div className="bg-white flex p-1 pl-2 mt-5 gap-3 rounded-2xl w-11/12">
                <img src={searchIcon} alt="search icon" />
                <input
                  type="search"
                  placeholder="Search by name or ID"
                  className="rounded-xl pl-2 w-full focus:outline-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="bg-white flex p-3 rounded-full mt-5">
                <img src={searchByIcon} alt="search by" />
              </div>
            </div>
            {loading && (
              <p className="text-white text-center bg-red-500">Loading...</p>
            )}
            {error && (
              <p className="text-white text-center bg-red-500">{error}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-4 justify-center">
              {searchResults.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="relative transform rounded-xl h-60 w-64 sm:h-64 sm:w-64 bg-gray-200 shadow-xl transition duration-300 hover:scale-105 cursor-pointer"
                  onClick={() =>
                    handleCardClick(
                      `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
                    )
                  }
                >
                  <span className="absolute top-2 left-2 text-sm font-bold text-black">
                    #{pokemon.id}
                  </span>
                  <div className="flex h-full flex-col justify-center items-center">
                    <img
                      className="h-36 sm:h-40"
                      src={`https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
                      alt={pokemon.name}
                    />
                    <h1 className="font-bold text-gray-800 mt-5 flex gap-2">
                      <img src={pokeball} alt="logo" />
                      {pokemon.name.toUpperCase()}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
