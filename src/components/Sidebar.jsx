import { useEffect, useState } from "react";
import {
  fetchLeagues,
  fetchCompetitionEvents,
} from "../api/cloudbet.js";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedCompetitions, setExpandedCompetitions] = useState({});
  const [eventsByCompetition, setEventsByCompetition] = useState({});
  const [eventsLoading, setEventsLoading] = useState({});
  const [eventsError, setEventsError] = useState({});

  useEffect(() => {
    fetchLeagues()
      .then((data) => {
        const sanitizedCategories = (data.categories || [])
          .map((category) => ({
            ...category,
            competitions:
              category.competitions?.filter(
                (competition) => competition?.type !== "EVENT_TYPE_OUTRIGHT",
              ) ?? [],
          }))
          .filter((category) => (category.competitions?.length ?? 0) > 0);

        setCategories(sanitizedCategories);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleCategory = (key) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const loadCompetitionEvents = async (competitionKey) => {
    setEventsLoading((prev) => ({ ...prev, [competitionKey]: true }));
    setEventsError((prev) => ({ ...prev, [competitionKey]: null }));

    try {
      const data = await fetchCompetitionEvents(competitionKey);
      const filteredEvents = (data.events ?? []).filter(
        (event) => event?.status === "TRADING",
      );
      setEventsByCompetition((prev) => ({
        ...prev,
        [competitionKey]: filteredEvents,
      }));
    } catch (err) {
      setEventsError((prev) => ({
        ...prev,
        [competitionKey]: err.message || "Failed to load events",
      }));
    } finally {
      setEventsLoading((prev) => ({ ...prev, [competitionKey]: false }));
    }
  };

  const toggleCompetition = (competitionKey) => {
    setExpandedCompetitions((prev) => {
      const nextState = {
        ...prev,
        [competitionKey]: !prev[competitionKey],
      };

      const shouldLoad = !prev[competitionKey] && !eventsByCompetition[competitionKey];
      if (shouldLoad && !eventsLoading[competitionKey]) {
        loadCompetitionEvents(competitionKey);
      }

      return nextState;
    });
  };

  if (loading) {
    return <div className="p-4">Loading leagues...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <aside className="w-80 bg-gray-100 h-screen overflow-y-auto p-4 border-r border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Soccer Leagues</h2>
      {categories.map((cat) => {
        const isCategoryExpanded = expandedCategories[cat.key];
        return (
          <div key={cat.key} className="mb-4">
            <button
              type="button"
              onClick={() => toggleCategory(cat.key)}
              className="flex w-full items-center justify-between rounded-md bg-gray-200 px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-gray-300"
            >
              <span>{cat.name}</span>
              <span>{isCategoryExpanded ? "−" : "+"}</span>
            </button>

            {isCategoryExpanded && (
              <ul className="mt-2 space-y-2 pl-4">
                {cat.competitions?.map((comp) => {
                  const isCompetitionExpanded = expandedCompetitions[comp.key];
                  const competitionEvents = eventsByCompetition[comp.key] ?? [];
                  const competitionIsLoading = eventsLoading[comp.key];
                  const competitionError = eventsError[comp.key];

                  return (
                    <li key={comp.key}>
                      <button
                        type="button"
                        onClick={() => toggleCompetition(comp.key)}
                        className="flex w-full items-center justify-between rounded-md bg-white px-3 py-2 text-left text-sm text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
                      >
                        <span className="font-medium">
                          {comp.name}
                          <span className="ml-2 text-xs font-normal text-gray-500">
                            {comp.eventCount} events
                          </span>
                        </span>
                        <span>{isCompetitionExpanded ? "−" : "+"}</span>
                      </button>

                      {isCompetitionExpanded && (
                        <div className="mt-2 space-y-2 rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                          {competitionIsLoading && <p>Loading events…</p>}
                          {competitionError && (
                            <p className="text-red-500">Error: {competitionError}</p>
                          )}
                          {!competitionIsLoading && !competitionError && (
                            <ul className="space-y-2">
                              {competitionEvents.length > 0 ? (
                                competitionEvents.map((event) => {
                                  const kickoffTime = event?.cutoffTime ?? event?.startTime;

                                  return (
                                    <li
                                      key={event.id ?? `${event.home?.key}-${event.away?.key}`}
                                      className="rounded border border-gray-200 bg-white p-2 shadow-sm"
                                    >
                                      <p className="font-semibold text-gray-700">
                                        {event.home?.name ?? "Home"} vs {event.away?.name ?? "Away"}
                                      </p>
                                      {kickoffTime && (
                                        <p className="text-xs text-gray-500">
                                          {new Date(kickoffTime).toLocaleString()}
                                        </p>
                                      )}
                                    </li>
                                  );
                                })
                              ) : (
                                <li className="text-xs text-gray-500">No upcoming events.</li>
                              )}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}
