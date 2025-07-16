import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import "./App.css";
import 'leaflet/dist/leaflet.css';
import ExploreSection from './components/ExploreSection';

const App = () => {
  // Fix for default Leaflet markers
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });
  }, []);

  // Jordan tourist destinations
  const jordanDestinations = [
    {
      id: 'petra',
      name: 'Petra',
      position: [30.3285, 35.4444],
      description: 'The ancient rose-red city carved into cliffs by the Nabataeans',
      type: 'historical',
      icon: '🏛️',
      details: 'UNESCO World Heritage Site and one of the New Seven Wonders of the World'
    },
    {
      id: 'wadi-rum',
      name: 'Wadi Rum',
      position: [29.5759, 35.4208],
      description: 'Dramatic desert landscape known as the Valley of the Moon',
      type: 'nature',
      icon: '🏜️',
      details: 'Protected desert wilderness with stunning red sand formations'
    },
    {
      id: 'dead-sea',
      name: 'Dead Sea',
      position: [31.5553, 35.4732],
      description: 'The lowest point on Earth with therapeutic mineral-rich waters',
      type: 'nature',
      icon: '🌊',
      details: 'Famous for its high salt content allowing effortless floating'
    },
    {
      id: 'jerash',
      name: 'Jerash',
      position: [32.2814, 35.8936],
      description: 'Remarkably preserved Roman ruins and ancient city',
      type: 'historical',
      icon: '🏛️',
      details: 'One of the best-preserved Roman provincial towns in the world'
    },
    {
      id: 'amman',
      name: 'Amman',
      position: [31.9454, 35.9284],
      description: 'Modern capital city blending ancient history with contemporary culture',
      type: 'city',
      icon: '🏙️',
      details: 'Jordan\'s bustling capital with ancient citadel and Roman amphitheater'
    },
    {
      id: 'aqaba',
      name: 'Aqaba',
      position: [29.5328, 34.9439],
      description: 'Red Sea resort town famous for diving and coral reefs',
      type: 'nature',
      icon: '🏖️',
      details: 'Gateway to spectacular underwater world and coral gardens'
    },
    {
      id: 'mount-nebo',
      name: 'Mount Nebo',
      position: [31.7690, 35.7272],
      description: 'Sacred biblical site where Moses viewed the Promised Land',
      type: 'religious',
      icon: '⛰️',
      details: 'Holy mountain with panoramic views and ancient mosaics'
    },
    {
      id: 'dana-reserve',
      name: 'Dana Biosphere Reserve',
      position: [30.6774, 35.6270],
      description: 'Jordan\'s largest nature reserve with diverse ecosystems',
      type: 'nature',
      icon: '🌿',
      details: 'Home to rare wildlife and stunning canyon landscapes'
    }
  ];

  // Custom marker icons for different types
  const createCustomIcon = (type, emoji) => {
    const iconHtml = `
      <div style="
        background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        border: 3px solid white;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transform: rotate(-45deg);
        position: relative;
      ">
        <span style="transform: rotate(45deg); filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">${emoji}</span>
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 35],
      popupAnchor: [0, -35]
    });
  };
  const [sensorData, setSensorData] = useState({
    temperature: 28,
    humidity: 45,
    crowdLevel: 'Medium',
    airQuality: 'Good'
  });

  const [previousSensorData, setPreviousSensorData] = useState({
    temperature: 28,
    humidity: 45,
    crowdLevel: 'Medium',
    airQuality: 'Good'
  });

  const [isDataUpdating, setIsDataUpdating] = useState(false);

  const [activeSection, setActiveSection] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [chatbotLoaded, setChatbotLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const exploreRef = useRef(null);
  const mapRef = useRef(null);
  const itineraryRef = useRef(null);
  const testimonialsRef = useRef(null);
  const insightsRef = useRef(null);

  // Simulate live sensor data updates with smooth animations
  useEffect(() => {
    const interval = setInterval(() => {
      setIsDataUpdating(true);
      setPreviousSensorData(sensorData);
      
      setTimeout(() => {
        setSensorData(prev => ({
          temperature: Math.round(25 + Math.random() * 10),
          humidity: Math.round(40 + Math.random() * 20),
          crowdLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          airQuality: ['Good', 'Moderate', 'Excellent'][Math.floor(Math.random() * 3)]
        }));
        setIsDataUpdating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [sensorData]);

  // Enhanced scroll tracking with progress bar and visibility animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollPercentage = (scrollY / documentHeight) * 100;
      
      setScrollProgress(scrollPercentage);
      setShowBackToTop(scrollY > 300);

      const sections = [
        { id: 'home', ref: heroRef },
        { id: 'features', ref: featuresRef },
        { id: 'explore', ref: exploreRef },
        { id: 'map', ref: mapRef },
        { id: 'itinerary', ref: itineraryRef },
        { id: 'testimonials', ref: testimonialsRef },
        { id: 'insights', ref: insightsRef }
      ];

      // Check section visibility and active section
      for (let section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          
          // Check if section is in viewport for animations
          const isInViewport = rect.top < windowHeight * 0.8 && rect.bottom > 0;
          setIsVisible(prev => ({
            ...prev,
            [section.id]: isInViewport
          }));
          
          // Set active section
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const refs = {
      home: heroRef,
      features: featuresRef,
      explore: exploreRef,
      map: mapRef,
      itinerary: itineraryRef,
      testimonials: testimonialsRef,
      insights: insightsRef
    };

    if (refs[sectionId]?.current) {
      refs[sectionId].current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    {
      id: 'nature',
      title: 'Nature',
      description: 'Explore Jordan\'s breathtaking natural wonders from the stunning desert landscapes of Wadi Rum to the healing waters of the Dead Sea.',
      image: 'https://images.pexels.com/photos/17645580/pexels-photo-17645580.jpeg',
      features: ['Wadi Rum Desert', 'Dead Sea', 'Dana Biosphere Reserve', 'Azraq Wetland Reserve'],
      fullDescription: 'Jordan\'s natural landscapes offer some of the world\'s most breathtaking experiences. From the otherworldly red sands of Wadi Rum, where Lawrence of Arabia once roamed, to the therapeutic waters of the Dead Sea, the lowest point on Earth. The Dana Biosphere Reserve showcases Jordan\'s incredible biodiversity, while the Azraq Wetland Reserve provides a crucial stopover for migratory birds.',
      highlights: [
        'Stargazing in Wadi Rum\'s pristine desert skies',
        'Floating in the mineral-rich Dead Sea waters',
        'Hiking through diverse ecosystems in Dana Reserve',
        'Bird watching at Azraq Wetland Reserve'
      ]
    },
    {
      id: 'culture',
      title: 'Culture',
      description: 'Discover Jordan\'s rich cultural heritage through ancient Petra, Roman ruins of Jerash, and traditional Bedouin experiences.',
      image: 'https://images.pexels.com/photos/3214958/pexels-photo-3214958.jpeg',
      features: ['Petra Archaeological Park', 'Jerash Roman Ruins', 'Amman Citadel', 'Bedouin Culture'],
      fullDescription: 'Jordan\'s cultural treasures span millennia, from the rose-red city of Petra carved by the Nabataeans to the remarkably preserved Roman ruins of Jerash. Experience authentic Bedouin hospitality in traditional goat-hair tents, witness ancient crafts being practiced, and explore the layers of history that make Jordan a living museum.',
      highlights: [
        'Walk through Petra\'s Treasury and Monastery',
        'Explore the colonnaded streets of Jerash',
        'Experience traditional Bedouin hospitality',
        'Visit ancient Amman Citadel overlooking the capital'
      ]
    },
    {
      id: 'religious',
      title: 'Religious',
      description: 'Follow in the footsteps of prophets with visits to Mount Nebo, Bethany Beyond Jordan, and other sacred biblical sites.',
      image: 'https://images.unsplash.com/photo-1750357445390-264bfe3b6db2',
      features: ['Mount Nebo', 'Bethany Beyond Jordan', 'Madaba Map', 'Mukawir (Machaerus)'],
      fullDescription: 'Jordan holds deep spiritual significance for three major world religions. Stand where Moses viewed the Promised Land from Mount Nebo, visit the site where Jesus was baptized at Bethany Beyond Jordan, and marvel at the ancient Madaba Map mosaic. These sacred sites offer profound spiritual experiences in breathtaking natural settings.',
      highlights: [
        'Stand at Mount Nebo where Moses viewed the Promised Land',
        'Visit the baptism site of Jesus Christ',
        'See the ancient Madaba Map mosaic',
        'Explore the fortress of Machaerus'
      ]
    },
    {
      id: 'adventure',
      title: 'Adventure',
      description: 'Experience thrilling adventures from hot air balloon rides over Wadi Rum to diving in the Red Sea at Aqaba.',
      image: 'https://images.unsplash.com/photo-1750357437870-5b4ef7f03df8',
      features: ['Hot Air Balloon', 'Desert Camping', 'Red Sea Diving', 'Canyoning Adventures'],
      fullDescription: 'Jordan offers world-class adventure experiences for thrill-seekers. Soar over the Martian landscapes of Wadi Rum in a hot air balloon, spend nights under star-filled desert skies, dive into the coral-rich waters of the Red Sea, and explore hidden canyons and wadis throughout the kingdom.',
      highlights: [
        'Hot air balloon flights over Wadi Rum at sunrise',
        'Overnight desert camping with Bedouin guides',
        'World-class diving and snorkeling in Aqaba',
        'Canyoning adventures in remote wadis'
      ]
    }
  ];

  const itinerarySteps = [
    {
      time: '09:00 AM',
      title: 'Arrive at Hotel',
      description: 'Check-in and receive your smart travel kit with IoT sensors and AR devices',
      icon: '🏨'
    },
    {
      time: '10:30 AM',
      title: 'Visit Downtown',
      description: 'Explore Amman\'s vibrant downtown with AI-guided walking tour',
      icon: '🏙️'
    },
    {
      time: '02:00 PM',
      title: 'Archaeological Site',
      description: 'Petra exploration with AR visualization of ancient structures',
      icon: '🏛️'
    },
    {
      time: '07:00 PM',
      title: 'Night Food Market',
      description: 'Traditional Jordanian cuisine experience with local food recommendations',
      icon: '🍽️'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      country: 'United States',
      rating: 5,
      text: 'The Smart Jordan experience was incredible! The AI recommendations led us to hidden gems we would never have found on our own. The real-time crowd data helped us avoid busy times at Petra.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Marco Rodriguez',
      country: 'Spain',
      rating: 5,
      text: 'The AR experiences at historical sites were mind-blowing. Seeing how Petra looked 2000 years ago through the AR glasses was like traveling back in time. Highly recommend!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emma Chen',
      country: 'Australia',
      rating: 5,
      text: 'The smart guide chatbot was like having a personal tour guide 24/7. It answered all our questions instantly and gave us perfect restaurant recommendations based on our preferences.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Enhanced Fixed Navigation with Scroll Progress */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-xl z-50 border-b border-gray-800/50 transition-all duration-300 shadow-xl">
        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 via-purple-400 to-blue-600 transition-all duration-300 ease-out shadow-lg shadow-purple-500/50" 
             style={{ width: `${scrollProgress}%` }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white hover:text-purple-400 transition-all duration-300 cursor-pointer font-poppins tracking-tight transform hover:scale-105" onClick={() => scrollToSection('home')}>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-glow">Smart</span>
                <span className="text-white ml-1">Jordan</span>
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {[
                  { id: 'home', label: 'Home', icon: '🏠' },
                  { id: 'features', label: 'Features', icon: '⚡' },
                  { id: 'explore', label: 'Explore', icon: '🗺️' },
                  { id: 'map', label: 'Map', icon: '📍' },
                  { id: 'itinerary', label: 'Itinerary', icon: '📋' },
                  { id: 'testimonials', label: 'Reviews', icon: '⭐' },
                  { id: 'insights', label: 'Insights', icon: '📊' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`group px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 relative overflow-hidden font-inter transform hover:scale-105 ${
                      activeSection === item.id
                        ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-600/25 scale-105'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="relative z-10 flex items-center">
                      <span className="mr-1 text-xs transition-transform duration-300 group-hover:scale-125">{item.icon}</span>
                      {item.label}
                    </span>
                    {activeSection !== item.id && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section with Dynamic Background */}
      <section ref={heroRef} id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/40 to-indigo-900/60 z-10 animate-pulse"></div>
        
        {/* Dynamic Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000 parallax"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1712323028707-6e59c3d2271a')`,
            transform: `translateY(${scrollProgress * 0.5}px) scale(1.1)`
          }}
        ></div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute inset-0 z-15">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Interactive Jordan Map Illustration */}
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 z-20 hidden lg:block">
          <div className="relative w-64 h-64 opacity-30 hover:opacity-50 transition-opacity duration-500 group">
            {/* Map Container */}
            <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/10 p-6 group-hover:scale-105 transition-transform duration-500">
              <div className="text-white/80 text-center">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-sm font-inter">Interactive Jordan Map</div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>📍 Petra</span>
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>🏛️ Jerash</span>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>🌊 Dead Sea</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>🏜️ Wadi Rum</span>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`relative z-20 text-center px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.home ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight font-poppins tracking-tight animate-glow">
              Explore Jordan Smarter
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto leading-relaxed font-inter font-light">
              Unlock Jordan's hidden treasures with AI-powered recommendations, AR experiences, and real-time insights that transform your journey into an unforgettable adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => scrollToSection('features')}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 font-inter relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Your Smart Journey
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              <button 
                onClick={() => scrollToSection('explore')}
                className="group border-2 border-white/30 hover:border-white/60 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10 font-inter relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore Categories
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Modern Messaging Interface Chatbot */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <div className={`bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 overflow-hidden ${chatbotLoaded ? 'w-96 h-[32rem]' : 'w-80 h-20'} hover:shadow-purple-500/20`}>
          
          {!chatbotLoaded ? (
            /* Compact Chat Trigger */
            <div 
              onClick={() => setChatbotLoaded(true)}
              className="flex items-center justify-between p-4 cursor-pointer group-hover:bg-white/5 transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg font-poppins">Smart Guide</h3>
                  <p className="text-white/70 text-sm font-inter">Click to chat</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          ) : (
            /* Full Chat Interface */
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 p-4 flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
                
                <div className="flex items-center space-x-3 relative z-10">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-purple-600 animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg font-poppins">Smart Jordan AI</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-white/90 text-sm font-inter">Online • Ready to help</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setChatbotLoaded(false)}
                  className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors relative z-10"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Chat Messages Area */}
              <div className="flex-1 p-4 space-y-4 bg-gradient-to-b from-gray-900/80 to-black/80 h-80 overflow-y-auto">
                {/* Welcome Message */}
                <div className="flex items-start space-x-3 animate-fade-in-up">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-tl-sm p-3 shadow-lg border border-white/10">
                      <p className="text-white text-sm font-inter leading-relaxed">
                        👋 Welcome to Smart Jordan! I'm your AI travel assistant. Ask me anything about Jordan's attractions, best travel times, local customs, or get personalized recommendations!
                      </p>
                    </div>
                    <p className="text-white/50 text-xs mt-1 font-inter">Just now</p>
                  </div>
                </div>
                
                {/* Suggested Quick Actions */}
                <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <p className="text-white/70 text-sm font-inter">Quick suggestions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 backdrop-blur-sm text-left">
                      🗺️ Plan my trip to Petra
                    </button>
                    <button className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 backdrop-blur-sm text-left">
                      🏛️ Explore historical sites
                    </button>
                    <button className="bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 backdrop-blur-sm text-left">
                      🌊 Dead Sea activities
                    </button>
                    <button className="bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/30 text-yellow-300 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 backdrop-blur-sm text-left">
                      🏜️ Wadi Rum adventures
                    </button>
                  </div>
                </div>
                
                {/* Typing indicator */}
                <div className="flex items-center space-x-2 opacity-70">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 bg-gray-800/80 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Ask me anything about Jordan..."
                      className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm font-inter"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-white/60 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                  </div>
                  <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enhanced Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.features ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-poppins">
              Smart Features for Smart Travelers
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-inter">
              Experience Jordan like never before with AI-powered recommendations and real-time insights
            </p>
          </div>
          
          <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 ${isVisible.features ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`} style={{animationDelay: '0.3s'}}>
            {[
              {
                icon: "🤖",
                title: "AI Itinerary Suggestions",
                description: "Get personalized travel plans based on your preferences, time, and interests",
                gradient: "from-purple-500/20 to-purple-700/20",
                borderColor: "border-purple-500/30",
                hoverGlow: "hover:shadow-purple-500/20"
              },
              {
                icon: "🥽",
                title: "AR Views",
                description: "Augmented reality experiences that bring historical sites to life",
                gradient: "from-blue-500/20 to-blue-700/20",
                borderColor: "border-blue-500/30",
                hoverGlow: "hover:shadow-blue-500/20"
              },
              {
                icon: "📊",
                title: "IoT Sensors",
                description: "Real-time data on weather, crowds, and optimal visiting times",
                gradient: "from-indigo-500/20 to-indigo-700/20",
                borderColor: "border-indigo-500/30",
                hoverGlow: "hover:shadow-indigo-500/20"
              }
            ].map((feature, index) => (
              <div key={index} className={`group bg-gradient-to-br ${feature.gradient} backdrop-blur-sm rounded-2xl p-8 hover:bg-gradient-to-br hover:from-gray-800/70 hover:to-gray-900/70 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border ${feature.borderColor} ${feature.hoverGlow} hover:shadow-2xl relative overflow-hidden animate-fade-in-up`} style={{animationDelay: `${0.1 * index}s`}}>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-purple-300 transition-colors font-poppins">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed font-inter group-hover:text-gray-200 transition-colors">{feature.description}</p>
                  
                  {/* Progress indicator */}
                  <div className="mt-6 w-full bg-gray-700/50 rounded-full h-1 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`h-full bg-gradient-to-r ${feature.gradient.replace('/20', '')} transition-all duration-1000 ease-out group-hover:w-full`} style={{width: '0%'}}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Explore Section */}
      <ExploreSection exploreRef={exploreRef} isVisible={isVisible} />

      {/* Interactive Jordan Map Section */}
      <section ref={mapRef} id="map" className={`py-20 bg-gray-900 relative overflow-hidden transition-all duration-1000 ${isVisible.map ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-poppins">
              Explore Jordan Interactive Map
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-inter">
              Discover Jordan's magnificent destinations with our interactive map featuring all major tourist attractions
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Container */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 shadow-2xl hover:shadow-purple-500/10">
                <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden">
                  <MapContainer
                    center={[31.2397, 35.2305]} // Center of Jordan
                    zoom={7}
                    style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                    className="z-10"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {jordanDestinations.map((destination) => (
                      <Marker
                        key={destination.id}
                        position={destination.position}
                        icon={createCustomIcon(destination.type, destination.icon)}
                      >
                        <Popup className="custom-popup">
                          <div className="p-2 min-w-[250px]">
                            <div className="flex items-center mb-2">
                              <span className="text-2xl mr-2">{destination.icon}</span>
                              <h3 className="font-bold text-lg text-gray-800">{destination.name}</h3>
                            </div>
                            <p className="text-gray-600 mb-2 font-medium">{destination.description}</p>
                            <p className="text-sm text-gray-500 mb-3">{destination.details}</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                destination.type === 'historical' ? 'bg-amber-100 text-amber-800' :
                                destination.type === 'nature' ? 'bg-green-100 text-green-800' :
                                destination.type === 'religious' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {destination.type.charAt(0).toUpperCase() + destination.type.slice(1)}
                              </span>
                              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300">
                                Learn More
                              </button>
                            </div>
                          </div>
                        </Popup>
                        <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                          <div className="text-center">
                            <div className="text-lg mb-1">{destination.icon}</div>
                            <div className="font-semibold">{destination.name}</div>
                          </div>
                        </Tooltip>
                      </Marker>
                    ))}
                  </MapContainer>
                  
                  {/* Map Overlay Controls */}
                  <div className="absolute top-4 right-4 z-[1000] space-y-2">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                      <div className="text-xs font-medium text-gray-700 mb-1">Legend</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center"><span className="mr-1">🏛️</span> Historical</div>
                        <div className="flex items-center"><span className="mr-1">🌊</span> Nature</div>
                        <div className="flex items-center"><span className="mr-1">⛰️</span> Religious</div>
                        <div className="flex items-center"><span className="mr-1">🏙️</span> Cities</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Destinations List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4 font-poppins">Featured Destinations</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                {jordanDestinations.map((destination, index) => (
                  <div 
                    key={destination.id}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 cursor-pointer animate-fade-in-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{destination.icon}</span>
                      <div>
                        <h4 className="text-white font-semibold">{destination.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          destination.type === 'historical' ? 'bg-amber-600/20 text-amber-400' :
                          destination.type === 'nature' ? 'bg-green-600/20 text-green-400' :
                          destination.type === 'religious' ? 'bg-purple-600/20 text-purple-400' :
                          'bg-blue-600/20 text-blue-400'
                        }`}>
                          {destination.type}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{destination.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Map Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mt-16">
            {[
              { label: 'UNESCO Sites', value: '5', icon: '🏛️', color: 'text-amber-400' },
              { label: 'Natural Reserves', value: '3', icon: '🌿', color: 'text-green-400' },
              { label: 'Historical Sites', value: '15+', icon: '📿', color: 'text-purple-400' },
              { label: 'Adventure Spots', value: '8', icon: '🏕️', color: 'text-blue-400' }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggested Smart Tour Plan */}
      <section ref={itineraryRef} id="itinerary" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Suggested Smart Tour Plan
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              A perfectly curated day in Jordan powered by AI recommendations
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 to-blue-600"></div>
              
              {itinerarySteps.map((step, index) => (
                <div key={index} className="relative flex items-start mb-12 last:mb-0">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full border-4 border-gray-800 shadow-lg"></div>
                  
                  {/* Content */}
                  <div className="ml-20 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">{step.icon}</span>
                      <div>
                        <span className="text-purple-400 font-semibold">{step.time}</span>
                        <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} id="testimonials" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              What Travelers Say
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Real experiences from smart travelers who explored Jordan with us
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.country}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Smart Insights */}
      <section ref={insightsRef} id="insights" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Live Smart Insights
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time data to help you plan the perfect visit
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                label: 'Temperature', 
                value: `${sensorData.temperature}°C`, 
                icon: '🌡️', 
                color: 'text-red-400',
                bgColor: 'from-red-500/20 to-orange-500/20',
                borderColor: 'border-red-500/30',
                unit: '°C',
                rawValue: sensorData.temperature,
                previousValue: previousSensorData.temperature
              },
              { 
                label: 'Humidity', 
                value: `${sensorData.humidity}%`, 
                icon: '💧', 
                color: 'text-blue-400',
                bgColor: 'from-blue-500/20 to-cyan-500/20',
                borderColor: 'border-blue-500/30',
                unit: '%',
                rawValue: sensorData.humidity,
                previousValue: previousSensorData.humidity
              },
              { 
                label: 'Crowd Level', 
                value: sensorData.crowdLevel, 
                icon: '👥', 
                color: 'text-yellow-400',
                bgColor: 'from-yellow-500/20 to-orange-500/20',
                borderColor: 'border-yellow-500/30',
                unit: '',
                rawValue: sensorData.crowdLevel,
                previousValue: previousSensorData.crowdLevel
              },
              { 
                label: 'Air Quality', 
                value: sensorData.airQuality, 
                icon: '🌬️', 
                color: 'text-green-400',
                bgColor: 'from-green-500/20 to-emerald-500/20',
                borderColor: 'border-green-500/30',
                unit: '',
                rawValue: sensorData.airQuality,
                previousValue: previousSensorData.airQuality
              }
            ].map((insight, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${insight.bgColor} backdrop-blur-sm rounded-2xl p-6 text-center border ${insight.borderColor} hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden group`}
              >
                {/* Animated background glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${insight.bgColor} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                
                {/* Update indicator */}
                {isDataUpdating && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                )}
                
                <div className="relative z-10">
                  <div className={`text-4xl mb-4 transform hover:scale-110 transition-transform duration-300 ${isDataUpdating ? 'animate-pulse' : ''}`}>
                    {insight.icon}
                  </div>
                  
                  <div className={`text-2xl font-bold mb-2 ${insight.color} transition-all duration-500 ${
                    isDataUpdating ? 'transform scale-110 animate-pulse' : ''
                  } ${insight.rawValue !== insight.previousValue ? 'animate-bounce' : ''}`}>
                    <span className="font-mono tracking-wider">{insight.value}</span>
                  </div>
                  
                  <div className="text-gray-300 text-sm font-medium tracking-wide uppercase">
                    {insight.label}
                  </div>
                  
                  {/* Progress bar for numeric values */}
                  {typeof insight.rawValue === 'number' && (
                    <div className="mt-3 w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${insight.bgColor} transition-all duration-1000 ease-out`}
                        style={{ 
                          width: insight.label === 'Temperature' 
                            ? `${Math.min((insight.rawValue / 40) * 100, 100)}%`
                            : `${Math.min((insight.rawValue / 100) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  )}
                  
                  {/* Status indicator for text values */}
                  {typeof insight.rawValue === 'string' && (
                    <div className="mt-3 flex justify-center">
                      <div className={`w-2 h-2 rounded-full ${
                        insight.rawValue === 'Good' || insight.rawValue === 'Excellent' || insight.rawValue === 'Low' 
                          ? 'bg-green-400' 
                          : insight.rawValue === 'Medium' || insight.rawValue === 'Moderate'
                          ? 'bg-yellow-400'
                          : 'bg-red-400'
                      } animate-pulse`}></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 border-t border-gray-800">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/3250591/pexels-photo-3250591.jpeg')`
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-white">Smart Jordan</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Your intelligent companion for exploring Jordan's wonders. Experience the future of travel with AI-powered insights and real-time data.
              </p>
              <button 
                onClick={() => scrollToSection('home')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Start Your Smart Journey
              </button>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'features', label: 'Features' },
                  { id: 'explore', label: 'Explore' },
                  { id: 'insights', label: 'Insights' }
                ].map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors transform hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors transform hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors transform hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 Smart Jordan. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-3 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 z-40 animate-fade-in"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default App;