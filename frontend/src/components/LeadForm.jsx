import React, { useState, useEffect } from "react";
import { API } from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

export default function LeadForm() {
  const [lead, setLead] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    is_qualified: false,
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      API.get(`/leads/${id}`).then((res) => setLead(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLead({ ...lead, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      await API.put(`/leads/${id}`, lead);
    } else {
      await API.post("/leads", lead);
    }
    navigate("/leads");
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-200 p-6">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-3xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            {id ? "Edit Lead" : "Create Lead"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              "first_name",
              "last_name",
              "email",
              "phone",
              "company",
              "city",
              "state",
            ].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="mb-1 font-semibold text-gray-700">
                  {field.replace("_", " ").toUpperCase()}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={lead[field]}
                  onChange={handleChange}
                  required={["email", "first_name", "last_name"].includes(
                    field
                  )}
                  className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
            ))}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">Source</label>
              <select
                name="source"
                value={lead.source}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              >
                <option value="website">Website</option>
                <option value="facebook_ads">Facebook Ads</option>
                <option value="google_ads">Google Ads</option>
                <option value="referral">Referral</option>
                <option value="events">Events</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">Status</label>
              <select
                name="status"
                value={lead.status}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
                <option value="won">Won</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">Score</label>
              <input
                type="number"
                name="score"
                value={lead.score}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">
                Lead Value
              </label>
              <input
                type="number"
                name="lead_value"
                value={lead.lead_value}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                name="is_qualified"
                checked={lead.is_qualified}
                onChange={handleChange}
                className="w-5 h-5 accent-green-500"
              />
              <label className="font-semibold text-gray-700">Qualified?</label>
            </div>

            <div className="col-span-2 flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/leads")}
                className="bg-gray-400 text-white px-6 py-2 rounded-xl hover:bg-gray-500 transition"
              >
                Back
              </button>

              <button
                type="submit"
                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-xl shadow-lg"
              >
                {id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
