import React, { useEffect, useMemo, useState } from "react";
import StudentTable from "./StudentTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const SpreadsheetBody = ({ studentData }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState(studentData);
  const [studentsSearchedByName, setStudentsSearchedByName] =
    useState(students);
  const navigate = useNavigate();

  useEffect(() => {
    setStudentsSearchedByName(studentData);
  }, [studentData]);

  useEffect(() => {
    setStudentsSearchedByName(
      studentData?.filter((student) =>
        student.studentName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, studentData]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="relative flex min-w-0 flex-col items-center justify-center gap-6 sm:gap-10">
      <div className="sticky top-0 z-[100] h-auto w-full border-b bg-white">
        <div className="heading relative flex w-full flex-col items-center justify-center gap-3 px-3 py-4 text-center text-xl font-bold sm:px-5 sm:text-2xl lg:flex-row lg:gap-0 lg:py-5 lg:text-3xl">
          Student Details Spreadsheet
          <Button
            onClick={handleLogout}
            varient="outline"
            className="mt-0 px-4 lg:absolute lg:right-10 lg:mt-0"
          >
            Log Out
          </Button>
        </div>
        <div className="flex w-full flex-col gap-3 px-3 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <Input
            type="text"
            placeholder="Search for student with name"
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full rounded-lg p-2 sm:w-[min(30%,24rem)]"
          />
          <div>
            {" "}
            Student Count :{" "}
            <span className="font-bold">{studentsSearchedByName?.length}</span>
          </div>
          <div>
            <span
              className="inline-block w-2 h-2 mr-2 rounded-full bg-green-600"
              title="Verified"
            />
            Aadhar Verified
          </div>
        </div>
      </div>
      <div className="w-full min-w-0 overflow-x-auto flex justify-center items-center">
        <StudentTable filteredStudents={studentsSearchedByName} />
      </div>
    </div>
  );
};

export default SpreadsheetBody;
