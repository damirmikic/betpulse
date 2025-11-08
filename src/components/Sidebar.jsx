import { useEffect, useState } from "react";
import { fetchLeagues } from "../api/cloudbet.js";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeagues()
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading leagues...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <aside className="w-72 bg-gray-100 h-screen overflow-y-auto p-4 border-r border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Soccer Leagues</h2>
      {categories.map((cat) => (
        <div key={cat.key} className="mb-6">
          <h3 className="font-bold text-gray-700 mb-2">{cat.name}</h3>
          <ul className="ml-2 space-y-1">
            {cat.competitions?.map((comp) => (
              <li
                key={comp.key}
                className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {comp.name} <span className="text-gray-400">({comp.eventCount})</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
