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
import { Pencil1Icon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { useParams } from "react-router";

const DialogForResultEdit = ({ resultExists }) => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [result, setResult] = useState();
  const handleResultChange = (e) => {
    setResult(e.target.files[0]);
  };

  const handleResultSubmit = async () => {
    const token = localStorage.getItem("token");
    setUploading(true);
    const resultToSend = new FormData();
    try {
      if (result) {
        resultToSend.append("result", result, result?.name);
        resultToSend.append("pictureType", "resultPhoto");
      }

      const res = await fetch(
        `/api/students/${encodeURIComponent(id)}/uploadResult`,
        {
          method: "PATCH",
          body: resultToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update student data");
      }

      const message = await res.json();
      console.log(message, "message");

      window.location.reload();
      toast.success(message.message);
    } catch (error) {
      toast.error(`Error updating student data: ${error.message}`);
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil1Icon />{" "}
          <span className="ml-2">
            {resultExists ? "Edit result" : "Add result"}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {resultExists ? "Edit result" : "Add result"}
          </DialogTitle>
          <DialogDescription>
            Make changes to result here. Click upload when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="file-input-container mt-5">
          <label className="file-input-label">
            <Input
              type="file"
              className="file-input"
              onChange={handleResultChange}
              accept="image/*"
            />
          </label>
        </div>
        <DialogFooter className="">
          <Button type="submit" onClick={handleResultSubmit}>
            {uploading ? "Uploading..." : "Upload result"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForResultEdit;
