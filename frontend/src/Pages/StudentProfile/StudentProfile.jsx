import InputComponent from "@/components/Form/InputComponent";
import SelectComponent from "@/components/Form/SelectComponent";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect, useState } from "react";
// import StudentProgressGraph from "./StudentProgressGraph";
// import AttendanceMonitoringGraph from "./AttendenceMonitoringGraph";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";
import DialogForResultEdit from "../../components/Dialogs/DialogForResultEdit";
import DialogForPdfPreview from "../../components/Dialogs/DialogForPdfPreview";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { AlertForDialogDeletion } from "@/components/AlertForStudentDeletion";
import DialogForProfilePhotoUpdate from "../../components/Dialogs/DialogForProfilePhotoUpdate";
import AuthVerify from "@/helper/jwtVerify";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TextareaComponent from "@/components/Form/TextareaComponent";
import { Link } from "react-router-dom";
import { Centres, Gender, Schools } from "@/constants/constants";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [studentData, setStudentData] = useState(null);
  const [studentDataChanged, setStudentDataChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("studentData", studentData);
  }, [studentData]);

  useEffect(() => {
    if (!AuthVerify()) navigate("/login");
  }, []);

  // get student data
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await fetch(
          `/api/students/${encodeURIComponent(id)}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch student data");
        const data = await response.json();

        setStudentData(data);
      } catch (error) {
        toast.error("Error fetching student");
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setStudentData({
      ...studentData,
      [name]: type === "checkbox" ? checked : value,
    });
    setStudentDataChanged(true);
  };

  // update student data
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      for (const key in studentData) {
        formDataToSend.append(key, studentData[key]);
      }

      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(studentData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update student data");
      }

      const message = await res.json();
      console.log(message, "message");

      toast.success(message.message);
      setStudentDataChanged(false);
    } catch (e) {
      toast.error(`Error updating student data: ${e.message}`);
      return;
    }
  };

  // delete student
  const handleDeleteStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete student");
      }

      navigate("/student-spreadsheet");
      toast.success("Student deleted successfully!");
    } catch (e) {
      toast.error(`Error deleting student data: ${e.message}`);
      return;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex select-none">
      <div className="sticky top-0 flex flex-col gap-10 sidebar w-[21%] h-screen pl-[10px] pr-[10px] border-r border-r-[#DDE4EB]">
        <Link to="/">
          <div className="logo w-full">
            <img src="/logos.png" alt="logos" className="object-contain" />
          </div>
        </Link>

        <div className="basic-details">
          <div className="filters flex flex-col items-center p-[10px]">
            <div className="profile-photo h-[270px] w-[220px] bg-cover rounded-lg border overflow-hidden">
              <img
                src={studentData?.profilePhoto || "/student.jpg"}
                alt="profile-photo"
                className="w-full h-full object-cover"
              />
            </div>
            <DialogForProfilePhotoUpdate
              photoExists={studentData?.profilePhoto}
            />
          </div>

          <div className="basic-details p-4">
            <div className="label text-xl font-bold text-primary mb-4">
              Basic Details
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-semibold text-gray-700">Name:</div>
              <div className="col-span-2">{studentData?.studentName}</div>

              <div className="font-semibold text-gray-700">Roll No.:</div>
              <div className="col-span-2">{studentData?.rollNumber}</div>

              <div className="font-semibold text-gray-700">Class:</div>
              <div className="col-span-2">{studentData?.class}</div>

              <div className="font-semibold text-gray-700">Center:</div>
              <div className="col-span-2">{studentData?.centre}</div>

              <div className="font-semibold text-gray-700">Status:</div>
              <div className="col-span-2">
                <select
                  id={"activeStatus"}
                  name={"activeStatus"}
                  value={studentData?.activeStatus}
                  className={`w-full outline-none rounded-lg font-semibold`}
                  onChange={handleInputChange}
                >
                  {/* <option value="" disabled>
                    Select active status
                  </option> */}
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero flex flex-col w-[80%]  bg-fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(222,80,85,0.4),transparent),radial-gradient(ellipse_at_top_left,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_top_right,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_bottom_left,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_bottom_right,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0))]">
        <div className="heading text-3xl font-semibold text-center pt-5 pb-5 border-b w-full">
          Student Profile
        </div>

        {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        {/* General Details */}

        <div className="general-details w-[90%] m-auto mt-10">
          <div className="w-full flex justify-between text-2xl h-10 font-semibold text-primary">
            General Details
            {studentDataChanged && (
              <Button onClick={handleSaveChanges}>
                <CheckIcon /> <span className="ml-2"> Save Changes</span>
              </Button>
            )}
          </div>
          <div className="input-section flex flex-col items-end w-full pt-8 gap-[1.2rem]">
            {/* Row 1 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Name of Student"}
                  name={"studentName"}
                  type={"text"}
                  value={studentData?.studentName}
                  placeholder={"Name"}
                  handleInputChange={handleInputChange}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <SelectComponent
                  title={"Gender"}
                  name={"gender"}
                  options={Gender}
                  handleInputChange={handleInputChange}
                  value={studentData?.gender}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Date of birth of Student"}
                  name={"dob"}
                  type={"date"}
                  placeholder={"Date of birth"}
                  handleInputChange={handleInputChange}
                  value={
                    studentData?.dob
                      ? new Date(studentData.dob).toISOString().split("T")[0]
                      : ""
                  }
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Address of Student"}
                  name={"address"}
                  type={"text"}
                  placeholder={"Address"}
                  handleInputChange={handleInputChange}
                  value={studentData?.address}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Current Session"}
                  name={"currentSession"}
                  type={"text"}
                  placeholder={"Session"}
                  handleInputChange={handleInputChange}
                  value={studentData?.currentSession}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Class of Student"}
                  name={"class"}
                  type={"text"}
                  placeholder={"Class"}
                  handleInputChange={handleInputChange}
                  value={studentData?.class}
                />
              </div>
            </div>

            {/* Row 4 */}

            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <SelectComponent
                  title={"Center of Student"}
                  name={"centre"}
                  options={Centres}
                  handleInputChange={handleInputChange}
                  value={studentData?.centre}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <SelectComponent
                  title={"School of Student"}
                  name={"school"}
                  options={Schools}
                  handleInputChange={handleInputChange}
                  value={studentData?.school}
                />
              </div>
            </div>

            {/* Row 5 */}

            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Father's Name"}
                  name={"fathersName"}
                  type={"text"}
                  placeholder={"Father's Name"}
                  handleInputChange={handleInputChange}
                  value={studentData?.fathersName}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Fathers's Occupation"}
                  name={"fathersOccupation"}
                  type={"text"}
                  placeholder={"Father's Occupation"}
                  handleInputChange={handleInputChange}
                  value={studentData?.fathersOccupation}
                />
              </div>
            </div>

            {/* Row 6 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Mother's Name"}
                  name={"mothersName"}
                  type={"text"}
                  placeholder={"Mother's Name"}
                  handleInputChange={handleInputChange}
                  value={studentData?.mothersName}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Mothers's Occupation"}
                  name={"mothersOccupation"}
                  type={"text"}
                  placeholder={"Mother's Occupation"}
                  handleInputChange={handleInputChange}
                  value={studentData?.mothersOccupation}
                />
              </div>
            </div>

            {/* Row 7 */}
            <div className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full">
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Annual Family Income"}
                  name={"annualIncome"}
                  type={"number"}
                  placeholder={"Family Income"}
                  handleInputChange={handleInputChange}
                  value={studentData?.annualIncome}
                />
              </div>
              <div className="w-full xl:w-1/2">
                <InputComponent
                  title={"Contact Number"}
                  name={"contactNumber"}
                  type={"text"}
                  placeholder={"Contact Number"}
                  handleInputChange={handleInputChange}
                  value={studentData?.contactNumber}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        <div className="flex w-[90%] m-auto mt-20">
          {/* Document Details */}
          <div className="document-details flex flex-col w-full gap-[1.55rem]">
            <div className="w-full text-2xl font-semibold text-primary mb-5">
              Document Details
            </div>
            {/* Aadhar Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%] ">
              <Checkbox
                id="aadhar"
                checked={studentData?.aadhar}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "aadhar",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="aadhar"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Aadhar Card
              </label>
            </div>

            {/* Domicile Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="domicile"
                checked={studentData?.domicile}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "domicile",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="domicile"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Domicile Certificate
              </label>
            </div>

            {/* Birth Certificate Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="birthCertificate"
                checked={studentData?.birthCertificate}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "birthCertificate",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="birthCertificate"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Birth Certificate
              </label>
            </div>

            {/* Disability  Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="disability"
                checked={studentData?.disability}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "disability",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="disability"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Disability Certificate
              </label>
            </div>

            {/* Single Parent  Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="singleParent"
                checked={studentData?.singleParent}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "singleParent",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="singleParent"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Single Parent Certificate
              </label>
            </div>

            {/* Relevant Ceritificate  Details */}
            <div className="flex items-center space-x-2 pl-[2.5%] pr-[2.5%]">
              <Checkbox
                id="relevantCertificate"
                checked={studentData?.relevantCertificate}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "relevantCertificate",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <label
                htmlFor="relevantCertificate"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Relevant Certificate for Single Parent
              </label>
            </div>
          </div>

          {/* ----------------------------------------------------------------------------------------------------------------------------------------- */}

          {/* Sponsorship Details */}
          <div className="sponsorhip-details flex flex-col w-full gap-2">
            <div className="w-full text-2xl font-semibold text-primary mb-5">
              Sponsorship Details
            </div>

            <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%] ">
              <label
                htmlFor="isSponsored"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Do we sponsor this student?
              </label>
              <Checkbox
                id="sponsorshipStatus"
                checked={studentData?.sponsorshipStatus}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: {
                      name: "sponsorshipStatus",
                      type: "checkbox",
                      checked: checked,
                    },
                  })
                }
              />
              <span className="font-semibold ml-5">
                {studentData?.sponsorshipStatus ? "Yes" : "No"}
              </span>
            </div>

            <div className="annual-school-fees flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label className="w-[60%] font-semibold">
                Annual School Fees
              </label>
              <div className="w-[200px]">
                <Input
                  type="number"
                  name="annualFees"
                  placeholder="Annual Fees"
                  className="p-2 text-sm font-semibold rounded-lg bg-white"
                  value={studentData?.annualFees}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label
                htmlFor="payTotalFees"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sponsorship Percentage
              </label>
              <div className="w-[200px]">
                <Input
                  type="number"
                  name="sponsorshipPercent"
                  placeholder="Sponsorship %"
                  className="p-2 text-sm font-semibold outline-none rounded-lg bg-white"
                  value={studentData?.sponsorshipPercent}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label
                htmlFor="feesWePay"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Total Fees we pay
              </label>
              <div className="w-[200px]">
                <input
                  type="number"
                  name="feesWePay"
                  placeholder={
                    studentData?.payTotalFees === false
                      ? "Enter the amount"
                      : ""
                  }
                  className="p-2 text-sm font-semibold outline-none rounded-lg"
                  value={
                    studentData?.payTotalFees === true
                      ? studentData?.annualFees
                      : studentData?.feesWePay
                  }
                  onChange={handleInputChange}
                />
              </div>
            </div> */}

            {/* <div className="flex items-center w-full h-9 pl-[2.5%] pr-[2.5%]">
              <label
                htmlFor="sponserName"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Name of Sponsor
              </label>
              <div className="w-[200px]">
                <Input
                  type="text"
                  name="sponserName"
                  className="p-2 text-sm font-semibold rounded-lg bg-white"
                  placeholder="Enter sponsor name"
                  value={studentData?.sponserName}
                  onChange={handleInputChange}
                />
              </div>
            </div> */}

            {/* <div className="flex items-center w-full h-9 px-[2.5%]">
              <label
                htmlFor="amountBySponsor"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Total Amount by Sponsor
              </label>
              <div className="w-[200px]">
                <Input
                  type="number"
                  name="amountBySponsor"
                  className="p-2 text-sm font-semibold rounded-lg outline-none bg-white"
                  placeholder="Enter total amount"
                  value={studentData?.amountBySponsor}
                  onChange={handleInputChange}
                />
              </div>
            </div> */}

            {/* <div className="flex items-center w-full h-9 px-[2.5%]">
              <label
                htmlFor="amountBySponsor"
                className="w-[60%] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sponsors
              </label>
            </div> */}

            {/* <div className="w-full flex items-center h-9 px-[2.5%] mt-5">
              <div className="w-full flex flex-col gap-2 mt-2">
                {temp.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>{item.name}</div>
                    <Button>Deallot sponsor</Button>
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}
        </div>

        {/* Result Details */}

        <div className="result-details w-[90%] m-auto mt-20">
          <div className="w-full flex justify-between text-2xl font-semibold text-primary mb-5">
            Result Details
            <DialogForResultEdit resultExists={studentData?.result} />
          </div>

          {studentData?.result && (
            <div className="filters flex flex-col gap-10 p-[25px]">
              <div className="result h-full rounded-lg border">
                <img src={studentData?.result} alt="result"></img>
              </div>
            </div>
          )}

          {/* Result Graph */}

          {/* <div className="result-graph w-full h-[400px]">
              <StudentProgressGraph results={studentData?.results} />
            </div> */}
        </div>

        {/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

        {/* Attendence details */}
        {/* <div className="attendence-details w-[90%] m-auto mt-20">
            <div className="w-full flex justify-between text-2xl font-semibold text-primary mb-5">
              Attendence Details
              <DialogForAttendenceEdit
                studentData={studentData}
                setStudentData={setStudentData}
              />
            </div> */}

        {/* Attendence Graph */}
        {/* <div className="result-graph w-full h-[400px] mb-10">
              <AttendanceMonitoringGraph
                attendanceData={studentData?.attendence}
              />
            </div>
          </div> */}

        {/* comment section */}

        <div className="result-details w-[90%] m-auto mt-20">
          <div className="w-full flex justify-between text-2xl font-semibold text-primary mb-5">
            Remarks about student
          </div>
          <div>
            <TextareaComponent
              name="comment"
              placeholder="Write comment about the student"
              value={studentData?.comment}
              handleInputChange={handleInputChange}
            />
          </div>
        </div>

        {/* Download Profile option */}
        <div className="download-profile w-[90%] m-auto mt-32">
          <div className="w-full flex justify-center gap-5 text-2xl font-semibold text-primary mb-5">
            <DialogForPdfPreview studentData={studentData} />
            {studentDataChanged && (
              <Button onClick={handleSaveChanges}>
                <CheckIcon /> <span className="ml-2"> Save Changes</span>
              </Button>
            )}
            <div>
              <AlertForDialogDeletion handleClick={handleDeleteStudent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
