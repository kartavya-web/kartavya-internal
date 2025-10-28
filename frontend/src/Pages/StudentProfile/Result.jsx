import DialogForResultEdit from "@/components/Dialogs/DialogForResultEdit";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AlertForDialogDeletion } from "@/components/AlertForStudentDeletion";

const Result = ({ studentData }) => {
  const [results, setResults] = useState(studentData?.result || []);
  const isPDF = (url) => url?.toLowerCase().endsWith(".pdf");

  const handleDelete = async (sessionTerm) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/students/${encodeURIComponent(studentData.rollNumber)}/deleteResult`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ sessionTerm }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete result");
      }

      toast.success(`Result for "${sessionTerm}" deleted successfully`);
      setResults(results.filter((r) => r.sessionTerm !== sessionTerm));
    } catch (error) {
      toast.error(`Error deleting result: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-between text-2xl font-semibold text-primary mb-5">
        Result Details
        <DialogForResultEdit studentData={studentData} />
      </div>

      {results.length > 0 && (
        <div className="filters flex flex-col gap-10 p-[25px]">
          {results.map((res, index) => (
            <div
              key={index}
              className="result flex flex-col items-start gap-3 rounded-lg border p-4"
            >

              <div className="flex justify-between w-full items-center">
                <h3 className="text-lg font-semibold">{res.sessionTerm}</h3>
                <AlertForDialogDeletion handleClick={() => handleDelete(res.sessionTerm)} text={" result "}/>
              </div>

              {res.url ? (
                isPDF(res.url) ? (
                  <embed
                    src={res.url}
                    type="application/pdf"
                    width="100%"
                    height="600px"
                    className="border rounded-md"
                  />
                ) : (
                  <img
                    src={res.url}
                    alt={res.sessionTerm}
                    className="w-full rounded-md border"
                  />
                )
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No result available
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Result;
