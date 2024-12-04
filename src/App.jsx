import React, { useState } from "react";
import "./App.css";
import Api from "./Api/Api";
import PokemonDetails from "./Api/PokeDtails";

function App() {
  const [selectedPokemonUrl, setSelectedPokemonUrl] = useState(null);

  return (
    <div className="h-full w-screen">
      
      {!selectedPokemonUrl && <Api hide={setSelectedPokemonUrl} />}

      
      {selectedPokemonUrl && (
        <PokemonDetails
          url={selectedPokemonUrl}
          onBack={() => setSelectedPokemonUrl(null)}
          onNavigate={(newId) =>
            setSelectedPokemonUrl(`https://pokeapi.co/api/v2/pokemon/${newId}`)
          }
        />
      )}
    </div>
  );
}

export default App;
