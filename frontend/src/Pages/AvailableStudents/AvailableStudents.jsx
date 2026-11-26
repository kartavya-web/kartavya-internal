import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AvailableStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/allotment/available`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) {
          console.error("Failed to fetch available students");
          return;
        }
        const data = await res.json();
        setStudents(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading available students...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Students Available for Allotment</h1>
          <Button className="w-full sm:w-auto" onClick={() => navigate("/")} variant="outline">
            Back to Dashboard
          </Button>
        </div>

        <p className="text-lg text-gray-600 mb-6">
          These students are eligible for sponsorship based on their remaining fees and current sponsorship status.
        </p>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No students available for allotment at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.rollNumber} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{student.studentName}</h3>
                  <Badge variant="secondary" className="mt-2">{student.rollNumber}</Badge>
                </div>
                <div className="space-y-2">
                  <p><strong>Class:</strong> {student.class || "N/A"}</p>
                  <p><strong>Centre:</strong> {student.centre}</p>
                  <p><strong>School:</strong> {student.school || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableStudents;