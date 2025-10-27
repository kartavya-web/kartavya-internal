import React from "react";
import VerifiedDonations from "./VerifiedDonations";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const AllotmentHomePage = () => {
  return (
    <div>
      <Link to="/student-spreadsheet">
        <Button className="m-5"><Home></Home> HomePage</Button>
      </Link>
      <div className="header text-3xl font-semibold text-center mt-5">
        Verified Donations
      </div>
      <div className="tables mx-10">
        <VerifiedDonations />
      </div>
    </div>
  );
};

export default AllotmentHomePage;
