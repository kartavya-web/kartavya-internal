import React from "react";
import { Textarea } from "../ui/textarea";

const TextareaComponent = ({ name, placeholder, value, handleInputChange }) => {
  return (
    <div className="flex flex-col gap-1 pl-[2.5%] pr-[2.5%] xl:w-[90%]">
      <Textarea
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        className="w-full outline-none rounded-lg p-2 text-sm font-semibold bg-white placeholder-gray-500 placeholder:text-sm placeholder:font-semibold"
      />
    </div>
  );
};

export default TextareaComponent;
