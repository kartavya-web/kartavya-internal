import React, { useEffect, useState } from "react";
import HeaderForInputStudentDetails from "@/components/HeaderForInputStudentDetails";
import { toast } from "react-toastify";
import CheckboxComponent from "@/components/Form/CheckboxComponent";
import { Input } from "@/components/ui/input";
import AuthVerify from "@/helper/jwtVerify";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import StudentGeneralDetails from "@/components/StudentGeneralDetails";
import { DOCUMENT_CHECKBOXES } from "@/constants/constants";

const EnterStudentDetails = () => {
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    studentName: "",
    rollNumber: "",
    gender: "",
    currentSession: "2025-26",
    dob: "",
    class: "",
    school: "",
    centre: "",
    contactNumber: "",
    fathersName: "",
    fathersOccupation: "",
    mothersName: "",
    mothersOccupation: "Housewife",
    address: "",
    annualIncome: 0,
    activeStatus: true,
    profileAadharVerified: false,
    aadhar: false,
    domicile: false,
    birthCertificate: false,
    disability: false,
    singleParent: false,
    relevantCertificate: false,
  });

  useEffect(() => {
    if (!AuthVerify()) {
      navigate("/login", { replace: true });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleClick = () => {
    setIsFirstPage((prev) => !prev);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:");
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Append profile picture directly if it exists
      if (profilePicture) {
        formDataToSend.append(
          "profilePicture",
          profilePicture,
          profilePicture?.name,
        );
        formDataToSend.append("pictureType", "profilePhoto");
      }

      // Debugging formData content
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}: ${value}`);
      }

      const res = await fetch(`/api/students/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add new student");
      }

      toast.success("Form submitted successfully!");

      // wait for 1 second before refreshing the page
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate(0);
    } catch (e) {
      toast.error(`Error submitting form: ${e.message}`);
      return;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(ellipse_at_center,rgba(222,80,85,0.4),transparent),radial-gradient(ellipse_at_top_left,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_top_right,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_bottom_left,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_bottom_right,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0))] xl:h-screen">
      <HeaderForInputStudentDetails />
      <div className="flex w-full flex-col xl:h-[calc(100vh-7rem)] xl:flex-row">
        <div className="flex h-[min(55vh,500px)] w-full items-center justify-center xl:h-full xl:w-2/5">
          <img
            src="/students-image.jpg"
            alt="students-image"
            className="object-contain w-4/5 rounded-md"
          />
        </div>

        <div className="relative min-h-[700px] w-full overflow-hidden xl:h-full xl:min-h-0 xl:w-3/5">
          <div
            className={`transition-transform duration-500 ease-in-out absolute inset-0 overflow-hidden ${
              isFirstPage ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center w-full h-full pt-5 overflow-y-scroll">
              <div className="progress1 flex justify-center items-center w-full h-7">
                <img
                  src="/progress1.png"
                  alt="first-step"
                  className="object-contain h-full"
                />
              </div>

              <StudentGeneralDetails
                studentData={formData}
                handleInputChange={handleInputChange}
              />

              <div className="flex items-center w-full my-10">
                <div className="flex justify-center w-[90%] pl-[6%] pr-[2.5%]">
                  <Button
                    onClick={handleClick}
                    className="w-[150px] p-2 rounded-lg"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`transition-transform duration-500 ease-in-out absolute inset-0 overflow-hidden ${
              isFirstPage ? "translate-x-full" : "translate-x-0"
            }`}
          >
            <div className="flex flex-col items-center w-full h-full pt-5 overflow-y-scroll">
              <div className="progress1 flex justify-center items-center w-full h-7">
                <img
                  src="/progress2.png"
                  alt="second-step"
                  className="object-contain h-full"
                />
              </div>

              <div className="inputs flex w-full flex-col items-stretch gap-5 px-4 pt-10 sm:items-end sm:px-10 sm:pt-20">
                <div className="file-input flex w-full flex-col gap-3 sm:flex-row sm:justify-between">
                  <label htmlFor="fileInput" className="text-sm font-semibold">
                    Upload passport size picture of student
                  </label>
                  {/* <input type="file" id="fileInput"></input> */}
                  <div className="file-input-container">
                    <label className="file-input-label">
                      <Input
                        type="file"
                        className="file-input border border-gray-500"
                        onChange={handleProfilePictureChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="documents mt-12 flex w-full flex-col px-4 sm:mt-20 sm:px-0">
                <div className="text-sm font-semibold mb-6">
                  Document details of student
                </div>

                <div className="flex flex-col gap-3 w-full">
                  {DOCUMENT_CHECKBOXES.map(({ title, name, indent }) => (
                    <div key={name} className={indent ? "ml-10" : ""}>
                      <CheckboxComponent
                        title={title}
                        name={name}
                        checked={Boolean(formData?.[name])}
                        handleChange={handleInputChange}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center w-full py-10">
                <div className="flex w-[90%] justify-center gap-3 px-[2.5%] sm:gap-10">
                  <Button
                    onClick={handleClick}
                    className="w-[150px] p-2 rounded-lg"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitForm}
                    className="w-[150px] p-2 rounded-lg"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterStudentDetails;
