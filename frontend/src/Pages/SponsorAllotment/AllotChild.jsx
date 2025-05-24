import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useSponsor } from "@/context/SponsorContext.jsx";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ChildList from "./ChildList";

const AllotChild = () => {
  const navigate = useNavigate();
  const { sponsorId, sponsorName } = useSponsor();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [childTobeAlloted, setChildTobeAlloted] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);

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
    <div className="px-10">
      <div className="text-3xl font-semibold text-center py-5">
        Child Allotment Page
      </div>
      <div className="pt-10">
        <div className="flex justify-center gap-[200px]">
          <div className="sponsor w-[20%] flex flex-col gap-5 border p-2 rounded-lg text-lg text-center font-semibold">
            <div className="text-sm text-muted-foreground">Sponsor</div>
            <div>{sponsorName}</div>
          </div>

          <div className="child w-[20%] flex flex-col gap-5 border p-2 rounded-lg text-lg text-center font-semibold">
            <div className="text-sm text-muted-foreground">Child</div>
            {selectedChild ? (
              <div className="capitalize">{selectedChild.studentName}</div>
            ) : (
              <div className="text-muted-foreground">
                Select child from list below
              </div>
            )}
          </div>

          <div className="allot-button flex justify-center items-center">
            <Button onClick={handleChildAllotment}>Allot Child</Button>
          </div>
        </div>

        <div className="mt-20">
          <ChildList
            childList={childTobeAlloted}
            handleSelectChild={handleSelectChild}
            selectedChild={selectedChild}
          />
        </div>
      </div>
    </div>
  );
};

export default AllotChild;
