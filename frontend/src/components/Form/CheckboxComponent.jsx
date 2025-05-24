import React from "react";
import { Checkbox } from "../ui/checkbox";

const CheckboxComponent = ({ title, name, checked, handleChange }) => {
  return (
    <div className="flex items-center gap-2 pl-[2.5%] pr-[2.5%] xl:w-[90%]">
      <Checkbox
        id={name}
        type="checkbox"
        checked={checked}
        onCheckedChange={(checked) =>
          handleChange({
            target: {
              name,
              type: "checkbox",
              checked: checked,
            },
          })
        }
        className="w-4 h-4"
      />
      <label htmlFor={name} className="text-sm font-semibold">
        {title}
      </label>
    </div>
  );
};

export default CheckboxComponent;
