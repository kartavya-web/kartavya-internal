import React from 'react'
import "./HomePage.css"; 
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


 

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


  const handleLogout = () => {
      if (window.confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        navigate("/login", { replace: true });
      }
  };


  const handleCardClick = (card) => {
      if (card.title === "Home") {
        document
          .getElementById("home")
          ?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate(card.path);
      }
  };


  const navigate = useNavigate();

  return (
    <>
      <header id='home'>
        <div className='kartavya_logo'>
          <img src="/kartavya_logo.png" alt="" />
        </div>

        <span>
          <button className='Login_button' onClick={handleLogout}>
            <FiLogOut className='mt-1 mr-1'/>Logout
          </button>
        </span>

        <motion.div 
        initial={{opacity: 0, x:-200}}
        transition={{duration: 1}}
        whileInView={{opacity: 1, x:0}}
        viewport={{once: true}}
        className='title_container'>
          <span className='title'>Student</span>
          <span className='title'>Monitoring</span>
          <span className='title'>System</span>
        </motion.div>

        <motion.div 
        initial={{opacity: 0, x:200}}
        transition={{duration: 1}}
        whileInView={{opacity: 1, x:0}}
        viewport={{once: true}}
        className='Monitoring'>
          <img src="/Monitoring.png" alt="" />
        </motion.div>

        <div className="hero-actions">
              <button onClick={() => {
                  document
                    .getElementById("dash")
                    ?.scrollIntoView({ behavior: "smooth" });
                }} 
                className="primary-btn">Dashboard
              </button>
              <button onClick={() => {
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" });
                }} 
               className="secondary-btn">Learn About Us
              </button>
         </div>
  
      </header>

      <main>
          <div className='hero-image-section'>
            <img className='hero_img' src="/Hero.png" alt="" />
            <div className='hero_desc'>Empowering students through continuous monitoring and personalized support.</div>
          </div>

          <div id='dash' className="dashboard">
            <h1 className="dashboard-title">Welcome to the Dashboard</h1>
            <div className="dashboard-grid">
              {cards.map((card, index) => (
                <div key={index} className="dashboard-card" onClick={() => handleCardClick(card)}>
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="dashboard-icon"
                  />
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
         </div>
   
      </main>

      <footer id="about" className='about-container'>
        <div className="about-image-wrapper">
          <img
            src="/about.png"   
            alt="Kartavya Children"
            className="about-image"
          />
        </div>

        <div className="about-content">
          <h2>About Us</h2>
          <p>
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
  )
}

export default HomePage
