import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../utils/api";
import Navbar from "../components/Navbar";

export default function LeadView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const res = await API.get(`/leads/${id}`);
        setLead(res.data);
      } catch (err) {
        console.error(err);
        alert("Lead not found");
        navigate("/leads");
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!lead) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lead Details</h2>
          <button
            onClick={() => navigate("/leads")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Back to Leads
          </button>
        </div>

        <div className="bg-white shadow rounded p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold">First Name:</p>
            <p>{lead.first_name}</p>
          </div>
          <div>
            <p className="font-semibold">Last Name:</p>
            <p>{lead.last_name}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{lead.email}</p>
          </div>
          <div>
            <p className="font-semibold">Phone:</p>
            <p>{lead.phone}</p>
          </div>
          <div>
            <p className="font-semibold">Company:</p>
            <p>{lead.company || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">City:</p>
            <p>{lead.city || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">State:</p>
            <p>{lead.state || "-"}</p>
          </div>
          <div>
            <p className="font-semibold">Source:</p>
            <p>{lead.source}</p>
          </div>
          <div>
            <p className="font-semibold">Status:</p>
            <p>{lead.status}</p>
          </div>
          <div>
            <p className="font-semibold">Score:</p>
            <p>{lead.score}</p>
          </div>
          <div>
            <p className="font-semibold">Lead Value:</p>
            <p>{lead.lead_value}</p>
          </div>
          <div>
            <p className="font-semibold">Qualified:</p>
            <p>{lead.is_qualified ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="font-semibold">Last Activity:</p>
            <p>
              {lead.last_activity_at
                ? new Date(lead.last_activity_at).toLocaleString()
                : "-"}
            </p>
          </div>
          <div>
            <p className="font-semibold">Created At:</p>
            <p>{new Date(lead.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold">Updated At:</p>
            <p>{new Date(lead.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
