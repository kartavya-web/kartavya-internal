import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthVerify from "@/helper/jwtVerify";

const AddDonationsToCSM = () => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [donationId, setDonationId] = useState("");
  const [date, setDate] = useState("");
  const [numChild, setNumChild] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!AuthVerify()) {
      navigate("/login", { replace: true });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: userId,
      name,
      donations: [
        {
          donationId,
          date,
          numChild: Number(numChild),
        },
      ],
    };

    try {
      const res = await fetch("/api/allotment/addDonationsToCSM", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if(!res.ok) {
        const error = await res.json();
        throw new Error(error.message|| "Failed to insert data");
      }
      
      toast.success("Data inserted successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="w-full px-6 py-4 bg-white shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-full h-[60px]">
            <img
              src="/logos.png"
              alt="Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
        <Button
          onClick={() => navigate("/student-spreadsheet")}
          className="px-4 py-2 rounded-lg"
        >
          Student Spreadsheet
        </Button>
      </header>

      {/* Form Section */}
      <main className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add Donation to CSM Table
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>
              Donation ID
            </Label>
            <Input
              type="text"
              value={donationId}
              onChange={(e) => setDonationId(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
            />
          </div>

          <div>
            <Label>
              User Name
            </Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
            />
          </div>

          <div>
            <Label>
              User ID
            </Label>
            <Input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
            />
          </div>

          <div>
            <Label>
              Date (Paste directly from MongoDB)
            </Label>
            <Input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. 2025-07-12T00:00:00.000+00:00"
              required
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm font-mono focus:outline-none focus:ring focus:border-primary"
            />
          </div>

          <div>
            <Label>
              Number of Children
            </Label>
            <Input
              type="number"
              value={numChild}
              onChange={(e) => setNumChild(e.target.value)}
              min="0"
              className="mt-1 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2 px-4 rounded-lg"
          >
            Submit
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AddDonationsToCSM;
