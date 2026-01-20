import React from "react";
import InputComponent from "./Form/InputComponent";
import SelectComponent from "./Form/SelectComponent";
import ComboBoxComponent from "./Form/ComboboxComponent";
import { FormRows } from "@/constants/constants";

const StudentGeneralDetails = ({ studentData, handleInputChange }) => {
  const getFieldValue = (name, type) => {
    if (!studentData || !studentData[name]) return "";

    if (type === "date") {
      return new Date(studentData[name]).toISOString().split("T")[0];
    }

    return studentData[name];
  };

  return (
    <div className="input-section flex flex-col items-end w-full pt-8 gap-[1.2rem]">
      {FormRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex flex-col gap-5 xl:gap-0 xl:flex-row flex-wrap w-full"
        >
          {row.map((field) => {
            const { name, componentType, type, title, placeholder, options } =
              field;
            const value = getFieldValue(name, type);
            return (
              <div key={name} className="flex flex-col w-full xl:w-1/2 px-2">
                {componentType === "Input" && (
                  <InputComponent
                    title={title}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    handleInputChange={handleInputChange}
                  />
                )}
                {componentType === "Select" && (
                  <SelectComponent
                    title={title}
                    type="select"
                    name={name}
                    placeholder={placeholder}
                    options={options}
                    value={value}
                    handleInputChange={handleInputChange}
                  />
                )}
                {componentType === "ComboBox" && (
                  <ComboBoxComponent
                    title={title}
                    name={name}
                    placeholder={placeholder}
                    options={options}
                    value={value}
                    handleInputChange={handleInputChange}
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default StudentGeneralDetails;
