import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { GoX, GoSearch } from "react-icons/go";
import { RiDeleteBin5Line  } from "react-icons/ri";

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    const normalisedSearches = storedSearches.map((term) =>
      term.trim().toLowerCase()
    );
    setRecentSearches(normalisedSearches);
  }, []);

  const saveSearchTerm = (term) => {
    const normalisedTerm = term.trim().toLowerCase();
    if (!normalisedTerm || recentSearches.includes(normalisedTerm)) return; //Running away from duplicates

    const updatedSearches = [normalisedTerm, ...recentSearches.slice(0, 4)];
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setShowSuggestions(true);
    setSearchTerm(value);
    debounceSearched(value);
  };

  const debounceSearched = debounce((value) => {
    if (value.trim() === "") {
      onSearch("");
      return;
    }
    onSearch(value);
  }, 300);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearchTerm(searchTerm);
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleRecentSearchClick = (term) => {
    const normalisedTerm = term.trim().toLowerCase();
    setSearchTerm(normalisedTerm);
    onSearch(normalisedTerm);
    setShowSuggestions(false);
  };

  const removeSuggestion = (term) => {
    const normalisedTerm = term.trim().toLowerCase();
    const updatedSearches = recentSearches.filter((t) => t !== normalisedTerm);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const clearAllSuggestions = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            className="search-input"
          />

          <button className="search-icon" type="submit">
            <GoSearch size={20} />
          </button>
        </div>
      </form>

      {showSuggestions && recentSearches.length > 0 && (
        <>
          <div className="recent-search-header">
            <span>Recent</span>
            
              <RiDeleteBin5Line  size={25} onClick={clearAllSuggestions} />
            
          </div>
          <div className="recent-searches">
            <div className="recent-search-tags">
              {recentSearches.map((term) => (
                <span key={term} className="recent-tag">
                  <button onClick={() => handleRecentSearchClick(term)}>
                    {term}
                  </button>
                  <GoX
                    onClick={() => removeSuggestion(term)}
                    className="remove-icon"
                    size={20}
                    style={{ cursor: "pointer" }}
                  />
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
