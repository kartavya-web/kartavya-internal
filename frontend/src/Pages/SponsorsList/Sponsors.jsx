// frontend/src/Pages/SponsorsList/Sponsors.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronDown, ChevronUp } from "lucide-react";


export default function Sponsors() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [sponsorsData, setSponsorsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        console.log('Fetching sponsors...');
        const res = await axios.get("/api/users/sponsors", {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('Response:', res);
        console.log('Sponsors data received:', res.data);
        if (Array.isArray(res.data)) {
          setSponsorsData(res.data);
        } else {
          console.error('Received non-array data:', res.data);
          setSponsorsData([]);
        }
      } catch (err) {
        console.error("Error fetching sponsors:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const filteredSponsors = sponsorsData
    .filter((sponsor) => {
      const q = (query || "").toLowerCase().trim();
      if (!q) return true;
      const nameMatch = (sponsor.name || "").toLowerCase().includes(q);
      const studentMatch = (sponsor.sponsoredStudents || []).some((s) =>
        (s.studentName || "").toLowerCase().includes(q)
      );
      return nameMatch || studentMatch;
    })
    .sort((a, b) => (b.sponsoredStudents?.length || 0) - (a.sponsoredStudents?.length || 0));

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar removed as requested; keep top spacing */}
      <div className="h-6" />

      <div className="flex justify-center mt-10 mb-8">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search sponsors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-5 py-3 pl-12 rounded-2xl bg-purple-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <Search className="absolute left-3 top-3.5 text-gray-500" />
        </div>
      </div>

      <div className="space-y-6 px-10 pb-10">
        {filteredSponsors.map((sponsor) => (
          <div
            key={sponsor._id}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col transition hover:shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center text-center space-x-5">
                <img
                  src={sponsor.profileImage || "https://via.placeholder.com/120x120"}
                  alt={sponsor.name}
                  className="w-24 h-24 object-cover rounded-lg bg-gray-200"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {sponsor.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{sponsor.email}</p>
                  <p className="text-sm text-gray-600 mt-1">Contact: {sponsor.contactNumber}</p>
                </div>
              </div>

              <div className="mt-5 md:mt-0 flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-700">Number Of Students Sponsored</p>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-lg font-semibold shadow-sm">
                  {sponsor.sponsoredStudents?.length || 0}
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => toggleExpand(sponsor._id)}
                className="flex items-center text-purple-600 hover:text-purple-800 font-medium transition"
              >
                {expanded === sponsor._id ? (
                  <>
                    Hide Students <ChevronUp className="ml-1" />
                  </>
                ) : (
                  <>
                    View Students <ChevronDown className="ml-1" />
                  </>
                )}
              </button>
            </div>

            {expanded === sponsor._id && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <table className="min-w-full text-left text-sm text-gray-700">
                  <thead>
                    <tr className="text-gray-500 border-b">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Class</th>
                      <th className="pb-2">Centre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsor.sponsoredStudents?.map((student) => (
                      <tr key={student._id} className="border-b last:border-none hover:bg-gray-50">
                        <td className="py-2">{student.studentName}</td>
                        <td className="py-2">{student.class}</td>
                        <td className="py-2">{student.centre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
