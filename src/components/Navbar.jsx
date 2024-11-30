import React from "react";
import pokeball from "../assets/pokeball.svg";
import searchIcon from "../assets/search.svg";
import searchByIcon from "../assets/searchBy.svg";

function Navbar() {
  return (
    <div className=" w-full flex items-center justify-center pr-5 mt-10">
      <div className="w-11/12 " >
      <div className="flex gap-3 justify-start ">
        <img src={pokeball} alt=" logo" />
        <span className="text-white text-2xl font-bold">Pokedex</span>
      </div>
      <div className="flex items-center justify-between  w-full gap-4">
        <div className=" bg-white   flex p-1 pl-2 mt-5 gap-3 rounded-2xl w-11/12">
          <img src={searchIcon} alt="search inc" />
          <input type="search" placeholder="Search" className=" rounded-xl pl-2 w-full"/>
        </div>
        <div className="bg-white flex p-3 rounded-full mt-5">
          <img src={searchByIcon} alt="search by" />
        </div>
      </div>
      </div>
    </div>
  );
}

export default Navbar;
