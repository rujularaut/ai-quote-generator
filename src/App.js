import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("motivational");
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  // Generate quote
  const generateQuote = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/generate", { category });
      const newQuote = res.data.quote;

      setQuote(newQuote);
      setHistory(prev => [newQuote, ...prev]);
    } catch (err) {
      console.error("Error fetching quote:", err);
      setQuote("Oops! Something went wrong.");
    }
    setLoading(false);
  };

  // Add quote to favorites
  const addToFavorites = (quoteToAdd) => {
    if (!favorites.includes(quoteToAdd)) {
      const updated = [quoteToAdd, ...favorites];
      setFavorites(updated);
     // localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  // Copy quote to clipboard
  const copyQuote = (quoteToCopy) => {
    navigator.clipboard.writeText(quoteToCopy);
    alert("Quote copied to clipboard!");
  };

  return (
    <div className="app">
      <h1>✨ AI Quote Generator ✨</h1>

      {/* Category Selector */}
      <label htmlFor="category">Choose a category: </label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="motivational">Motivational</option>
        <option value="life">Life</option>
        <option value="love">Love</option>
        <option value="tech">Tech</option>
      </select>

      {/* Generate Button */}
      <button onClick={generateQuote} disabled={loading}>
        {loading ? "Generating..." : "Generate Quote"}
      </button>

      {/* Buttons to toggle panels */}
      <div className="panel-buttons">
        <button onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide History" : "View History"}
        </button>
        <button onClick={() => setShowFavorites(!showFavorites)}>
          {showFavorites ? "Hide Favorites" : "View Favorites"}
        </button>
      </div>

      {/* Current Quote */}
      {quote && (
        <div className="quote-container">
          <p className={`quote ${quote ? "show" : ""}`}>“{quote}”</p>
          <button onClick={() => addToFavorites(quote)}>❤️ Add to Favorites</button>
          <button onClick={() => copyQuote(quote)}>📋 Copy</button>
        </div>
      )}

      {/* Side Panel */}
      <div className={`side-panel ${showHistory || showFavorites ? "open" : ""}`}>
        {showHistory && (
          <div className="history">
            <h2>🕘 Quote History</h2>
            {history.length === 0 && <p>No quotes yet.</p>}
            {history.map((q, idx) => (
              <p key={idx}>“{q}”</p>
            ))}
          </div>
        )}

        {showFavorites && (
          <div className="favorites">
            <h2>❤️ My Favs</h2>
            {favorites.length === 0 && <p>No favorites yet.</p>}
            {favorites.map((q, idx) => (
              <div key={idx} className="favorite-item">
                <p>“{q}”</p>
                <button onClick={() => copyQuote(q)}>📋 Copy</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
