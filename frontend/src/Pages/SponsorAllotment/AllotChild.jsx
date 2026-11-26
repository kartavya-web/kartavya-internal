import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useSponsor } from "@/context/SponsorContext.jsx";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChildList from "./ChildList";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

const AllotChild = () => {
  const navigate = useNavigate();
  const { sponsorId, sponsorName } = useSponsor();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [childTobeAlloted, setChildTobeAlloted] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectChild = (child) => {
    setSelectedChild(child);
  };

  // get child to be alloted
  useEffect(() => {
    const fetchChildTobeAlloted = async () => {
      try {
        const response = await fetch(`/api/allotment/action`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            sponsorId: sponsorId,
          },
        });
        if (!response.ok)
          throw new Error("Failed to fetch child to be alloted");

        const data = await response.json();
        setChildTobeAlloted(data.data);
      } catch (error) {
        toast.error("Error fetching child to be alloted");
        console.error("Error fetching child to be alloted:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildTobeAlloted();
  }, []);

  // allot child to sponsor
  const handleChildAllotment = () => {
    if (!selectedChild) {
      toast.warn("First select student to be alloted.");
      return;
    }
    setLoading(true);
    const allotChild = async () => {
      try {
        const response = await fetch("/api/allotment/allot", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId: selectedChild._id,
            sponsorId: sponsorId,
          }),
        });
        const data = await response.json();
        toast.success(data.message);
        navigate("/allotment");
      } catch (error) {
        toast.error(error.message);
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    allotChild();
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const filteredChildren = childTobeAlloted.filter((child) =>
    child.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );


  if (!sponsorId) {
    return (
      <div className="w-screen h-screen flex justify-center items-center text-2xl font-semibold">
        <div className="w-1/2 flex flex-col justify-center items-center gap-10 py-10 bg-muted rounded-lg border">
          <div className="flex flex-col gap-3">
            <div className="text-center">You may have refreshed the page.</div>
            <div className="text-center">
              Please go back and select a verified donation.
            </div>
          </div>
          <Button onClick={() => navigate("/allotment")}> Go back</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-10">
      <Link to="/allotment">
        <Button className="mt-5"><ArrowLeft></ArrowLeft></Button>
      </Link>
      <div className="text-center text-2xl font-semibold sm:text-3xl">
        Child Allotment Page
      </div>
      <div className="pt-10">
        <div className="flex flex-col items-stretch justify-center gap-4 md:flex-row md:items-center md:gap-6 xl:gap-12">
          <div className="sponsor flex flex-col gap-3 rounded-lg border p-3 text-center text-base font-semibold md:w-1/3 md:text-lg">
            <div className="text-sm text-muted-foreground">Sponsor</div>
            <div>{sponsorName}</div>
          </div>

          <div className="child flex flex-col gap-3 rounded-lg border p-3 text-center text-base font-semibold md:w-1/3 md:text-lg">
            <div className="text-sm text-muted-foreground">Child</div>
            {selectedChild ? (
              <div className="capitalize">{selectedChild.studentName}</div>
            ) : (
              <div className="text-muted-foreground">
                Select child from list below
              </div>
            )}
          </div>

          <div className="allot-button flex items-center justify-center md:w-1/3">
            <Button onClick={handleChildAllotment}>Allot Child</Button>
          </div>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg p-2 text-sm sm:max-w-sm"
          />
          <div> Remaining Students : {childTobeAlloted.length}</div>
        </div>

        <div className="mt-5">
          <ChildList
            childList={filteredChildren}
            handleSelectChild={handleSelectChild}
            selectedChild={selectedChild}
          />
        </div>
      </div>
    </div>
  );
};

export default AllotChild;
