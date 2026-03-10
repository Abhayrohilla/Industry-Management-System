import { useEffect, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createApiClient } from "../api";
import { useAuth } from "../hooks/useAuth";
import { Industry, PaginatedIndustries } from "../types";

export function IndustryListPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    name: "",
    type: "",
    city: "",
    email: "",
    contactPerson: ""
  });

  async function loadData(currentPage: number, currentFilters = filters) {
    if (!auth.token) return;
    setLoading(true);
    setError(null);
    try {
      const api = createApiClient(auth.token);
      const response = await api.get<PaginatedIndustries>("/industries", {
        params: {
          page: currentPage,
          limit,
          ...currentFilters
        }
      });
      setIndustries(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch {
      setError("Failed to load industries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, auth.token]);

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleFilterSubmit(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    loadData(1, filters);
  }

  async function handleDelete(id: string) {
    if (!auth.token) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this industry?");
    if (!confirmDelete) return;

    try {
      const api = createApiClient(auth.token);
      await api.delete(`/industries/${id}`);
      loadData(page);
    } catch {
      window.alert("Failed to delete industry");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center justify-between h-14 px-6 bg-slate-900 text-white border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Registry</span>
          <span className="text-slate-100 font-semibold tracking-tight">Industry List</span>
        </div>
        <nav className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
          >
            Dashboard
          </button>
        </nav>
      </header>

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        <form
          onSubmit={handleFilterSubmit}
          className="bg-white border border-slate-200 rounded-lg shadow-sm mb-6 p-4"
        >
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 min-w-[140px]">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Name</span>
              <input
                name="name"
                placeholder="Industry name"
                value={filters.name}
                onChange={handleFilterChange}
                className="h-9 px-3 text-sm border border-slate-200 rounded-md bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400"
              />
            </label>
            <label className="flex flex-col gap-1 min-w-[120px]">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Type</span>
              <input
                name="type"
                placeholder="Type"
                value={filters.type}
                onChange={handleFilterChange}
                className="h-9 px-3 text-sm border border-slate-200 rounded-md bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400"
              />
            </label>
            <label className="flex flex-col gap-1 min-w-[100px]">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">City</span>
              <input
                name="city"
                placeholder="City"
                value={filters.city}
                onChange={handleFilterChange}
                className="h-9 px-3 text-sm border border-slate-200 rounded-md bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400"
              />
            </label>
            <label className="flex flex-col gap-1 min-w-[160px]">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Email</span>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={filters.email}
                onChange={handleFilterChange}
                className="h-9 px-3 text-sm border border-slate-200 rounded-md bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400"
              />
            </label>
            <label className="flex flex-col gap-1 min-w-[140px]">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</span>
              <input
                name="contactPerson"
                placeholder="Contact person"
                value={filters.contactPerson}
                onChange={handleFilterChange}
                className="h-9 px-3 text-sm border border-slate-200 rounded-md bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400"
              />
            </label>
            <button
              type="submit"
              className="h-9 px-4 text-sm font-medium bg-slate-800 text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 transition-colors"
            >
              Apply filters
            </button>
          </div>
        </form>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-800 tracking-tight">All Industries</h2>
            <Link
              to="/industries/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 transition-colors"
            >
              <span aria-hidden>+</span> Add industry
            </Link>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
              <span className="animate-pulse">Loading registry…</span>
            </div>
          )}
          {error && (
            <div className="mx-5 mt-4 p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          {!loading && industries.length === 0 && (
            <div className="py-16 text-center text-slate-500 text-sm">No industries found.</div>
          )}
          {!loading && industries.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      Contact
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      Phone
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      City
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      Created
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {industries.map((industry, i) => (
                    <tr
                      key={industry._id}
                      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${
                        i % 2 === 1 ? "bg-slate-50/30" : ""
                      }`}
                    >
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-500">
                        {industry._id.slice(0, 8)}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">{industry.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{industry.type}</td>
                      <td className="py-2.5 px-4 text-slate-700">{industry.contactPerson}</td>
                      <td className="py-2.5 px-4 text-slate-600">{industry.email}</td>
                      <td className="py-2.5 px-4 text-slate-600 font-mono text-xs">{industry.phone}</td>
                      <td className="py-2.5 px-4 text-slate-600">{industry.city}</td>
                      <td className="py-2.5 px-4 text-slate-500 text-xs">
                        {new Date(industry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => navigate(`/industries/${industry._id}`)}
                            className="p-1.5 text-slate-600 bg-white-100 rounded-full hover:bg-slate-200 focus:outline-none transition-colors"
                            title="View"
                          >
                            <img src="/assets/view.png" alt="View" className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/industries/${industry._id}/edit`)}
                            className="p-1.5 text-teal-700 bg-white-50 rounded-full hover:bg-teal-100 focus:outline-none transition-colors"
                            title="Edit"
                          >
                            <img src="/assets/edit.png" alt="Edit" className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(industry._id)}
                            className="p-1.5 text-red-700 bg-white-50 rounded-full hover:bg-red-100 focus:outline-none transition-colors"
                            title="Delete"
                          >
                            <img src="/assets/delete.png" alt="Delete" className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50 text-sm text-slate-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
