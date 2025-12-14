import React, { useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthVerify from "@/helper/jwtVerify";
import { Button } from "@/components/ui/button";

const cards = [
  {
    icon: "/home.png",
    title: "Home",
    desc: "Dashboard Overview",
    path: "/",
  },
  {
    icon: "/add.png",
    title: "Add Student",
    desc: "Register new students",
    path: "/enter-student-details",
  },
  {
    icon: "/student_profile.png",
    title: "Student Profile",
    desc: "View student details",
    path: "/admin/:id",
  },
  {
    icon: "/spreadsheet.png",
    title: "Spreadsheet",
    desc: "Manage student records",
    path: "/student-spreadsheet",
  },
  {
    icon: "/allotment.png",
    title: "Allotment",
    desc: "Assign sponsors to students",
    path: "/allotment",
  },
  {
    icon: "/list.png",
    title: "Sponsors List",
    desc: "View all sponsors",
    path: "/sponsors",
  },
  {
    icon: "/action.png",
    title: "Allotment Action",
    desc: "Perform sponsor allotment actions.",
    path: "/allotment/action",
  },
  {
    icon: "/donation.png",
    title: "Add Donation",
    desc: "Add donation details to the system.",
    path: "/allotment/addDonationsToCSM",
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthVerify()) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  const handleCardClick = (card) => {
    if (card.title === "Home") {
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(card.path);
    }
  };

  return (
    <>
      <header id="home" className="relative">
        <div className="w-[22%] ml-[10rem] mt-[2rem]">
          <img src="/kartavya_logo.png" alt="Kartavya Logo" />
        </div>

        <Button
          onClick={handleLogout}
          className="absolute top-[10%] right-[10%] h-16 w-44 rounded-[20px] bg-[#2fcbc9] text-[1.5rem] font-bold flex items-center justify-center gap-2 z-20 [&>svg]:w-7 [&>svg]:h-7 "
        >
          <FiLogOut className="!w-7 !h-7"  />
          Logout
        </Button>

        <motion.div
          initial={{ opacity: 0, x: -200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="ml-[8%] mt-[-2%] flex flex-col text-[95px]"
        >
          <span className="h-[85px] font-bold">Student</span>
          <span className="h-[85px] font-bold">Monitoring</span>
          <span className="h-[85px] font-bold">System</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute top-[15%] right-[12%]"
        >
          <img src="/Monitoring.png" alt="Monitoring" />
        </motion.div>

        <div className="ml-[8%] mt-[8%] flex gap-6">
          <Button
            className="bg-[#2fcbc9] px-10 py-5 rounded-lg font-bold"
            onClick={() =>
              document.getElementById("dash")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Dashboard
          </Button>

          <Button
            variant="outline"
            className="border-[1.5px] border-black px-10 py-5 rounded-lg font-bold"
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Learn About Us
          </Button>
        </div>
      </header>

      <main>
        <div className="relative w-full mt-[10%]">
          <img src="/Hero.png" className="w-screen" alt="Hero" />
          <div className="absolute top-[38%] left-[8%] max-w-[360px] text-[2.5rem] font-bold font-garamond">
            Empowering students through continuous monitoring and personalized
            support.
          </div>
        </div>

        <section id="dash" className="min-h-screen bg-white px-24 py-16 max-sm:px-8">
          <h1 className="text-center text-[60px] font-bold mb-12 max-sm:text-[34px]">
            Welcome to the Dashboard
          </h1>

          <div className="grid grid-cols-4 gap-8 max-[1100px]:grid-cols-2 max-sm:grid-cols-1">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(card)}
                className="border-[1.5px] border-[#222] rounded-2xl p-8 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
              >
                <img src={card.icon} alt={card.title} className="w-auto h-14 mb-4" />
                <h3 className="text-[22px] font-bold mb-1">{card.title}</h3>
                <p className="text-[16px] text-[#555]">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        id="about"
        className="min-h-screen grid grid-cols-[1.1fr_1fr] items-center gap-16 bg-[#fde4be] px-24 py-16 max-[900px]:grid-cols-1 max-[900px]:px-8 max-[900px]:text-center"
      >
        <div className="max-w-[600px] mx-auto">
          <img
            src="/about.png"
            alt="Kartavya Children"
            className="rounded-[26px] w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text-[56px] font-bold mb-8 max-[900px]:text-[42px]">
            About Us
          </h2>
          <p className="max-w-[520px] text-[1.6rem] leading-relaxed font-playpen">
            Kartavya is a national non-profit voluntary organization (registered
            under Societies Registration Act XXI, 1860 with registration no.
            S/63750/2008) run by the students and the alumni of IIT (ISM) Dhanbad
            and other associated colleges with the vision to equip the children
            of slums with education, life skills and character that they need to
            lead empowered lives.
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
