import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

const StudentTable = ({ filteredStudents }) => {
  return (
    <Table className="w-[95%] relative">
      <TableHeader className="w-full">
        <TableRow className="w-full text-muted-foreground">
          <TableHead className="pl-2 w-[25%]">Name</TableHead>
          <TableHead className="w-auto">Class</TableHead>
          <TableHead className="w-auto">Center</TableHead>
          <TableHead className="w-auto">Active Status</TableHead>
          <TableHead className="w-auto">Sponsored</TableHead>
          <TableHead className="w-[20%]">School</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredStudents?.map((student) => (
          <TableRow key={student._id} className="hover:bg-gray-100">
            <TableCell className="w-[25%]">
              <Link
                to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                className="flex items-center h-full pl-2"
              >
                <div className="font-medium">{student.studentName}</div>
                {student.profileAadharVerified && (
                  <span
                    className="inline-block w-2 h-2 ml-2 rounded-full bg-green-600"
                    title="Verified"
                  />
                )}
              </Link>
            </TableCell>
            <TableCell className="w-auto">
              <Link
                to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                className="flex items-center h-full"
              >
                {student.class}
              </Link>
            </TableCell>
            <TableCell className="w-auto">
              <Link
                to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                className="flex items-center h-full"
              >
                {student.centre}
              </Link>
            </TableCell>
            <TableCell className="w-auto">
              <Link
                to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                className={`flex items-center h-full font-semibold ${
                  student.activeStatus ? "text-green-600" : "text-red-600"
                }`}
              >
                {student.activeStatus ? "Active" : "Inactive"}
              </Link>
            </TableCell>
            <TableCell className="w-auto">
              <Link
                to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                className={`flex items-center h-full font-semibold ${
                  student.sponsorshipStatus ? "text-green-600" : "text-red-600"
                }`}
              >
                {student.sponsorshipStatus ? "Yes" : "No"}
              </Link>
            </TableCell>
            <TableCell className="w-[20%]">
              <Link
                to={`/admin/${encodeURIComponent(student.rollNumber)}`}
                className="flex items-center h-full"
              >
                {student.school}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StudentTable;
