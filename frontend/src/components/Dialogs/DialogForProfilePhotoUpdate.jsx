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

const DialogForProfilePhotoUpdate = ({ photoExists }) => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [photo, setPhoto] = useState();
  const handleProfilePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    setUploading(true);
    const dataToSend = new FormData();
    try {
      if (photo) {
        dataToSend.append("profilePicture", photo, photo?.name);
        dataToSend.append("pictureType", "profilePhoto");
      }

      const res = await fetch(
        `/api/students/profile-picture?rollNumber=${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: dataToSend,
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
      <DialogTrigger asChild className="flex justify-end">
        <div className="w-full flex justify-end">
          <Button className="w-10 h-10 rounded-[50%]">
            <Pencil1Icon />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {photoExists ? "Edit picture" : "Add picture"}
          </DialogTitle>
          <DialogDescription>
            Make changes to profile here. Click upload when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="file-input-container mt-5">
          <label className="file-input-label">
            <Input
              type="file"
              className="file-input"
              onChange={handleProfilePhotoChange}
              accept="image/*"
            />
          </label>
        </div>
        <DialogFooter className="">
          <Button type="submit" onClick={handleUpdateProfile}>
            {uploading ? "Uploading..." : "Upload photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForProfilePhotoUpdate;
