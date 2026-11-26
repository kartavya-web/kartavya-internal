import React, { useEffect } from "react";
import VerifiedDonations from "./VerifiedDonations";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthVerify from "@/helper/jwtVerify";

const AllotmentHomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!AuthVerify()) {
      navigate("/login", { replace: true });
    }
  }, []);
  
  return (
    <div>
      <Link to="/">
        <Button className="m-5"><Home></Home> HomePage</Button>
      </Link>
      <div className="header mt-5 px-3 text-center text-2xl font-semibold sm:text-3xl">
        Verified Donations
      </div>
      <div className="tables mx-2 sm:mx-5 lg:mx-10">
        <VerifiedDonations />
      </div>
    </div>
  );
};

export default AllotmentHomePage;
