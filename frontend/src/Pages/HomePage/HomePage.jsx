import AuthVerify from "@/helper/jwtVerify";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (AuthVerify()) {
      navigate("/student-spreadsheet");
    } else navigate("/login");
  }, []);
  return <div>Home Page</div>;
}
