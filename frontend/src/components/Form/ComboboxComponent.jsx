import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

const ComboBoxComponent = ({
  title,
  name,
  options,
  value,
  handleInputChange,
}) => {
  const [open, setOpen] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (value && options && !options.some((o) => o.value === value)) {
      setIsManual(true);
    }
  }, [value, options]);

  return (
    <div className="flex flex-col gap-1 pl-[2.5%] pr-[2.5%] xl:w-[90%]">
      {title && (
        <label htmlFor={name} className="text-sm font-semibold">
          {title} <span className="text-red-500">*</span>
        </label>
      )}

      {isManual ? (
        <div className="flex gap-2">
          <Input
            id={name}
            name={name}
            value={value}
            type="text"
            onChange={handleInputChange}
            placeholder={`Enter ${title || name}`}
            className="w-full rounded-lg p-2 text-sm font-semibold bg-white"
          />
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => setIsManual(false)}
          >
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="justify-between rounded-lg p-2 text-sm font-semibold bg-white"
            >
              {value
                ? options.find((o) => o.value === value)?.value || value
                : `Select ${name}`}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder={`Search ${name}...`}
                value={searchValue}
                onValueChange={(val) => setSearchValue(val)}
                className="h-9"
              />

              <CommandEmpty className="p-2">
                {searchValue && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      handleInputChange({
                        target: {
                          name,
                          value: searchValue,
                          type: "select",
                        },
                      });
                      setOpen(false);
                    }}
                  >
                    Select &quot;{searchValue}&quot;
                  </Button>
                )}
              </CommandEmpty>

              <CommandGroup className="h-[200px] overflow-y-scroll">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      handleInputChange({
                        target: {
                          name,
                          value: currentValue,
                          type: "select",
                        },
                      });
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ComboBoxComponent;
