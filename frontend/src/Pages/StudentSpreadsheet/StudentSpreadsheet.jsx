import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SpreadsheetBody from "./SpreadsheetBody";
import { toast } from "react-toastify";
import FilterComponent from "@/components/Filters/DropdownMenu";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import { Classes } from "@/constants/constants";
import { Centres } from "@/constants/constants";
import { SponsorshipStatus } from "@/constants/constants";
import { ActiveStatus } from "@/constants/constants";
import { Schools } from "@/constants/constants";
import { AadharVerifiedStatus } from "@/constants/constants";


const StudentSpreadsheet = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState(null);
  const [filteredData, setFilteredData] = useState(students);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("studentFilters");
    return saved ? JSON.parse(saved) : {
      centre: [],
      class: [],
      sponsorshipStatus: [],
      activeStatus: [],
      school: [],
      profileAadharVerified: [],
    };
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students/", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.status != 200) {
          navigate("/login", { replace: true });
          setStudents(null);
          return;
        }
        setStudents(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching students");
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const data = filterData();
    console.log('filters', filters)
    setFilteredData(data);
  }, [filters]);

  const handleFilterChange = (name, queries) => {
    setFilters((prev) => {
      const updated = { ...prev, [name]: queries };
      localStorage.setItem("studentFilters", JSON.stringify(updated));
      return updated;
    });
  };

  const filterData = () => {
    return students?.filter((student) => {
      for (const filterKey in filters) {
        const activeFilterValues = filters[filterKey].map((item) => item.value);

        if (activeFilterValues.length === 0) continue;

        const studentValue =
          student[filterKey] === undefined || student[filterKey] === null
            ? false
            : student[filterKey];

        if (!activeFilterValues.includes(studentValue)) {
          return false;
        }

      }
      return true;
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="flex select-none overflow-hidden relative">
      <div className="w-[21%] h-screen flex flex-col gap-10 sticky top-0 overflow-y-auto pl-[10px] pr-[10px] border-r border-r-[#DDE4EB]">
        <div className="logo w-full">
          <img src="/logos.png" alt="logos" className="object-contain h-4/5" />
        </div>

        <div className="h-full flex flex-col justify-between">
          <div className="filters flex flex-col items-center gap-5">
            <div className="text-3xl font-semibold text-center">Filters</div>

            <FilterComponent
              filterLable={"Class"}
              filterName="class"
              filterOptions={Classes}
              handleFilterChange={handleFilterChange}
              selectedOptions={filters.class}
            />

            <FilterComponent
              filterLable={"Centre"}
              filterName="centre"
              filterOptions={Centres}
              handleFilterChange={handleFilterChange}
              selectedOptions={filters.centre}
            />

            <FilterComponent
              filterLable={"Sponsorship Status"}
              filterName="sponsorshipStatus"
              filterOptions={SponsorshipStatus}
              handleFilterChange={handleFilterChange}
              selectedOptions={filters.sponsorshipStatus}
            />

            <FilterComponent
              filterLable={"School"}
              filterName="school"
              filterOptions={Schools}
              handleFilterChange={handleFilterChange}
              selectedOptions={filters.school}
            />

            <FilterComponent
              filterLable={"Active Status"}
              filterName="activeStatus"
              filterOptions={ActiveStatus}
              handleFilterChange={handleFilterChange}
              selectedOptions={filters.activeStatus}
            />

            <FilterComponent
              filterLable={"Aadhaar Verified"}
              filterName="profileAadharVerified"
              filterOptions={AadharVerifiedStatus}
              handleFilterChange={handleFilterChange}
              selectedOptions={filters.profileAadharVerified}
            />



            {/* 
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 pt-10">
              <Button type="submit"> Apply Filters</Button>
              <Button variant="secondary">Clear Filters</Button>
            </div>
          </form> */}
          </div>

          <div className="filters flex flex-col items-center gap-5 mb-12">
            <div className="text-3xl font-semibold text-center">
              Add Student
            </div>
            <Button onClick={() => navigate("/enter-student-details")}>
              Add Student
            </Button>
          </div>
        </div>
      </div>
      <div className="hero w-[80%] h-screen overflow-y-auto">
        <SpreadsheetBody studentData={filteredData} />
      </div>
    </div>
  );
};

export default StudentSpreadsheet;
