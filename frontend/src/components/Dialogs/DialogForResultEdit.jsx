import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { resultTermSession } from "@/constants/constants";

const DialogForResultEdit = ({ studentData }) => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [sessionTerm, setSessionTerm] = useState("");
  const [resultFile, setResultFile] = useState(null);

  const handleFileChange = (e) => setResultFile(e.target.files[0]);

  const handleResultSubmit = async () => {
    if (!sessionTerm.trim()) {
      toast.error("Please select a session and term");
      return;
    }
    if (!resultFile) {
      toast.error("Please select a result file to upload");
      return;
    }

    const token = localStorage.getItem("token");
    setUploading(true);

    const formData = new FormData();
    formData.append("result", resultFile, resultFile.name);
    formData.append("pictureType", "resultPhoto");
    formData.append("sessionTerm", sessionTerm);

    try {
      const res = await fetch(
        `/api/students/${encodeURIComponent(id)}/uploadResult`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to upload result");
      }

      const message = await res.json();
      toast.success(message.message);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(`Error updating student data: ${error.message}`);
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil1Icon />
          <span className="ml-2">
            Add / Edit Result
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {studentData?.result?.length ? "Edit Result" : "Add Result"}
          </DialogTitle>
          <DialogDescription>
            Select the session term and upload the result file. Click upload when done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Session Term
            </label>
            <Select onValueChange={setSessionTerm} value={sessionTerm}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Term-Session" />
              </SelectTrigger>
              <SelectContent>
                {resultTermSession.map((term, idx) => (
                  <SelectItem key={idx} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Result File</label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleResultSubmit}>
            {uploading ? "Uploading..." : "Upload Result"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForResultEdit;
