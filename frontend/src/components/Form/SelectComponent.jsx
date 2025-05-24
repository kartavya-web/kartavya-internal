import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SelectComponent = ({
  title,
  name,
  options,
  value,
  handleInputChange,
}) => {
  return (
    <div className="flex flex-col gap-1 pl-[2.5%] pr-[2.5%] xl:w-[90%]">
      {title && (
        <label htmlFor={name} className="text-sm font-semibold">
          {title} <span className="text-red-500">*</span>
        </label>
      )}
      <Select
        value={value}
        onValueChange={(value) =>
          handleInputChange({
            target: { name, value, type: "select" },
          })
        }
      >
        <SelectTrigger className="w-full rounded-lg p-2 font-semibold text-sm bg-white">
          <SelectValue placeholder={`Select ${name}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectComponent;
