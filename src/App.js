import React, { useEffect } from 'react';
import './App.css';
import AutoCompleteSearch from './components/AutoCompleteSearch';

const App = () => {
  useEffect(() => {
    document.title = "Yuri's Page";
  });
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen text-gray-700 p-10 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 ">
	    <div className="w-full max-w-screen-sm bg-white p-10 rounded-xl ring-8 ring-white ring-opacity-40">
        <AutoCompleteSearch />
      </div>
    </div>
  );
}

export default App;
