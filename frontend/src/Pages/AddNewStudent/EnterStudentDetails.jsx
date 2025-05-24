import React, { useEffect, useState } from "react";
import HeaderForInputStudentDetails from "@/components/HeaderForInputStudentDetails";
import EnterStudentDetails1 from "./EnterStudentDetails1";
import { toast } from "react-toastify";
import CheckboxComponent from "@/components/Form/CheckboxComponent";
import { Input } from "@/components/ui/input";
import AuthVerify from "@/helper/jwtVerify";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

const EnterStudentDetails = () => {
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    studentName: "student",
    rollNumber: "",
    gender: "Male",
    currentSession: "2024-25",
    reportCard: "",
    dob: `2025-01-27T00:00:00.000+00:00`,
    studentClass: "6",
    school: "NIOS",
    centre: "C5",
    contactNumber: "1234567890",
    fathersName: "abcd",
    fathersOccupation: "abcd",
    mothersName: "abcd",
    mothersOccupation: "abcd",
    address: "Dhanbad",
    annualIncome: 100000,
    activeStatus: true,
    aadhar: false,
    domicile: false,
    birthCertificate: false,
    disability: false,
    singleParent: false,
    relevantCertificate: false,
  });

  useEffect(() => {
    if (!AuthVerify()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
      const formDataToSend = new FormData();

      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Append profile picture directly if it exists
      if (profilePicture) {
        formDataToSend.append(
          "profilePicture",
          profilePicture,
          profilePicture?.name
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
      navigate(0);
    } catch (e) {
      toast.error(`Error submitting form: ${e.message}`);
      return;
    }
  };

  return (
    <div className="w-screen h-screen bg-[radial-gradient(ellipse_at_center,rgba(222,80,85,0.4),transparent),radial-gradient(ellipse_at_top_left,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_top_right,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_bottom_left,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0)),radial-gradient(ellipse_at_bottom_right,rgba(205,214,219,0.8),rgba(255,255,255,0.8),rgba(255,255,255,0))]">
      <HeaderForInputStudentDetails />
      <div className="flex flex-col w-full xl:flex-row xl:h-[calc(100vh-7rem)]">
        <div className="flex justify-center items-center w-full h-[500px] xl:w-2/5 xl:h-full">
          <img
            src="/girl_photo.png"
            alt="girl_photo"
            className="object-contain h-4/5"
          />
        </div>

        <div className="relative w-full h-[500px] xl:w-3/5 xl:h-full overflow-hidden">
          {/* Animation Class */}
          <div
            className={`transition-transform duration-500 ease-in-out absolute inset-0 ${
              isFirstPage ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Student Details Page 1 */}
            <EnterStudentDetails1
              handleClick={handleClick}
              handleInputChange={handleInputChange}
              formData={formData}
            />
          </div>
          <div
            className={`transition-transform duration-500 ease-in-out absolute inset-0 ${
              isFirstPage ? "translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Student Details Page 2 */}
            <div className="flex flex-col items-center w-full h-full pt-5">
              <div className="progress1 flex justify-center items-center w-full h-7">
                <img
                  src="/progress2.png"
                  alt="second-step"
                  className="object-contain h-full"
                />
              </div>

              <div className="inputs flex flex-col items-end w-full pt-20 pr-10 gap-5">
                <div className="file-input w-full  flex justify-between">
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

              <div className="documents flex flex-col w-full mt-20">
                <div className="text-sm font-semibold mb-6">
                  Document details of student
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <CheckboxComponent
                    title="Aadhar Card"
                    name="aadhar"
                    checked={formData.aadhar}
                    handleChange={handleInputChange}
                  />

                  <CheckboxComponent
                    title="Domicile Certificate"
                    name="domicile"
                    checked={formData.domicile}
                    handleChange={handleInputChange}
                  />

                  <CheckboxComponent
                    title="Birth Certificate"
                    name="birthCertificate"
                    checked={formData.birthCertificate}
                    handleChange={handleInputChange}
                  />

                  <CheckboxComponent
                    title="Disability Certificate"
                    name="disability"
                    checked={formData.disability}
                    handleChange={handleInputChange}
                  />

                  <CheckboxComponent
                    title="Single Parent"
                    name="singleParent"
                    checked={formData.singleParent}
                    handleChange={handleInputChange}
                  />

                  <div className="ml-10">
                    <CheckboxComponent
                      title="Do you have relevantCertificate Certificate ?"
                      name="relevantCertificate"
                      checked={formData.relevantCertificate}
                      handleChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full pt-24">
                <div className="flex justify-center w-[90%] pl-[2.5%] pr-[2.5%] gap-10">
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
