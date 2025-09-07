import React from "react";
import { FaLaptop, FaBuilding, FaSeedling, FaUtensils, FaIndustry, FaGem, FaPaintBrush, FaTruck, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";

const tvetSectors = [
  {
    title: "Information and Communication Technology (ICT)",
    icon: <FaLaptop className="text-blue-500 w-8 h-8" />,
    description: "Gain skills in software development, networking, and digital systems.",
    careers: ["Software Developer", "Network Administrator", "IT Support Specialist"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    title: "Construction and Building Services",
    icon: <FaBuilding className="text-green-500 w-8 h-8" />,
    description: "Learn trades like masonry, carpentry, plumbing, and electrical installation.",
    careers: ["Construction Worker", "Site Supervisor", "Project Manager"],
    image: "https://www.cambria.ac.uk/wp-content/uploads/2022/01/Construction-NEW-2.jpg",
  },
  {
    title: "Agriculture and Food Processing",
    icon: <FaSeedling className="text-green-400 w-8 h-8" />,
    description: "Acquire skills in crop production, livestock management, and food processing.",
    careers: ["Agricultural Technician", "Food Safety Inspector", "Agribusiness Entrepreneur"],
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    title: "Tourism and Hospitality",
    icon: <FaUtensils className="text-yellow-500 w-8 h-8" />,
    description: "Develop expertise in hotel management, culinary arts, and tourism services.",
    careers: ["Hotel Manager", "Chef", "Tour Guide", "Event Coordinator"],
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  },
  {
    title: "Manufacturing and Industrial Technology",
    icon: <FaIndustry className="text-gray-500 w-8 h-8" />,
    description: "Specialize in welding, auto mechanics, electrical technology, and mechanical engineering.",
    careers: ["Welder", "Auto Mechanic", "Industrial Technician", "Production Supervisor"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB4-vZh-AEIWZ9CKbCo-qpnzg0CnL94izz6Q&s",
  },
  {
    title: "Beauty and Aesthetics",
    icon: <FaGem className="text-pink-500 w-8 h-8" />,
    description: "Learn skills in hairdressing, beauty therapy, fashion design, and tailoring.",
    careers: ["Hair Stylist", "Beautician", "Fashion Designer", "Tailor"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLOktA2puFK-66aZfbL8rGpQpuT9UOBEKHQ&s",
  },
  {
    title: "Arts and Crafts",
    icon: <FaPaintBrush className="text-purple-500 w-8 h-8" />,
    description: "Engage in decoration, leather craft, knitting, and photography.",
    careers: ["Interior Decorator", "Leather Artisan", "Photographer", "Visual Artist"],
    image: "https://previews.123rf.com/images/savvas511/savvas5111801/savvas511180100149/93639455-local-arts-and-crafts-handmade.jpg",
  },
  {
    title: "Transportation and Logistics",
    icon: <FaTruck className="text-orange-500 w-8 h-8" />,
    description: "Master skills in driving, warehouse management, and supply chain operations.",
    careers: ["Driver", "Logistics Coordinator", "Warehouse Manager"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfjnOlS-27olQV2HR18ZBdh6HKbVoilD02bA&s",
  },
  {
    title: "Retail and Business Services",
    icon: <FaShoppingCart className="text-teal-500 w-8 h-8" />,
    description: "Develop skills in entrepreneurship, sales, marketing, and customer service.",
    careers: ["Entrepreneur", "Sales Manager", "Customer Service Representative"],
    image: "https://s32519.pcdn.co/wp-content/uploads/2019/03/ADUSA-news-270319-1320px-1024x580.jpg.optimal.jpg",
  },
  {
    title: "Finance and Insurance",
    icon: <FaMoneyBillWave className="text-green-600 w-8 h-8" />,
    description: "Gain expertise in accounting, banking services, and insurance brokerage.",
    careers: ["Accountant", "Banker", "Insurance Agent", "Financial Analyst"],
    image: "https://www.beafarmbureauagent.com/filesimages/image-header/FinancialPlanningInInsurance_Titlle.jpg",
  },
];



const TVETSectors = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Explore TVET Sectors in Rwanda
      </h1>

      {tvetSectors.map((sector, index) => (
        <div
          key={index}
          className="bg-slate-800 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-slate-700"
        >
          <div className="flex-shrink-0">{sector.icon}</div>
          <div className="flex-1">
            <h2 className="text-xl text-white font-bold">{sector.title}</h2>
            <p className="text-slate-300 mt-2">{sector.description}</p>
            <p className="text-slate-400 mt-2">
              <strong>Career Paths:</strong> {sector.careers.join(", ")}
            </p>
          </div>
          <div className="flex-shrink-0">
            <img
              src={sector.image}
              alt={sector.title}
              className="w-48 h-32 object-cover rounded-lg border border-slate-600"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TVETSectors;
