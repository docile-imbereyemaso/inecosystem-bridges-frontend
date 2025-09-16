import React from "react";
import { motion } from "framer-motion";
import FooterComponent from "./FooterComponent";
import Navbar from "../common-components/Navbar";
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6 } }),
};

export default function TVETPrivateSectorPitch() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-900">
      {/* HERO */}

      
      <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:flex lg:items-center lg:justify-between relative z-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Connect with TVET Graduates & Amplify Your Impact
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 mb-6">
              Discover skilled, job-ready technical graduates, build a talent pipeline, reduce hiring costs, and collaborate with training centers to create a skilled workforce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a href="/privateSectorForm" whileHover={{ scale: 1.05 }} className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg shadow-lg hover:bg-green-400">
                Create Company Account
              </motion.a>
              <motion.a href="#video" whileHover={{ scale: 1.05 }} className="px-6 py-3 border border-white rounded-lg text-white hover:bg-white hover:text-indigo-600">
                Watch Demo
              </motion.a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} className="mt-12 lg:mt-0 lg:ml-10 flex-shrink-0 grid grid-cols-3 gap-2">
            <img src="https://picsum.photos/seed/grad1/240/160" alt="Graduate" className="rounded-lg shadow-lg w-full h-40 object-cover hover:scale-105 transition-transform" />
            <img src="https://picsum.photos/seed/grad2/240/160" alt="Workshop" className="rounded-lg shadow-lg w-full h-40 object-cover hover:scale-105 transition-transform" />
            <img src="https://picsum.photos/seed/grad3/240/160" alt="Collaboration" className="rounded-lg shadow-lg w-full h-40 object-cover hover:scale-105 transition-transform" />
          </motion.div>
        </div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-400 rounded-full opacity-20 mix-blend-multiply -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 mix-blend-multiply -z-10 animate-pulse"></div>
      </header>

       <div className="absolute top-0 left-0 w-full z-40 bg-transparent">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <Navbar />
          </div>
        </div>

      <main className="max-w-7xl mx-auto px-6 py-16 grid gap-16">
        {/* BENEFITS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <motion.h2 custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl font-bold">
              Why Private Companies Join — Deep Benefits
            </motion.h2>
            <motion.p custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-4 text-gray-600">
              Gain measurable advantages by connecting with trained graduates, building pipelines, and shaping future talent with real impact.
            </motion.p>

            <div className="mt-8 space-y-6">
              {[
                { title: "Access to Skilled, Job-Ready Talent", desc: "TVET graduates have hands-on experience in trades and tech, ready to contribute immediately.", outcomes: ["Reduced time-to-hire", "Better candidate fit"], icon: "https://picsum.photos/seed/hire/96/96" },
                { title: "Build a Talent Pipeline & Reduce Future Shortages", desc: "Develop internships and apprenticeships so recruits are pre-trained for your processes.", outcomes: ["Faster onboarding", "Higher retention"], icon: "https://picsum.photos/seed/pipeline/96/96" },
                { title: "Boost Brand & Community Impact", desc: "Partner with TVET institutions to improve your CSR and attract mission-driven talent.", outcomes: ["Enhanced employer branding", "Increased applications"], icon: "https://picsum.photos/seed/brand/96/96" },
                { title: "Influence Curriculum & Get Skills You Need", desc: "Guide training centers with project briefs ensuring graduates match your skill requirements.", outcomes: ["Higher skill relevance", "Employer satisfaction"], icon: "https://picsum.photos/seed/feedback/96/96" },
              ].map((b, i) => (
                <motion.article key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-lg border hover:shadow-2xl transition-shadow">
                  <div className="flex items-start gap-6">
                    <img src={b.icon} alt={b.title} className="w-24 h-24 rounded-lg object-cover" />
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{b.title}</h3>
                      <p className="text-gray-600 mb-2">{b.desc}</p>
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {b.outcomes.map((o, idx) => (<li key={idx}>{o}</li>))}
                      </ul>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <aside className="bg-white p-6 rounded-2xl shadow-lg border">
            <motion.h3 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-lg font-semibold mb-4">
              Quick Impact Snapshot
            </motion.h3>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: "Hiring speed improvement", value: 85 }, { label: "Internship-to-hire conversion", value: 70 }, { label: "Average onboarding reduction", value: 40 }, { label: "CSR impact", value: "Strong" }].map((stat, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.2 }}>
                  <dt className="text-3xl font-bold">{stat.value}%</dt>
                  <dd className="text-sm text-gray-600">{stat.label}</dd>
                </motion.div>
              ))}
            </div>
            <motion.a whileHover={{ scale: 1.05 }} href="#signup" className="mt-6 inline-block w-full px-4 py-3 bg-green-500 text-white rounded-lg text-center">
              Create a Company Account
            </motion.a>
          </aside>
        </section>

        {/* VIDEO & PORTFOLIO */}
        <section id="video" className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border">
            <h3 className="text-xl font-semibold mb-2">Demo Video — See How It Works</h3>
            <p className="text-gray-600 mb-4">Learn how to post jobs, review portfolios, and set up internship programs quickly and efficiently.</p>
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <iframe title="Platform demo" src="https://www.youtube.com/embed/ysz5S6PUM-U" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white p-6 rounded-2xl shadow-lg border">
            <h4 className="font-semibold mb-2">Sample Graduate Portfolios</h4>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (<img key={i} src={`https://picsum.photos/seed/portfolio${i}/400/220`} alt={`portfolio ${i}`} className="rounded-md object-cover w-full h-36 hover:scale-105 transition-transform" />))}
            </div>
          </motion.aside>
        </section>

        {/* SIGNUP CTA */}
        <section id="signup" className="bg-gradient-to-r from-indigo-50 to-white p-8 rounded-2xl shadow-lg border">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Start Your Company Account Today</h3>
              <p className="text-gray-600 mb-4">Post jobs, invite interns, and shape the skills pipeline with our easy-to-use platform.</p>
              <ul className="text-gray-700 text-sm space-y-2 mb-4">
                <li>• 30-day free trial for first job posts</li>
                <li>• Direct access to graduate portfolios</li>
                <li>• Track applications and convert interns to hires</li>
              </ul>
            </div>
            <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-lg border shadow-lg space-y-3">
              <input placeholder="Company Name" className="w-full p-2 border rounded-md" />
              <input placeholder="Contact Email" className="w-full p-2 border rounded-md" />
              <select className="w-full p-2 border rounded-md">
                <option>Rwanda</option>
                <option>Kenya</option>
                <option>Uganda</option>
                <option>Other</option>
              </select>
              <motion.button whileHover={{ scale: 1.05 }} className="w-full bg-indigo-600 text-white p-2 rounded-md">
                Create Account
              </motion.button>
            </motion.form>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white p-6 rounded-2xl shadow-lg border">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              { q: "How much does it cost?", a: "Flexible pricing: free trial for first posts, pay-per-post or subscription plans." },
              { q: "Can I post internships?", a: "Yes. Short and long internships are supported and tracked for conversion." },
              { q: "How do I provide feedback?", a: "Submit structured reports and project briefs to partner training centers." }
            ].map((faq, i) => (
              <details key={i} className="p-4 border rounded-lg">
                <summary className="font-medium cursor-pointer">{faq.q}</summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

       
      </main>

 {/* FOOTER */}
        <footer className="text-sm text-gray-600 py-6 text-center">
            <FooterComponent/>
          <p>© {new Date().getFullYear()} TVET-Connect — Bridge technical graduates with the private sector. Contact: hello@tvet-connect.example</p>
        </footer>
      
    </div>
  );
}
