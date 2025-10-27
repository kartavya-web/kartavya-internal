import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

const ChildList = ({ childList, handleSelectChild, selectedChild }) => {
  return (
    <div className="border flex rounded-lg">
      <Table className="w-full relative">
        <TableHeader className="w-full text-muted-foreground">
          <TableRow className="w-full">
            <TableHead className="w-2/6 pl-5">Name</TableHead>
            <TableHead className="w-1/6">Class</TableHead>
            <TableHead className="w-1/6">Center</TableHead>
            <TableHead className="w-1/6">School</TableHead>
            <TableHead className="w-1/6 text-end pr-5">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {childList?.map((student) => (
            <TableRow key={student._id} className={`hover:bg-gray-100`}>
              <TableCell className="w-2/6 pl-5 flex items-center gap-3">
                <Link
                  to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                  className="hover:underline underline-offset-4"
                >
                  <span className="font-medium capitalize">
                    {student.studentName}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="w-1/6 text-start font-semibold">
                {student.class}
              </TableCell>
              <TableCell className="w-1/6 text-start font-semibold">
                {student.centre}
              </TableCell>
              <TableCell className="w-1/6 text-start">
                {student.school}
              </TableCell>
              <TableCell className={`text-end`}>
                <Button
                  onClick={() => handleSelectChild(student)}
                  className="h-8 bg-[#025f43] hover:bg-[#1a604a] hover:scale-[1.01] mr-5"
                >
                  {selectedChild?._id === student?._id ? (
                    <span className="">Selected</span>
                  ) : (
                    <span>Select</span>
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChildList;
