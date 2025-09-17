import React,{useEffect} from "react";
import { motion } from "framer-motion";
import { Link, animateScroll as scroll } from "react-scroll";
import Navbar from "../common-components/Navbar";
import Topnav from '../common-components/Topnav';
import FooterComponent from "./FooterComponent";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

export default function TVETPrivateSectorPitch() {
  useEffect(() => {
      const nav = document.getElementById("navigation");
  
      const handleScroll = () => {
        if (!nav) return;
        const scroll = window.scrollY;
        if (scroll < 100) {
          nav.classList.add("hidden");
        } else {
          nav.classList.remove("hidden");
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* NAVBAR */}
                    <div id='navigation' className="hidden top-12 fixed z-90 w-full"> 
                      <Topnav />
                    </div>
      <div className="absolute top-0 left-0 w-full z-40 bg-transparent">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <Navbar />
        </div>
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden h-[80vh] flex items-center justify-center bg-black">
       
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-extrabold text-white mb-4"
          >
            Invest in Rwanda’s Future Workforce
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-lg text-gray-200 max-w-2xl mx-auto mb-6"
          >
            Connect with TVET graduates, shape future skills, and drive business growth
            while building your brand as a social impact leader.
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/privateSectorForm"
              className="px-6 py-3 bg-green-500 text-white font-medium rounded-xl shadow-lg hover:bg-green-400"
            >
              Create Company Account
            </motion.a>
            <Link
              to="video"
              smooth={true}
              duration={800}
              className="px-6 py-3 border border-white rounded-xl text-white hover:bg-white hover:text-indigo-600 cursor-pointer"
            >
              Watch How It Works
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* BENEFITS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl font-bold text-center mb-4">
            Why Private Companies Are Joining
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            TVET graduates are ready to work. Partnering with them gives your company a competitive edge and fuels Rwanda’s industrial growth.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Access highly trained, job-ready graduates",
              "Lower hiring & onboarding costs",
              "Shape training to your industry needs",
              "Build a future talent pipeline",
              "Enhance brand & CSR visibility",
              "Improve retention and loyalty",
              "Strengthen Rwanda’s workforce",
              "Quick internship-to-hire conversion",
              "Exclusive early access to talent",
              "Be seen as an industry leader",
            ].map((b, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-2xl transition"
              >
                <h4 className="font-semibold text-lg mb-2">• {b}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gain measurable business impact while creating opportunities for youth.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* STATS */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-3xl p-10 text-center"
        >
          <h3 className="text-2xl font-semibold mb-8">Real Impact for Businesses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "85%", label: "Faster Hiring" },
              { value: "70%", label: "Interns Become Hires" },
              { value: "40%", label: "Lower Onboarding Time" },
              { value: "3x", label: "Brand Visibility Growth" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl font-extrabold">{stat.value}</div>
                <div className="text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* VIDEO DEMO */}
        <motion.section
          id="video"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="grid lg:grid-cols-3 gap-10 items-start"
        >
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">Building Stronger Future, Together.</h3>
            <p className="text-gray-600 mb-4">
              Private sector engagement with RTB creates opportunities for students, strengthens industries, and drives national growth.
            </p>
            <div className="aspect-video overflow-hidden rounded-xl shadow">
              <iframe
                src="https://www.youtube.com/embed/Ky7urFA1Fwg?autoplay=1&mute=1&loop=1&playlist=Ky7urFA1Fwg"
                title="Platform demo"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <aside className="bg-white p-6 rounded-2xl shadow">
            <h4 className="font-semibold mb-4 text-blue-500">Let's empower the skills together</h4>
            <div className="space-y-4">
              {[
                "https://tse1.mm.bing.net/th/id/OIP.z7vdFvsoYe4Nmr_ia-lRyAHaE8?pid=Api",
                "https://tse1.mm.bing.net/th/id/OIP.nJmI-1DH3N1ZruyzZ6m9UwHaEL?r=0&pid=Api",
                "https://tse2.mm.bing.net/th/id/OIP.nf6c4qV5ZLojxcf_T-Y9HQHaEK?r=0&pid=Api",
                "https://tse1.mm.bing.net/th/id/OIP.xB1ltxyhQQBciRcf89NriwHaEL?pid=Api",
                "https://tse4.mm.bing.net/th/id/OIP.Eqvr1zAR0zHWN4Xkk9hZrwHaE8?r=0&pid=Api",
              ].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Graduate portfolio ${i + 1}`}
                  className="rounded-xl object-cover w-full h-36 hover:scale-105 transition"
                />
              ))}
            </div>
          </aside>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-gradient-to-r from-green-50 to-green-100 p-10 rounded-3xl shadow text-center"
        >
          <h3 className="text-2xl font-bold mb-2 text-blue-600">
            Building Stronger Future, Together.
          </h3>
          <p className="text-gray-700 mb-6">
            Private sectors, join us to collaborate in nurturing a skilled workforce that meets today’s challenges and tomorrow’s opportunities 👍.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="/privateSectorForm"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-500"
          >
            Create a Company Account
          </motion.a>
        </motion.section>
      </main>

      <footer className="text-sm text-gray-600 py-8 text-center">
        <FooterComponent />
        <p>
          © {new Date().getFullYear()} TVET-Connect — Empowering Rwanda’s future workforce
        </p>
      </footer>
    </div>
  );
}
