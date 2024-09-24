// apps/Books/sidebarFilters.tsx
import { useState } from "react";

const SidebarFilters = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedCategory(e.target.value);
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSelectedAuthor(e.target.value);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedLanguage(e.target.value);
  const handleAvailabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSelectedAvailability(e.target.value);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="mb-4">
        <label htmlFor="category" className="block mb-2">
          Category
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 w-full rounded"
        >
          <option value="">All Categories</option>
          <option value="quran">Quran</option>
          <option value="hadith">Hadith</option>
          <option value="fiqh">Fiqh</option>
          <option value="history">History</option>
          <option value="literature">Literature</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="author" className="block mb-2">
          Author
        </label>
        <input
          id="author"
          type="text"
          value={selectedAuthor}
          onChange={handleAuthorChange}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="language" className="block mb-2">
          Language
        </label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="border p-2 w-full rounded"
        >
          <option value="">All Languages</option>
          <option value="arabic">Arabic</option>
          <option value="english">English</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="availability" className="block mb-2">
          Availability
        </label>
        <select
          id="availability"
          value={selectedAvailability}
          onChange={handleAvailabilityChange}
          className="border p-2 w-full rounded"
        >
          <option value="">All</option>
          <option value="borrow">Available to Borrow</option>
          <option value="buy">Available to Buy</option>
        </select>
      </div>
    </div>
  );
};

export default SidebarFilters;
