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
    <div className="relative flex flex-col justify-center items-center gap-10">
      <div className="w-full h-auto sticky top-0 border-b bg-white z-[100]">
        <div className="heading relative w-full flex justify-center text-3xl font-bold text-center py-5">
          Student Details Spreadsheet
          <Button
            onClick={handleLogout}
            varient="outline"
            className="absolute right-10"
          >
            Log Out
          </Button>
        </div>
        <div className="w-full flex justify-between px-10 py-5">
          <Input
            type="text"
            placeholder="Search for student with name"
            value={searchQuery}
            onChange={handleInputChange}
            className="rounded-lg p-2 w-[30%]"
          />
          <div> Student Count : <span className="font-bold">{studentsSearchedByName?.length}</span></div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <StudentTable filteredStudents={studentsSearchedByName} />
      </div>
    </div>
  );
};

export default SpreadsheetBody;
