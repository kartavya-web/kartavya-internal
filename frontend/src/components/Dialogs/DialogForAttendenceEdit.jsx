import { useState } from "react"; // Import useState for managing local state
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil1Icon } from "@radix-ui/react-icons";

const DialogForAttendanceEdit = ({ studentData, setStudentData }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [presentDays, setPresentDays] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleAttendenceEdit = () => {
    if (totalDays === "") setTotalDays(0);
    if (presentDays === "") setPresentDays(0);

    const updatedAttendence = {
      ...studentData.attendence,
      [selectedMonth]: {
        presentDays: presentDays,
        totalDays: totalDays,
      },
    };

    const updatedStudentData = {
      ...studentData,
      attendence: updatedAttendence,
    };

    setStudentData(updatedStudentData);
    setPresentDays(0);
    setTotalDays(0);
    setIsOpen(false);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    console.log(value, studentData.attendence[value]);
    setTotalDays(studentData.attendence[value].totalDays);
    setPresentDays(studentData.attendence[value].presentDays);
  };

  const handleTotalDaysChange = (event) => {
    setTotalDays(event.target.value);
  };

  const handlePresentDaysChange = (event) => {
    if (event.target.value > totalDays) {
      return;
    }
    setPresentDays(event.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil1Icon /> <span className="ml-2"> Edit Attendance</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Attendance</DialogTitle>
          <DialogDescription>
            Make changes to attendance here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Month Select */}
          <div className="grid grid-cols-[1fr_3fr] items-center gap-4">
            <Label htmlFor="month">Month</Label>
            <Select
              className="col-span-3 w-full"
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Months</SelectLabel>
                  <SelectItem value="Jan">Jan</SelectItem>
                  <SelectItem value="Feb">Feb</SelectItem>
                  <SelectItem value="Mar">Mar</SelectItem>
                  <SelectItem value="Apr">Apr</SelectItem>
                  <SelectItem value="Jun">Jun</SelectItem>
                  <SelectItem value="Jul">Jul</SelectItem>
                  <SelectItem value="Aug">Aug</SelectItem>
                  <SelectItem value="Sept">Sept</SelectItem>
                  <SelectItem value="Oct">Oct</SelectItem>
                  <SelectItem value="Nov">Nov</SelectItem>
                  <SelectItem value="Dec">Dec</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Total Days Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalDays">Total Days</Label>
            <Input
              id="totalDays"
              className="col-span-3 w-full"
              value={totalDays}
              onChange={handleTotalDaysChange}
            />
          </div>

          {/* Present Days Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="presentDays">Present Days</Label>
            <Input
              id="presentDays"
              className="col-span-3 w-full"
              value={presentDays}
              onChange={handlePresentDaysChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAttendenceEdit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForAttendanceEdit;
