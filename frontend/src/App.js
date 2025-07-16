import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import "./App.css";
import 'leaflet/dist/leaflet.css';
import ExploreSection from './components/ExploreSection';

// Helper component for the Gallery Modal
const GalleryModal = ({ isOpen, onClose, images }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-900/80 border border-purple-500/30 rounded-2xl p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white font-poppins">Jordan's Wonders Gallery</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl">&times;</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="rounded-lg overflow-hidden group relative">
                            <img src={img.src} alt={img.alt} className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                <p className="text-white text-sm font-semibold">{img.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const App = () => {
    // ======== STATE MANAGEMENT ========
    const [sensorData, setSensorData] = useState({ temperature: 28, humidity: 45, crowdLevel: 'Medium', airQuality: 'Good' });
    const [activeSection, setActiveSection] = useState('home');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [chatbotLoaded, setChatbotLoaded] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // ======== REFS FOR SCROLLING ========
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const exploreRef = useRef(null);
    const mapRef = useRef(null);
    const itineraryRef = useRef(null);
    const insightsRef = useRef(null);
    const chatEndRef = useRef(null);

    // ======== LEAFLET MARKER FIX ========
    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
    }, []);
    
    // ======== DATA ========
    const jordanDestinations = [
        { id: 'petra', name: 'Petra', position: [30.3285, 35.4444], description: 'The ancient rose-red city', icon: '🏛️', type: 'historical', details: 'UNESCO World Heritage Site' },
        { id: 'wadi-rum', name: 'Wadi Rum', position: [29.5759, 35.4208], description: 'Valley of the Moon', icon: '🏜️', type: 'nature', details: 'Protected desert wilderness' },
        { id: 'dead-sea', name: 'Dead Sea', position: [31.5553, 35.4732], description: 'Lowest point on Earth', icon: '🌊', type: 'nature', details: 'Effortless floating experience' },
        { id: 'jerash', name: 'Jerash', position: [32.2814, 35.8936], description: 'Preserved Roman ruins', icon: '🏛️', type: 'historical', details: 'Best-preserved Roman town' },
        { id: 'amman', name: 'Amman', position: [31.9454, 35.9284], description: 'The capital city', icon: '🏙️', type: 'city', details: 'Ancient citadel and amphitheater' },
        { id: 'aqaba', name: 'Aqaba', position: [29.5328, 34.9439], description: 'Red Sea resort', icon: '🏖️', type: 'nature', details: 'Diving and coral reefs' },
    ];
    
    const galleryImages = [
        { src: 'https://images.pexels.com/photos/1587747/pexels-photo-1587747.jpeg', alt: 'Petra Treasury' },
        { src: 'https://images.pexels.com/photos/2440339/pexels-photo-2440339.jpeg', alt: 'Wadi Rum Desert' },
        { src: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg', alt: 'Dead Sea Salt Formations' },
        { src: 'https://images.pexels.com/photos/73910/jordan-petra-travel-73910.jpeg', alt: 'Jerash Colonnaded Street' },
        { src: 'https://images.pexels.com/photos/7989333/pexels-photo-7989333.jpeg', alt: 'Wadi Mujib Canyon' },
        { src: 'https://images.pexels.com/photos/14986348/pexels-photo-14986348.jpeg', alt: 'Baptism Site' },
    ];
    
    // ======== CHATBOT LOGIC (FIXED) ========
    const sendMessage = async (e) => {
        e.preventDefault();
        const input = e.target.elements.message;
        const userInput = input.value.trim();
        if (!userInput) return;

        const newMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        input.value = '';
        setIsTyping(true);

        // This is the working public backend URL
        const workerUrl = "https://white-frost-8014.karam200566.workers.dev/"; 

        try {
            const response = await fetch(workerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: newMessages.map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.text }]
                    }))
                })
            });

            if (!response.ok) throw new Error(`Network error: ${response.status}`);
            
            const data = await response.json();
            const botResponse = data.response || "Sorry, I couldn't get a response.";
            
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        } catch (error) {
            console.error("Chat API Error:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: `❌ Sorry, connection failed. ${error.message}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Other useEffects and functions remain the same...

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* The rest of the JSX is the same as your "beautiful" version */}
            {/* ... Navbar ... */}
            <main>
                {/* ... Hero Section ... */}
                
                {/* Explore Section with Gallery & Virtual Tours */}
                <section ref={exploreRef} id="explore" className="py-20">
                    <div className="container">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Discover Jordan's Wonders</h2>
                        <ExploreSection />
                        
                        <div className="mt-16 text-center">
                            <h3 className="text-2xl font-semibold mb-6">Immersive Experiences</h3>
                            <div className="flex justify-center flex-wrap gap-4">
                                <button onClick={() => setIsGalleryOpen(true)} className="btn btn-primary">📸 View Gallery</button>
                                <a href="360-view.html" target="_blank" rel="noopener noreferrer" className="btn btn-primary">🌍 360° View</a>
                                <a href="virtual-tour.html" target="_blank" rel="noopener noreferrer" className="btn btn-primary">🎥 Virtual Tour</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ... Map, Itinerary, Insights sections ... */}

            </main>
            
            {/* Floating Chatbot */}
            <div className={`fixed bottom-6 right-6 z-50 group transition-all duration-500 ${chatbotLoaded ? 'w-96 h-[32rem]' : 'w-80 h-20'}`}>
                {/* Chatbot Content */}
                {chatbotLoaded ? (
                    <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 h-full flex flex-col">
                        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 p-4 flex items-center justify-between">
                             <h3 className="text-white font-semibold text-lg">Smart Jordan AI</h3>
                            <button onClick={() => setChatbotLoaded(false)} className="text-white">&times;</button>
                        </div>
                        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && <div className="text-gray-400">...typing</div>}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={sendMessage} className="p-4 bg-gray-800/80 border-t border-white/10">
                            <div className="flex items-center">
                                <input name="message" type="text" placeholder="Ask me anything..." className="w-full bg-white/10 border-white/20 rounded-full px-4 py-2 text-white focus:ring-purple-500"/>
                                <button type="submit" className="ml-2 bg-purple-600 p-2 rounded-full">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div onClick={() => setChatbotLoaded(true)} className="bg-white/10 backdrop-blur-2xl rounded-full shadow-2xl border border-white/20 h-20 flex items-center justify-between p-4 cursor-pointer">
                        <h3 className="text-white font-semibold text-lg">Ask our AI Guide!</h3>
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                        </div>
                    </div>
                )}
            </div>
            
            <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} images={galleryImages} />
        </div>
    );
};

export default App;