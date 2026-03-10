import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createApiClient } from "../api";
import { useAuth } from "../hooks/useAuth";
import { Industry } from "../types";

export function IndustryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    type: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    website: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIndustry() {
      if (!auth.token || !id || !isEditMode) return;
      try {
        const api = createApiClient(auth.token);
        const response = await api.get<Industry>(`/industries/${id}`);
        const industry = response.data;
        setForm({
          name: industry.name,
          type: industry.type,
          contactPerson: industry.contactPerson,
          email: industry.email,
          phone: industry.phone,
          address: industry.address,
          city: industry.city,
          state: industry.state || "",
          country: industry.country,
          website: industry.website || "",
          description: industry.description || ""
        });
      } catch {
        setError("Failed to load industry");
      }
    }

    loadIndustry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token, id, isEditMode]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!auth.token) return;
    setLoading(true);
    setError(null);
    try {
      const api = createApiClient(auth.token);
      if (isEditMode && id) {
        await api.put(`/industries/${id}`, form);
      } else {
        await api.post("/industries", form);
      }
      navigate("/industries");
    } catch {
      setError("Failed to save industry");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-10 px-3 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400";
  const labelClass = "text-xs font-medium text-slate-600 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="flex items-center justify-between h-14 px-6 bg-slate-900 text-white border-b border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-mono text-xs uppercase tracking-wider">Registry</span>
          <span className="text-slate-100 font-semibold tracking-tight">
            {isEditMode ? "Edit industry" : "Add industry"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigate("/industries")}
          className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
        >
          Back to list
        </button>
      </header>

      <main className="flex-1 p-6 max-w-3xl w-full mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Company
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="sm:col-span-2">
                <span className={labelClass}>Industry name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={`${inputClass} w-full`}
                />
              </label>
              <label>
                <span className={labelClass}>Industry type</span>
                <input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className={`${inputClass} w-full`}
                />
              </label>
              <label className="sm:col-span-2">
                <span className={labelClass}>Description (optional)</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} w-full resize-y min-h-[80px]`}
                />
              </label>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label>
                <span className={labelClass}>Contact person</span>
                <input
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  required
                  className={`${inputClass} w-full`}
                />
              </label>
              <label>
                <span className={labelClass}>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={`${inputClass} w-full`}
                />
              </label>
              <label>
                <span className={labelClass}>Phone</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className={`${inputClass} w-full`}
                />
              </label>
              <label>
                <span className={labelClass}>Website (optional)</span>
                <input
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </label>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
              Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="sm:col-span-2">
                <span className={labelClass}>Address</span>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className={`${inputClass} w-full`}
                />
              </label>
              <label>
                <span className={labelClass}>City</span>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className={`${inputClass} w-full`}
                />
              </label>
              <label>
                <span className={labelClass}>State (optional)</span>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                />
              </label>
              <label>
                <span className={labelClass}>Country</span>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className={`${inputClass} w-full`}
                />
              </label>
            </div>
          </section>

          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/industries")}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving…" : isEditMode ? "Save changes" : "Create industry"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
