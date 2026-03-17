import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { Button } from "@/components/ui/button";

const DonationPipeline = () => {
  const navigate = useNavigate();
  const [donationGroups, setDonationGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessingId, setIsProcessingId] = useState(null);
  const [academicYears, setAcademicYears] = useState({});

  useEffect(() => {
    fetchDonations();
  }, []);

  // Helper: Get academic year (April to March) for a specific date
  const getAcademicYearForDate = (dateString) => {
    const date = dateString ? new Date(dateString) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth(); // 0 = Jan, 3 = April

    if (month >= 3) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/allotment/pipeline", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const groups = response.data.data || [];
      setDonationGroups(groups);

      // Initialize academic years for each donation
      const years = {};
      groups.forEach(group => {
        group.donations.forEach(donation => {
          // Priority: 1. Existing donation.academicYear, 2. Year based on its donationDate
          years[donation.id] = donation.academicYear || getAcademicYearForDate(donation.donationDate);
        });
      });
      setAcademicYears(years);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  };



  const handleProcessDonation = async (donationId, amount, numChild, currentCount) => {
    const academicYear = academicYears[donationId];
    if (!academicYear) return alert("Please specify an academic year.");

    try {
      setIsProcessingId(donationId);
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/allotment/process-donation",
        { donationId, academicYear },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchDonations();
      alert("✅ Donation processed successfully!");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Failed to process donation"));
    } finally {
      setIsProcessingId(null);
    }
  };

  const isFutureYear = (donationId) => {
    const selected = academicYears[donationId];
    if (!selected || typeof selected !== 'string') return false;
    
    // Get actual current academic year based on today's date
    const currentAY = getAcademicYearForDate(); // no args = today
    
    const selectedStart = parseInt(selected.split("-")[0]);
    const currentStart = parseInt(currentAY.split("-")[0]);
    
    // Disable if the selected year starts AFTER the current academic year
    return selectedStart > currentStart;
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logos.png" alt="Kartavya Logo" className="h-10 w-auto object-contain" />
          </Link>

          {/* Title Section */}
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Donation Pipeline
          </h1>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
              onClick={fetchDonations}
            >
              Refresh List
            </Button>
            <Button 
              variant="default"
              size="sm"
              className="gap-2 bg-[#025f43] hover:bg-[#1a604a] text-white font-semibold"
              onClick={() => navigate("/")}
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto w-full space-y-12">
          {donationGroups.length > 0 ? (
            donationGroups.map((group) => (
              <div key={group.userId} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Sponsor Header Card */}
                <div className="p-6 border-b border-slate-100 bg-white">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{group.userName}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-sm text-slate-600 truncate">{group.userEmail}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Batch</p>
                      <p className="text-sm text-slate-600">{group.userBatch || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Sponsored</p>
                      <p className="text-sm font-bold text-blue-600">{group.currentCount} Students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Total</p>
                      <p className="text-sm font-bold text-purple-600">{group.donations.length} Donation{group.donations.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Donation Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#F8FAFC]">
                      <tr className="border-b border-slate-100">
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Donation ID</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Donation Date</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Year</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Children to sponsor</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Donation Amount</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {group.donations.map((donation) => {
                        const newCount = donation.numChild;
                        const currentCount = group.currentCount;
                        const processing = isProcessingId === donation.id;
                        const futureRestricted = isFutureYear(donation.id);

                        return (
                          <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{donation.id.slice(-8)}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {new Date(donation.donationDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
                            </td>
                            <td className="px-6 py-4">
                              <div className="w-32 px-3 py-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-md">
                                {academicYears[donation.id] || "N/A"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                                  {donation.numChild}
                                </span>
                                {newCount !== currentCount && (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    newCount > currentCount ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                  }`}>
                                    {newCount > currentCount ? `+${newCount - currentCount}` : `-${currentCount - newCount}`}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-700">₹{donation.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleProcessDonation(donation.id, donation.amount, donation.numChild, group.currentCount)}
                                disabled={processing || futureRestricted}
                                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                  futureRestricted 
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                    : "bg-[#025f43] text-white hover:bg-[#1a604a] active:scale-95"
                                }`}
                              >
                                {processing ? "..." : futureRestricted ? "Restricted" : "Process"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="text-4xl mb-4 text-slate-300 italic">No pending donations</div>
              <p className="text-slate-400 font-medium">Pipeline is currently clear.</p>
              <Button onClick={fetchDonations} variant="link" className="mt-4 text-blue-600">Refresh List</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DonationPipeline;
