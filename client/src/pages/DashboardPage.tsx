import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function DashboardPage() {
  const { email, clearAuth } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center justify-between h-14 px-6 bg-slate-900 text-white border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Registry</span>
          <span className="text-slate-100 font-semibold tracking-tight">Industry Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-sm">{email}</span>
          <button
            type="button"
            onClick={clearAuth}
            className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight mb-2">Welcome</h2>
          <p className="text-slate-600 text-sm mb-4">Use the links below to manage industries.</p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/industries"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
            >
              View Industries
            </Link>
            <Link
              to="/industries/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition-colors"
            >
              Add New Industry
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

