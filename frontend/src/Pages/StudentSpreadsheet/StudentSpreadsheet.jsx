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

  // Normalize class values so "L.K.G" matches "LKG", "U.K.G" matches "UKG", etc.
  const normalizeClassValue = (val) => {
    if (typeof val !== "string") return val;
    return val.replace(/\./g, "").trim().toUpperCase();
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

        // For class filter, normalize both sides to handle "L.K.G" vs "LKG" etc.
        if (filterKey === "class") {
          const normalizedStudentVal = normalizeClassValue(studentValue);
          const normalizedFilterVals = activeFilterValues.map(normalizeClassValue);
          if (!normalizedFilterVals.includes(normalizedStudentVal)) {
            return false;
          }
        } else {
          if (!activeFilterValues.includes(studentValue)) {
            return false;
          }
        }

      }
      return true;
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden select-none lg:flex-row">
      <div className="flex w-full flex-col gap-6 border-b border-r-[#DDE4EB] px-3 py-4 sm:px-5 lg:sticky lg:top-0 lg:h-screen lg:w-[21%] lg:gap-10 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-[10px]">
        <div className="logo w-full">
          <img src="/logos.png" alt="logos" className="mx-auto h-16 object-contain lg:h-4/5" />
        </div>

        <div className="flex flex-col justify-between gap-6 lg:h-full">
          <div className="filters flex flex-col items-center gap-4">
            <div className="text-2xl font-semibold text-center lg:text-3xl">Filters</div>

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

          <div className="filters flex flex-col items-center gap-3 lg:mb-12">
            <div className="text-2xl font-semibold text-center lg:text-3xl">
              Add Student
            </div>
            <Button onClick={() => navigate("/enter-student-details")}>
              Add Student
            </Button>
          </div>
        </div>
      </div>
      <div className="hero min-w-0 w-full overflow-x-auto lg:h-screen lg:w-[80%] lg:overflow-y-auto">
        <SpreadsheetBody studentData={filteredData} />
      </div>
    </div>
  );
};

export default StudentSpreadsheet;
