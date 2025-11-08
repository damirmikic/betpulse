import Sidebar from "../components/Sidebar.jsx";

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold">Cloudbet Soccer Dashboard</h1>
        <p className="text-gray-500 mt-2">Select a league from the sidebar.</p>
      </main>
    </div>
  );
}
