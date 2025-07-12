import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const App = () => {
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
      {/* Enhanced Fixed Navigation */}
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-xl z-50 border-b border-gray-800/50 transition-all duration-300 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white hover:text-purple-400 transition-colors cursor-pointer font-poppins tracking-tight" onClick={() => scrollToSection('home')}>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Smart</span>
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
                    className={`group px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden font-inter ${
                      activeSection === item.id
                        ? 'text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-600/25'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <span className="relative z-10 flex items-center">
                      <span className="mr-1 text-xs">{item.icon}</span>
                      {item.label}
                    </span>
                    {activeSection !== item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-700 hover:scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1712323028707-6e59c3d2271a')`
          }}
        ></div>
        
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight font-poppins tracking-tight">
              Explore Jordan Smarter
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto leading-relaxed font-inter font-light">
              Unlock Jordan's hidden treasures with AI-powered recommendations, AR experiences, and real-time insights that transform your journey into an unforgettable adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => scrollToSection('features')}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 font-inter relative overflow-hidden"
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
      </section>

      {/* Enhanced Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/30 w-80 h-96 flex flex-col overflow-hidden group hover:shadow-purple-500/20 transition-all duration-500">
          {/* Enhanced header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 p-4 flex items-center justify-between relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
            
            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg font-poppins">Smart Guide</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-white/90 text-sm font-inter">AI Assistant Online</p>
                </div>
              </div>
            </div>
            
            {/* Chat controls */}
            <div className="flex items-center space-x-2 relative z-10">
              <button className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 relative bg-gradient-to-b from-gray-800/50 to-gray-900/80">
            {chatbotLoaded ? (
              <iframe
                src="about:blank"
                className="w-full h-full border-none"
                title="Smart Jordan AI Assistant"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 space-y-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse"></div>
                </div>
                
                {/* Welcome message */}
                <div className="text-center space-y-2">
                  <p className="text-white font-semibold text-lg font-poppins">Welcome to Smart Jordan!</p>
                  <p className="text-gray-300 text-sm font-inter leading-relaxed">
                    I'm your AI travel assistant, ready to help you explore Jordan's amazing destinations.
                  </p>
                </div>
                
                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  <button className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 backdrop-blur-sm">
                    🗺️ Plan Trip
                  </button>
                  <button className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 backdrop-blur-sm">
                    🏛️ Explore Sites
                  </button>
                </div>
                
                {/* Start button */}
                <button
                  onClick={() => setChatbotLoaded(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 font-inter"
                >
                  Start Conversation
                </button>
              </div>
            )}
          </div>
          
          {/* Input area (when loaded) */}
          {chatbotLoaded && (
            <div className="p-3 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700/50">
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Ask me anything about Jordan..."
                  className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-2xl px-4 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent backdrop-blur-sm"
                />
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Smart Features for Smart Travelers
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Experience Jordan like never before with AI-powered recommendations and real-time insights
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI Itinerary Suggestions",
                description: "Get personalized travel plans based on your preferences, time, and interests"
              },
              {
                icon: "🥽",
                title: "AR Views",
                description: "Augmented reality experiences that bring historical sites to life"
              },
              {
                icon: "📊",
                title: "IoT Sensors",
                description: "Real-time data on weather, crowds, and optimal visiting times"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-gray-700/50 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tourism Categories */}
      <section ref={exploreRef} id="explore" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Discover Jordan Your Way
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Choose your adventure and let our smart guide customize your perfect Jordan experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-900/70 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer border border-gray-700/50 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="h-48 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${category.image})` }}>
                  <div className="h-full bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-300 transition-colors">{category.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{category.description}</p>
                  <div className="flex items-center text-purple-400 font-medium text-sm group-hover:text-purple-300 transition-colors">
                    <span>Learn More</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Detail Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64 bg-cover bg-center rounded-t-2xl" style={{ backgroundImage: `url(${selectedCategory.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-t-2xl"></div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-4 left-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedCategory.title}</h2>
                <p className="text-gray-200">{selectedCategory.description}</p>
              </div>
            </div>
            
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-4">About {selectedCategory.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-6">{selectedCategory.fullDescription}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Experience Highlights</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedCategory.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105">
                  Book This Experience
                </button>
                <button className="border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white font-semibold py-3 px-8 rounded-full transition-all duration-300">
                  Add to Itinerary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Map Section */}
      <section ref={mapRef} id="map" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Interactive Map
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Explore Jordan's attractions with our smart interactive map
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="h-96 bg-gray-700/50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Map Integration Ready</h3>
                <p className="text-gray-300 mb-4">Connect your preferred mapping service</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Google Maps
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Leaflet.js
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    Custom Map
                  </button>
                </div>
              </div>
            </div>
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