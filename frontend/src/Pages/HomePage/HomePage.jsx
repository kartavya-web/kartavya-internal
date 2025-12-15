import React, { useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthVerify from "@/helper/jwtVerify";
import { Button } from "@/components/ui/button";

const cards = [
  {
    icon: "/spreadsheet.png",
    title: "Spreadsheet",
    desc: "Manage student records",
    path: "/student-spreadsheet",
  },
  {
    icon: "/list.png",
    title: "Sponsors List",
    desc: "View all sponsors",
    path: "/sponsors",
  },

  {
    icon: "/add.png",
    title: "Add Student",
    desc: "Register new students",
    path: "/enter-student-details",
  },
  {
    icon: "/donation.png",
    title: "Add Donation",
    desc: "Add donation details to the system.",
    path: "/allotment/addDonationsToCSM",
  },
  {
    icon: "/allotment.png",
    title: "Allotment",
    desc: "Assign sponsors to students",
    path: "/allotment",
  },
  {
    icon: "/home.png",
    title: "Home",
    desc: "Dashboard Overview",
    path: "/",
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
        <div className="w-[22%] ml-[10rem]
                max-xl:ml-[4rem] max-xl:w-[28%]
                max-md:ml-6 max-md:w-[40%]
                max-sm:w-[55%]">
          <img src="/kartavya_logo.png" alt="Kartavya Logo" />
        </div>

        <Button
          onClick={handleLogout}
          className="
             absolute top-[10%] right-[10%]
    h-16 w-44 text-[1.5rem]

    max-[1100px]:h-14 max-[1100px]:w-40 max-[1100px]:text-[1.3rem]
    max-[900px]:h-12  max-[900px]:w-36 max-[900px]:text-[1.15rem]
    max-[700px]:h-11  max-[700px]:w-15 max-[700px]:text-[1rem]
    max-[500px]:h-10  max-[500px]:text-[0.9rem]

    max-[700px]:top-6 max-[700px]:right-6
    max-[500px]:top-4 max-[500px]:right-4

    rounded-[20px] font-bold
    flex items-center justify-center gap-2 z-20
    [&>svg]:w-7 [&>svg]:h-7
    max-[700px]:[&>svg]:w-6 max-[700px]:[&>svg]:h-6
    max-[500px]:[&>svg]:w-5 max-[500px]:[&>svg]:h-5"
        >
          <FiLogOut className="!w-7 !h-7" />
          Logout
        </Button>

        <div className="flex max-[767px]:justify-center">
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="ml-[8%]  flex flex-col 
             text-[95px]
             max-[1300px]:text-[70px]
             max-[1025px]:text-[50px]
             max-[767px]:text-[80px]
             max-[500px]:text-[60px]
             max-[300px]:text-[25px]
             max-sm:ml-6 max-sm:mt-4"
          >
            <span className="font-bold leading-[0.9]">Internal</span>
            <span className="font-bold leading-[0.9]">Management</span>
            <span className="font-bold leading-[0.9]">System</span>
          </motion.div>
        </div>

        <div className="ml-[8%] mt-[6%] flex gap-6
              max-[767px]:justify-center
              max-[767px]:ml-0
              max-[767px]:gap-[20vw]
              max-[530px]:gap-20
              max-[430px]:gap-10
              max-[360px]:flex-col">
          <Button
            className=" rounded-lg font-bold

                px-10 py-5 text-[1.1rem]
                max-[1100px]:px-9 max-[1100px]:py-4 max-[1100px]:text-[1rem]
                max-[900px]:px-8  max-[900px]:py-3 max-[900px]:text-[0.95rem]
                max-[700px]:px-7  max-[700px]:py-3 max-[700px]:text-[0.9rem]
                max-[500px]:px-6  max-[500px]:py-2 max-[500px]:text-[0.85rem]"
            onClick={() =>
              document.getElementById("dash")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Dashboard
          </Button>

          <Button
            variant="outline"
            className="border-[1.5px] border-black rounded-lg font-bold

              px-10 py-5 text-[1.1rem]
              max-[1100px]:px-9 max-[1100px]:py-4 max-[1100px]:text-[1rem] max-[1100px]:w-[200px]
              max-[900px]:px-8  max-[900px]:py-3 max-[900px]:text-[0.95rem] max-[900px]:w-[150px]
              max-[700px]:px-7  max-[700px]:py-3 max-[700px]:text-[0.9rem]
              max-[500px]:px-6  max-[500px]:py-2 max-[500px]:text-[0.85rem]"
            onClick={() =>
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Learn About Us
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 200 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute top-[15%] right-[12%]
             max-md:static max-md:flex max-md:justify-center
             max-lg:mt-10 max-[767px]:hidden "
        >
          <img className=" w-[520px]
            max-[1300px]:w-[420px]
            max-[1025px]:w-[320px]
            max-[900px]:w-[260px]
            max-[800px]:w-[240px]
            
            mx-auto" src="/Monitoring.png" alt="Monitoring" />
        </motion.div>


      </header>

      <main>
        <div className="relative w-full mt-[10%]">
          <img
            src="/Hero.png"
            alt="Hero"
            className="w-full h-auto"
          />

          <div
            className="
              absolute top-[38%] left-[8%]
              max-w-[22vw] max-h-[196px]
              font-bold font-garamond
              text-[2.5vw]
              leading-tight
            "
          >
            Empowering students through continuous monitoring and personalized support.
          </div>
        </div>


        <section id="dash" className=" w-full bg-white  max-sm:px-8 my-8 pb-9">
          <h1 className="text-center text-[60px] font-bold mb-12 max-sm:text-[34px]">
            Welcome to the Dashboard
          </h1>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full px-[15vw]">
            {cards.map((card, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(card)}
                className=" w-full max-w-[320px] flex flex-col items-center justify-start border-[1.5px] border-[#222] rounded-2xl p-8 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
              >

                <img
                  src={card.icon}
                  alt={card.title}
                  className="h-28 mb-6 md:w-24 md:h-24"
                />


                <h3 className="text-[22px] font-bold text-center mb-2">
                  {card.title}
                </h3>


                <p className="text-center text-[16px] text-[#555] leading-relaxed">
                  {card.desc}
                </p>
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

        <div className="flex flex-col justify-center">
          <h2 className="text-[56px] font-bold mb-8 max-[900px]:text-[42px]">
            About Us
          </h2>
          <p className=" text-[1.6rem] leading-relaxed font-playpen">
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
