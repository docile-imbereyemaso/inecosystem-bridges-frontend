import { useEffect, useState } from "react";

interface Opportunity {
  opportunity_id?: number;
  created_by: number;
  title: string;
  type: "scholarship" | "grant" | "competition" | "workshop" | "training";
  description: string;
  eligibility?: string;
  benefits?: string;
  application_deadline: string;
  application_link?: string;
  value?: number;
  duration?: string;
  location?: string;
  requirements?: string[];
  tags?: string[];
  is_active?: boolean;
}

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [formData, setFormData] = useState<Opportunity>({
    created_by: 1, // default or logged-in user ID
    title: "",
    type: "scholarship",
    description: "",
    application_deadline: "",
    requirements: [],
    tags: [],
  });

  // Fetch opportunities from backend
  const fetchOpportunities = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/opportunities");
      const data = await res.json();
      setOpportunities(data);
    } catch (err) {
      console.error("Error fetching opportunities:", err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchOpportunities(); // Refresh list
        setFormData({
          created_by: 1,
          title: "",
          type: "scholarship",
          description: "",
          application_deadline: "",
          requirements: [],
          tags: [],
        });
      }
    } catch (err) {
      console.error("Error adding opportunity:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Opportunities</h2>

      {/* Opportunity List */}
      <ul className="mb-8 space-y-4">
        {opportunities.map((opp) => (
          <li key={opp.opportunity_id} className="p-4 border rounded shadow">
            <h3 className="text-xl font-semibold">{opp.title}</h3>
            <p>Type: {opp.type}</p>
            <p>Description: {opp.description}</p>
            <p>Deadline: {new Date(opp.application_deadline).toLocaleDateString()}</p>
            {opp.location && <p>Location: {opp.location}</p>}
            {opp.value && <p>Value: ${opp.value}</p>}
            {opp.requirements && opp.requirements.length > 0 && (
              <p>Requirements: {opp.requirements.join(", ")}</p>
            )}
            {opp.tags && opp.tags.length > 0 && <p>Tags: {opp.tags.join(", ")}</p>}
          </li>
        ))}
      </ul>

      {/* Add Opportunity Form */}
      <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as Opportunity["type"] })
          }
          className="w-full border p-2 rounded"
        >
          <option value="scholarship">Scholarship</option>
          <option value="grant">Grant</option>
          <option value="competition">Competition</option>
          <option value="workshop">Workshop</option>
          <option value="training">Training</option>
        </select>
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="date"
          value={formData.application_deadline}
          onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={formData.location || ""}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Value"
          value={formData.value || ""}
          onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Requirements (comma separated)"
          value={formData.requirements?.join(",") || ""}
          onChange={(e) =>
            setFormData({ ...formData, requirements: e.target.value.split(",") })
          }
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={formData.tags?.join(",") || ""}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",") })}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Opportunity
        </button>
      </form>
    </div>
  );
}
