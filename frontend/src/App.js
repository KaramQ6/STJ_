import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 28,
    humidity: 45,
    crowdLevel: 'Medium',
    airQuality: 'Good'
  });

  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Hello! I\'m your Smart Guide for Jordan. How can I help you plan your perfect journey?' },
    { type: 'user', text: 'What are the must-visit places in Jordan?' },
    { type: 'bot', text: 'Jordan offers incredible destinations! Petra is unmissable - explore the ancient Treasury at sunrise. The Wadi Rum desert provides stunning stargazing. Don\'t miss the Dead Sea for a unique floating experience, and Jerash for Roman ruins. Each offers unique experiences!' }
  ]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  // Simulate live sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: Math.round(25 + Math.random() * 10),
        humidity: Math.round(40 + Math.random() * 20),
        crowdLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        airQuality: ['Good', 'Moderate', 'Excellent'][Math.floor(Math.random() * 3)]
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      id: 'nature',
      title: 'Nature',
      description: 'Explore Jordan\'s breathtaking natural wonders from the stunning desert landscapes of Wadi Rum to the healing waters of the Dead Sea.',
      image: 'https://images.pexels.com/photos/17645580/pexels-photo-17645580.jpeg',
      features: ['Wadi Rum Desert', 'Dead Sea', 'Dana Biosphere Reserve', 'Azraq Wetland Reserve']
    },
    {
      id: 'culture',
      title: 'Culture',
      description: 'Discover Jordan\'s rich cultural heritage through ancient Petra, Roman ruins of Jerash, and traditional Bedouin experiences.',
      image: 'https://images.pexels.com/photos/3214958/pexels-photo-3214958.jpeg',
      features: ['Petra Archaeological Park', 'Jerash Roman Ruins', 'Amman Citadel', 'Bedouin Culture']
    },
    {
      id: 'religious',
      title: 'Religious',
      description: 'Follow in the footsteps of prophets with visits to Mount Nebo, Bethany Beyond Jordan, and other sacred biblical sites.',
      image: 'https://images.unsplash.com/photo-1750357445390-264bfe3b6db2',
      features: ['Mount Nebo', 'Bethany Beyond Jordan', 'Madaba Map', 'Mukawir (Machaerus)']
    },
    {
      id: 'adventure',
      title: 'Adventure',
      description: 'Experience thrilling adventures from hot air balloon rides over Wadi Rum to diving in the Red Sea at Aqaba.',
      image: 'https://images.unsplash.com/photo-1750357437870-5b4ef7f03df8',
      features: ['Hot Air Balloon', 'Desert Camping', 'Red Sea Diving', 'Canyoning Adventures']
    }
  ];

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setChatMessages(prev => [...prev, { type: 'user', text: currentMessage }]);
      setCurrentMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const responses = [
          "I'd recommend visiting Petra early morning for the best lighting and fewer crowds!",
          "The best time to visit Jordan is during spring (March-May) or autumn (September-November).",
          "Don't forget to try traditional Jordanian dishes like Mansaf and Maqluba!",
          "Wadi Rum offers incredible stargazing opportunities - consider an overnight desert camp!",
          "The Dead Sea's mineral-rich waters are perfect for a relaxing spa experience."
        ];
        setChatMessages(prev => [...prev, { 
          type: 'bot', 
          text: responses[Math.floor(Math.random() * responses.length)]
        }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sticky Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-lg z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Smart Jordan</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#explore" className="text-gray-300 hover:text-white transition-colors">Explore</a>
                <a href="#insights" className="text-gray-300 hover:text-white transition-colors">Insights</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-blue-900/30 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1712323028707-6e59c3d2271a')`
          }}
        ></div>
        
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Explore Jordan Smarter
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Unlock Jordan's hidden treasures with AI-powered recommendations, AR experiences, and real-time insights
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl">
              Start Your Smart Journey
            </button>
          </div>
        </div>

        {/* Floating Chatbot Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </section>

      {/* Chatbot Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md h-96 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Ask the Smart Guide</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about Jordan..."
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Smart Features for Smart Travelers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
              <div key={index} className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 border border-gray-700/50">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tourism Categories */}
      <section id="explore" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Discover Jordan Your Way
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose your adventure and let our smart guide customize your perfect Jordan experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-gray-900/70 transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-700/50"
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
              >
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }}>
                  <div className="h-full bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{category.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                  
                  {activeCategory === category.id && (
                    <div className="mt-4 animate-fade-in">
                      <h4 className="text-purple-400 font-medium mb-2">Featured Experiences:</h4>
                      <ul className="space-y-1">
                        {category.features.map((feature, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-center">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Smart Insights */}
      <section id="insights" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Live Smart Insights
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real-time data to help you plan the perfect visit
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Temperature', value: `${sensorData.temperature}°C`, icon: '🌡️', color: 'text-red-400' },
              { label: 'Humidity', value: `${sensorData.humidity}%`, icon: '💧', color: 'text-blue-400' },
              { label: 'Crowd Level', value: sensorData.crowdLevel, icon: '👥', color: 'text-yellow-400' },
              { label: 'Air Quality', value: sensorData.airQuality, icon: '🌬️', color: 'text-green-400' }
            ].map((insight, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-700/50">
                <div className="text-3xl mb-2">{insight.icon}</div>
                <div className={`text-2xl font-bold mb-1 ${insight.color}`}>{insight.value}</div>
                <div className="text-gray-300 text-sm">{insight.label}</div>
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
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                Start Your Smart Journey
              </button>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#explore" className="text-gray-300 hover:text-white transition-colors">Explore</a></li>
                <li><a href="#insights" className="text-gray-300 hover:text-white transition-colors">Insights</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
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
    </div>
  );
};

export default App;