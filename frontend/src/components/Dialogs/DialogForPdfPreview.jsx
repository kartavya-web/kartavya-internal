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
import { Pencil1Icon } from "@radix-ui/react-icons";
import html2pdf from "html2pdf.js";
import { format, parseISO } from "date-fns";

const DialogForPdfPreview = ({ studentData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    try {
      await downloadPdf();
      setIsOpen(false);
    } catch (error) {
      console.error("PDF download failed:", error);
    }
  };

  const downloadPdf = async () => {
    const element = document.querySelector("#pdf");
    if (!element) {
      console.error("PDF element not found");
      return;
    }

    await html2pdf()
      .from(element)
      .set({
        margin: 0,
        filename: `${studentData.studentName}_kartavya_dhanbad.pdf`,
        jsPDF: { format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const parseToDDMMYYYY = (date) => {
    if (!date) return;
    return format(parseISO(date), "dd-MM-yyyy");
  };

  const dataUsed = [
    { Name: studentData?.studentName },
    { "D.O.B": parseToDDMMYYYY(studentData?.dob) },
    { Gender: studentData?.gender },
    { Address: studentData?.address },
    { Session: studentData?.currentSession },
    { Class: studentData?.class },
    { School: studentData?.school },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil1Icon />{" "}
          <span className="ml-2"> Download Student Profile</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col p-4 max-w-[900px] h-[90vh]  overflow-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle> Preview of Student Profile</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="w-full h-full overflow-scroll">
          {/* A4 dimensions in mm are approximately 210 x 297, 
              Convert to pixels (at 96 DPI): 210mm = 793px and 297mm = 1123px */}
          <div
            id="pdf"
            className="w-[794px] h-[1122px] m-0 p-0 box-border origin-top flex justify-center items-center  bg-[url('/watermark.png')] bg-center bg-contain bg-no-repeat"
          >
            <div className="pdf w-[calc(100%-80px)] h-[calc(100%-40px)] border-4 border-black">
              <div className="heading flex flex-col justify-center items-center">
                <div className="logo w-auto h-full">
                  <img
                    src="/kartavya_logo.png"
                    alt="kartavya logo"
                    className=" h-[120px] object-cover"
                  ></img>
                </div>
                {/* <div className="logo w-full text-center text-[#8c1af5]">
                  An effort towards educated INDIA
                </div> */}
                <div className="logo w-[70%] text-sm text-center text-[#5eb3a0]">
                  (Reg under Society registration Act 21 Reg. no. S/63750/2008
                  as the name KARTAVAYA)
                </div>

                <div className="hero flex w-full mt-20  pl-10">
                  <div className="hero1 w-full flex flex-col gap-2">
                    {dataUsed.map((data, index) => {
                      const [key, value] = Object.entries(data)[0];
                      return (
                        <div key={index} className="w-full flex text-lg">
                          <div className="font-semibold w-[30%]">{key}</div>
                          <div className="w-[70%]">
                            <span className="font-semibold pr-2">:</span>
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="hero2 w-[30%] mr-5">
                    <img
                      // src="/profile.png"
                      src={studentData?.profilePhoto || "/student.jpg"}
                      alt="profile-photo"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                <div className="parent-info w-full mt-20 pl-10 text-lg flex flex-col gap-3">
                  <div className="father-name w-full flex">
                    <div className="font-semibold w-[40%]">
                      Father&apos;s Name
                    </div>
                    <div className="w-[60%]">
                      <span className="font-semibold pr-2">:</span>
                      {studentData?.fathersName}
                    </div>
                  </div>

                  <div className="father-occupation w-full flex">
                    <div className="font-semibold w-[40%]">
                      Father&apos;s Occupation
                    </div>
                    <div className="w-[60%]">
                      <span className="font-semibold pr-2">:</span>
                      {studentData?.fathersOccupation}
                    </div>
                  </div>

                  <div className="mother-name w-full flex">
                    <div className="font-semibold w-[40%]">
                      Mother&apos;s Name
                    </div>
                    <div className="w-[60%]">
                      <span className="font-semibold pr-2">:</span>
                      {studentData?.mothersName}
                    </div>
                  </div>

                  <div className="father-occupation w-full flex">
                    <div className="font-semibold w-[40%]">
                      Mother&apos;s Occupation
                    </div>
                    <div className="w-[60%]">
                      <span className="font-semibold pr-2">:</span>
                      {studentData?.mothersOccupation}
                    </div>
                  </div>
                </div>

                <div className="general-info w-full mt-3 pl-10 text-lg flex flex-col gap-3">
                  <div className="w-full flex">
                    <div className="font-semibold w-[40%]">
                      Annual Family Income
                    </div>
                    <div className="w-[60%]">
                      <span className="font-semibold pr-2">:</span>
                      {studentData?.annualIncome}
                    </div>
                  </div>

                  <div className="w-full flex">
                    <div className="font-semibold w-[40%]">Remarks</div>
                    <div className="w-[60%]">
                      <span className="font-semibold pr-2">:</span>
                      {studentData?.comment}
                    </div>
                  </div>
                </div>
              </div>

              <div className="footer w-full flex flex-col justify-center items-center mt-40 text-blue-600">
                <a href="mailto:sponsor.kartavya@gmail.com" className="mail">
                  sponsor.kartavya@gmail.com
                </a>
                <a href="http://kartavya.org" className="website">
                  www.kartavya.org
                </a>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="w-full flex justify-center items-center">
          <Button type="button" onClick={handleClick}>
            Download Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForPdfPreview;
