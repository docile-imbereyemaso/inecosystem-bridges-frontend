import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common-components/Navbar';
import Topnav from '../common-components/Topnav';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt, FaAward, FaEnvelope, FaPlay } from 'react-icons/fa';
import civilEngineer from '/success/civil-engineer.jpeg';
import plumber from '/success/plumber.jpeg';
import roadConstruction from '/success/road-constructor.jpg';
import carpenter from '/success/carpenter.jpeg';
import electronician from '/success/electronician.jpeg';
import telecommunication from '/success/telecommunication.jpeg';
import renewableEnergy from '/success/renewable.jpeg';
import electrical from '/success/electrical.webp';
import chef from '/success/chef.jpg';
import waiter from '/success/waiter.jpg';
import softwareDeveloper from '/success/softwaredevelope.jpeg';
import network from '/success/network.jpeg';
import fashion from '/success/fashion.jpg';
import music from '/success/music.jpeg';
import agriculture from '/success/agriculure.jpg';
import foodProcessing from '/success/foodProcessing.jpg';
import automobile from '/success/automobile.jpeg';
import manufacturing from '/success/manufacturing.jpeg';
import mining from '/success/mining.jpeg';
import beauty from '/success/beaty.jpg';
import FooterComponent from './FooterComponent';
const SuccessStories = () => {
  const [activeTab, setActiveTab] = useState('CONSTRUCTION AND BUILDING SERVICES');

  const sectors = {
    'CONSTRUCTION AND BUILDING SERVICES': {
      name: 'Construction and Building Services',
      color: 'bg-blue-500',
      stories: [
        {
          name: 'Jean Claude Nzeyimana',
          currentPosition: 'Civil Engineer',
          email: 'jeanclaude@gmail.com',
          story: 'After completing my TVET program in Civil Engineering, I landed my dream job as a civil engineer. The hands-on training prepared me perfectly for real-world challenges. I now work on major construction projects that serve thousands of Rwandans daily.',
          image: civilEngineer,
          videoUrl:'#'
        },
        {
          name: 'Solange Uwimana',
          currentPosition: 'Plumber',
          email: 'uwimanasolange@gmail.com',
          story: 'After completing my TVET program in plumbing, I landed my dream job as a plumber. The hands-on training prepared me perfectly for real-world challenges. I now work on major plumbing projects that serve thousands of Rwandans daily.',
          image: plumber,
          videoUrl:'#'
        },
         {
          name: 'Valentine Mutoni',
          currentPosition: 'Road Construction Engineer',
          email: 'valentinemutoni@gmail.com',
          story: 'After completing my TVET program in Road construction engineering, I landed my dream job as a road construction engineer. The hands-on training prepared me perfectly for real-world challenges. I now work on major construction projects that serve thousands of Rwandans daily.',
          image: roadConstruction,
          videoUrl:'#'
        },
        {
          name: 'Jean Kamanzi',
          currentPosition: 'Carpenter',
          email: 'jeankamanzi@gmail.com',
          story: 'After completing my TVET program in carpentry, I landed my dream job as a carpenter. The hands-on training prepared me perfectly for real-world challenges. I now work on major carpentry projects that serve thousands of Rwandans daily.',
          image: carpenter,
          videoUrl:'#'
        }
      ]
    },
    'Technical Services': {
      name: 'Technical Services',
      color: 'bg-orange-500',
       stories: [
        {
          name: 'Yvan Manzi',
          currentPosition: 'Electronician',
          email: 'yvanmanzi@gmail.com',
          story: 'After completing my courses in electronics, I landed my dream job as a Electronician. The hands-on training prepared me perfectly for real-world challenges. I now work on major construction projects that serve thousands of Rwandans daily.',
          image: electronician,
          videoUrl:'#'
        },
        {
          name: 'Solange Uwimana',
          currentPosition: 'Electronic and telecommunication Engineer',
          email: 'uwimanasolange@gmail.com',
          story: 'After completing my TVET program in electronic and telecommunication engineering, I landed my dream job as a electronic and telecommunication engineer. The hands-on training prepared me perfectly for real-world challenges. I now work on major electronic and telecommunication projects that serve thousands of Rwandans daily.',
          image: telecommunication,
          videoUrl:'#'
        }
        
      ]
    },
    'Energy': {
      name: 'Energy',
      color: 'bg-green-500',
       stories: [
        {
          name: 'Jean Claude Nzeyimana',
          currentPosition: 'Renewable Energy Engineer',
          email: 'jeanclaude@gmail.com',
          story: 'After completing my TVET program in Renewable Energy Engineering, I landed my dream job as a renewable energy engineer. The hands-on training prepared me perfectly for real-world challenges. I now work on major renewable energy projects that serve thousands of Rwandans daily.',
          image: renewableEnergy,
          videoUrl:'#'
        },
        {
          name: 'Sandrine Umurerwa',
          currentPosition: 'Electrician',
          email: 'sandrineumurerwa@gmail.com',
          story: 'After completing my TVET program in electrical engineering, I landed my dream job as an electrician. The hands-on training prepared me perfectly for real-world challenges. I now work on major electrical projects that serve thousands of Rwandans daily.',
          image: electrical,
          videoUrl:'#'
        },
         
      ]
    },
    'hospitality': {
      name: 'Hospitality & Tourism',
      color: 'bg-purple-500',
         stories: [
        {
          name: 'Jean Claude Nzeyimana',
          currentPosition: 'professional chef',
          email: 'jeanclaude@gmail.com',
          story: 'After completing my TVET program in Culinary Arts, I landed my dream job as a professional chef. The hands-on training prepared me perfectly for real-world challenges. I now work in a top restaurant that serves thousands of Rwandans daily.',
          image: chef,
          videoUrl:'#'
        },
        {
          name: 'Alice Uwase',
          currentPosition: 'professional waiter',
          email: 'aliceuwase@gmail.com',
          story: 'After completing my TVET program in hospitality management, I landed my dream job as a professional waiter. The hands-on training prepared me perfectly for real-world challenges. I now work in a top restaurant that serves thousands of Rwandans daily.',
          image: waiter,
          videoUrl:'#'
        },
         
      ]
    },
    'ICT AND MULTIMEDIA': {
      name: 'ICT AND MULTIMEDIA',
      color: 'bg-red-500',
           stories: [
        {
          name: 'Docile Imbereyemaso',
          currentPosition: 'Software Developer',
          email: 'docile.imbereyemaso@gmail.com',
          story: 'After completing my TVET program in Software Development, I landed my dream job as a Software Developer. The hands-on training prepared me perfectly for real-world challenges. I now work on major software projects that serve thousands of Rwandans daily.',
          image: softwareDeveloper,
          videoUrl:'#'
        },
        {
          name: 'Alice Kaliza',
          currentPosition: 'Network Administrator',
          email: 'alicekaliza@gmail.com',
          story: 'After completing my TVET program in Network Administration, I landed my dream job as a Network Administrator. The hands-on training prepared me perfectly for real-world challenges. I now manage the IT infrastructure of a major company, ensuring seamless connectivity for all employees.',
          image: network,
          videoUrl:'#'
        },
         
      ]
    },
    'ARTS AND CRAFTS': {
      name: 'Arts and Crafts',
      color: 'bg-emerald-500',
            stories: [
        {
          name: 'Diane Akimana',
          currentPosition: 'Fashion Designer',
          email: 'diane.akimana@gmail.com',
          story: 'After completing my TVET program in Fashion Design, I landed my dream job as a Fashion Designer. The hands-on training prepared me perfectly for real-world challenges. I now create stunning clothing lines that celebrate Rwandan culture.',
          image: fashion,
          videoUrl:'#'
        },
        {
          name: 'Andy Bumuntu',
          currentPosition: 'Musician',
          email: 'andy.bumuntu@gmail.com',
          story: 'After completing my Music and Performing Arts program in Nyundo Musics and Arts School, I landed my dream job as a Musician. The hands-on training prepared me perfectly for real-world challenges. I now create music that resonates with Rwandan culture and beyond.',
          image: music,
          videoUrl:'#'
        },
         
      ]
    },
    'electrical': {
      name: 'AGRICULTURE AND FOOD PROCESSING',
      color: 'bg-yellow-500',
              stories: [
        {
          name: 'Innocent Niyonzima',
          currentPosition: 'Agronomist',
          email: 'innocent.niyonzima@gmail.com',
          story: 'After completing my TVET program in Agriculture, I landed my dream job as an Agronomist. The hands-on training prepared me perfectly for real-world challenges. I now work with farmers to improve crop yields and promote sustainable farming practices.',
          image: agriculture,
          videoUrl:'#'
        },
        {
          name: 'Diana Mukamana',
          currentPosition: 'Food Processing Specialist',
          email: 'diana.mukamana@gmail.com',
          story: 'After completing my TVET program in Food Processing, I landed my dream job as a Food Processing Specialist. The hands-on training prepared me perfectly for real-world challenges. I now work with local farmers to process and package their products for the market.',
          image: foodProcessing,
          videoUrl:'#'
        },
         
      ]
    },
    'TRANSPORT AND LOGISTICS': {
      name: 'TRANSPORT AND LOGISTICS',
      color: 'bg-indigo-500',
                  stories: [
        {
          name: 'Innocent Niyonzima',
          currentPosition: 'Automobile Engineer',
          email: 'innocent.niyonzima@gmail.com',
          story: 'After completing my TVET program in Automobile Engineering, I landed my dream job as an Automobile Engineer. The hands-on training prepared me perfectly for real-world challenges. I now work with local mechanics to improve vehicle performance and promote sustainable automotive practices.',
          image: automobile,
          videoUrl:'#'
        }
       
         
      ]
    },
    'MANUFACTURING AND MINING': {
      name: 'MANUFACTURING AND MINING',
      color: 'bg-pink-500',
                  stories: [
        {
          name: 'Dimitri Kamana',
          currentPosition: 'Manufacturing Engineer',
          email: 'dimitri.kamana@gmail.com',
          story: 'After completing my TVET program in Manufacturing Engineering, I landed my dream job as a Manufacturing Engineer. The hands-on training prepared me perfectly for real-world challenges. I now work with local factories to improve production processes and promote sustainable manufacturing practices.',
          image: manufacturing,
          videoUrl:'#'
        },
        {
          name: 'Isabele Umutoni',
          currentPosition: 'Mining Engineer',
          email: 'isabele.umutoni@gmail.com',
          story: 'After completing my TVET program in Mining Engineering, I landed my dream job as a Mining Engineer. The hands-on training prepared me perfectly for real-world challenges. I now work with local mining companies to improve extraction processes and promote sustainable mining practices.',
          image: mining,
          videoUrl:'#'
        }
       
         
      ]
    },
    'BEAUTY AND AESTHETICS': {
      name: 'BEAUTY AND AESTHETICS',
      color: 'bg-zinc-500',
                  stories: [
        {
          name: 'Nicolas Kamana',
          currentPosition: 'Beauty Therapist',
          email: 'nicolas.kamana@gmail.com',
          story: 'After completing my TVET program in Beauty Therapy, I landed my dream job as a Beauty Therapist. The hands-on training prepared me perfectly for real-world challenges. I now work with local salons to provide top-notch beauty services and promote self-care awareness.',
          image: beauty,
          videoUrl:'#'
        },
        
         
      ]
    }
  };

  const currentSector = sectors[activeTab];
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
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-1">
          <div id='navigation' className="hidden fixed mt-9 z-10 w-full">
    
    
    
            
          <Topnav />
          </div>
      <div className='top-0 left-0 w-full z-50'>
             <Navbar />
      </div>
         <div className="text-center my-4">
          <p className='text-gray-900 dark:text-gray-300 font-semibold'>Find the successful Individual in TVET sector of your choice</p>
         </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      

        {/* Tabs */}
  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-2 justify-center py-2 px-2">
              {Object.entries(sectors).map(([key, sector]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium rounded-full border transition-colors duration-200 whitespace-nowrap mb-2 ${
                    activeTab === key
                      ? `${sector.color} text-white border-transparent shadow-md`
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                  style={{minWidth: '80px'}}
                >
                  {sector.name}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-2">
           

            {/* Small Cards Grid - 4 per row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentSector.stories.map((story, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 flex flex-col min-h-[16rem]">
                  <div className="flex flex-col items-center pt-0 pb-2">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-56 sm:h-40 rounded-lg object-cover mb-2"
                      style={{aspectRatio: '1/1', minHeight: '12rem'}}
                    />
                    <h3 className="text-base font-bold text-gray-900 dark:text-white text-center mb-1">{story.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 text-center mb-1">{story.currentPosition}</p>
                    {story.email && (
                      <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 mb-1">
                        <FaEnvelope className="w-3 h-3 mr-1" />
                        <span className="text-xs break-all">{story.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="px-2 pb-2 flex-1 flex flex-col">
                   
                    <blockquote className="text-gray-700 dark:text-gray-200 italic leading-relaxed border-l-4 border-gray-300 dark:border-gray-700 pl-2 mb-2 text-sm">
                      "{story.story.length > 170 ? story.story.substring(0, 170) + '...' : story.story}"
                    </blockquote>
                    <div className="mt-auto flex gap-2 justify-center">
                      <a
                        href={story.videoUrl}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-900 text-white px-2 py-1 rounded font-medium hover:shadow-md transition-all duration-300 flex items-center text-xs group"
                        style={{minWidth: '80px'}}
                      >
                        <FaPlay className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform" />
                        Watch Full Story
                      </a>
                      <Link to="/ai-chatbot" className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-700 dark:to-emerald-900 text-white px-2 py-1 rounded font-medium hover:shadow-md transition-all duration-300 flex items-center text-xs group">
                        
                         Own Your Journey
                      </Link>
                    
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

     
      </div>
      <FooterComponent/>
    </div>
  );
};

export default SuccessStories;