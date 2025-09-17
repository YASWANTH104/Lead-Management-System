import React, { useState, useEffect, useCallback } from "react";
import { API } from "../utils/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import ActionsCellRenderer from "../components/ActionsCellRenderer";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Leads() {
  const [rowData, setRowData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [filterInputs, setFilterInputs] = useState({});
  const navigate = useNavigate();

  const fetchLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();
      const res = await API.get(`/leads?${params}`);
      setRowData(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      console.error(err);
    }
  }, [page, limit, filters, navigate]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const deleteLead = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await API.delete(`/leads/${id}`);
    fetchLeads();
  };

  const columns = [
    { field: "first_name", headerName: "First Name", flex: 1, minWidth: 100 },
    { field: "last_name", headerName: "Last Name", flex: 1, minWidth: 100 },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 150 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 120 },
    { field: "company", headerName: "Company", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
    {
      headerName: "Actions",
      field: "_id",
      minWidth: 220,
      flex: 1,
      cellRenderer: ActionsCellRenderer,
      cellRendererParams: { deleteLead },
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox groups (status, source)
    if (type === "checkbox") {
      setFilterInputs((prev) => {
        const current = prev[name] ? prev[name].split(",") : [];
        let updatedValues;

        if (checked) {
          updatedValues = [...current, value];
        } else {
          updatedValues = current.filter((v) => v !== value);
        }

        return {
          ...prev,
          [name]: updatedValues.join(","),
        };
      });

      setFilters((prev) => {
        const current = prev[name] ? prev[name].split(",") : [];
        let updatedValues;

        if (checked) {
          updatedValues = [...current, value];
        } else {
          updatedValues = current.filter((v) => v !== value);
        }

        if (updatedValues.length === 0) {
          const updated = { ...prev };
          delete updated[name];
          return updated;
        }

        return { ...prev, [name]: updatedValues.join(",") };
      });

      return;
    }

    // Default input/select handling
    setFilterInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFilters((prev) => {
      const updated = { ...prev };
      if (value === "" || value == null) {
        delete updated[name];
      } else {
        updated[name] = value;
      }
      return updated;
    });

    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setFilterInputs({});
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="p-4 md:p-6 flex-1 bg-gradient-to-br from-blue-300 via-purple-200 to-pink-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold">Leads</h2>
          <button
            onClick={() => navigate("/leads/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Lead
          </button>
        </div>

        {/* 🔹 Filter Panel with Labels */}
        <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* String filters */}
          <label>
            Email contains
            <input
              name="email_contains"
              value={filterInputs.email_contains || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>

          <label>
            Company contains
            <input
              name="company_contains"
              value={filterInputs.company_contains || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>

          <label>
            City contains
            <input
              name="city_contains"
              value={filterInputs.city_contains || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>

          {/* Enum filters (multi-select checkboxes) */}
          <label className="col-span-1 md:col-span-3">
            Status
            <div className="flex gap-4 mt-1">
              {["new", "contacted", "qualified"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="status"
                    value={status}
                    checked={(filterInputs.status || "").split(",").includes(status)}
                    onChange={handleFilterChange}
                  />
                  {status}
                </label>
              ))}
            </div>
          </label>

          <label className="col-span-1 md:col-span-3">
            Source
            <div className="flex gap-4 mt-1">
              {["website", "referral", "ad", "event"].map((src) => (
                <label key={src} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="source"
                    value={src}
                    checked={(filterInputs.source || "").split(",").includes(src)}
                    onChange={handleFilterChange}
                  />
                  {src}
                </label>
              ))}
            </div>
          </label>

          {/* Number filters */}
          <label>
            Score =
            <input
              name="score_eq"
              type="number"
              value={filterInputs.score_eq || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Score &gt;
            <input
              name="score_gt"
              type="number"
              value={filterInputs.score_gt || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Score &lt;
            <input
              name="score_lt"
              type="number"
              value={filterInputs.score_lt || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Lead Value between
            <input
              name="lead_value_between"
              placeholder="100,500"
              value={filterInputs.lead_value_between || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>

          {/* Date filters */}
          <label>
            Created After
            <input
              name="created_after"
              type="date"
              value={filterInputs.created_after || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Created Before
            <input
              name="created_before"
              type="date"
              value={filterInputs.created_before || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Created Between
            <input
              name="created_between"
              placeholder="2024-01-01,2024-12-31"
              value={filterInputs.created_between || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Last Activity After
            <input
              name="last_activity_after"
              type="date"
              value={filterInputs.last_activity_after || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Last Activity Before
            <input
              name="last_activity_before"
              type="date"
              value={filterInputs.last_activity_before || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            />
          </label>

          {/* Boolean filter */}
          <label>
            Qualified?
            <select
              name="is_qualified"
              value={filterInputs.is_qualified || ""}
              className="border p-2 rounded w-full"
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>

          {/* Clear filters */}
          <button
            onClick={clearFilters}
            className="col-span-1 md:col-span-3 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* AG Grid */}
        <div className="ag-theme-alpine w-full" style={{ height: 500 }}>
          <AgGridReact rowData={rowData} columnDefs={columns} pagination={false} />
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-center items-center mt-4 gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
          >
            Prev
          </button>
          <span className="px-3 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
