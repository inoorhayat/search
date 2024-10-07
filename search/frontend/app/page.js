"use client"
import { useState } from 'react';
import axios from 'axios';
import {cors} from 'cors';



export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axios.get(`http://localhost:5000/search?q=${query}`);
    setResults(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-4xl font-bold text-blue-600">Search Everything</h1>
        <p className="text-lg text-gray-700 mt-2">Videos, Articles, and Academic Papers</p>
        <form onSubmit={handleSearch} className="mt-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Enter search query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Search</button>
        </form>
      </div>

      {/* Results */}
      <div className="mt-8 max-w-4xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result, index) => (
          <div key={index} className="bg-white p-4 rounded shadow-lg">
            <h3 className="font-bold text-xl">{result.title}</h3>
            <p className="text-gray-600">{result.description}</p>
            <a href={result.url} target="_blank" className="text-blue-500 mt-2 block">
              View on {result.platform}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
