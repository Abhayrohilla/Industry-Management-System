import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createApiClient } from "../api";
import { useAuth } from "../hooks/useAuth";
import { Industry } from "../types";

export function IndustryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadIndustry() {
      if (!auth.token || !id) return;
      setLoading(true);
      try {
        const api = createApiClient(auth.token);
        const response = await api.get<Industry>(`/industries/${id}`);
        setIndustry(response.data);
      } catch {
        setError("Failed to load industry");
      } finally {
        setLoading(false);
      }
    }

    loadIndustry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token, id]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center justify-between h-14 px-6 bg-slate-900 text-white border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Registry</span>
          <span className="text-slate-100 font-semibold tracking-tight">Industry details</span>
        </div>
        <div className="flex items-center gap-2">
          {industry && (
            <button
              type="button"
              onClick={() => navigate(`/industries/${industry._id}/edit`)}
              className="px-3 py-1.5 text-sm font-medium text-teal-300 hover:text-teal-100 hover:bg-slate-700/50 rounded-md transition-colors"
            >
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("/industries")}
            className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
          >
            Back to list
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-3xl w-full mx-auto">
        {loading && (
          <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
            <span className="animate-pulse">Loading…</span>
          </div>
        )}
        {error && (
          <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        {industry && !loading && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{industry.name}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{industry.type}</p>
                <span className="inline-block mt-2 font-mono text-xs text-slate-400">
                  ID: {industry._id}
                </span>
              </div>
            </div>

            <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Contact
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Contact person</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{industry.contactPerson}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">
                    <a
                      href={`mailto:${industry.email}`}
                      className="text-teal-600 hover:underline"
                    >
                      {industry.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</dt>
                  <dd className="mt-0.5 text-sm font-mono text-slate-800">{industry.phone}</dd>
                </div>
                {industry.website && (
                  <div>
                    <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Website</dt>
                    <dd className="mt-0.5 text-sm">
                      <a
                        href={industry.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-600 hover:underline break-all"
                      >
                        {industry.website}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Location
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{industry.address}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">City</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{industry.city}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">State</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{industry.state || "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-400 uppercase tracking-wider">Country</dt>
                  <dd className="mt-0.5 text-sm text-slate-800">{industry.country}</dd>
                </div>
              </dl>
            </section>

            {industry.description && (
              <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Description
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {industry.description}
                </p>
              </section>
            )}

            <div className="text-xs text-slate-400 pt-1">
              Created {new Date(industry.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
