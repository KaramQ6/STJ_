import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom component to handle map view changes
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const App = () => {
    // --- STATE MANAGEMENT ---
    const [activeSection, setActiveSection] = useState('home');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [insights, setInsights] = useState({ temp: '--', humidity: '--', crowd: '...', air: '...' });
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'أهلاً بك! أنا مرشدك السياحي الذكي في الأردن. كيف يمكنني مساعدتك اليوم؟' }]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // --- REFS FOR SCROLLING ---
    const sectionRefs = {
        home: useRef(null),
        features: useRef(null),
        insights: useRef(null),
        map: useRef(null),
        explore: useRef(null),
    };

    // --- DATA ---
    const touristSites = [
        { id: 1, name: "البتراء", coords: [30.3285, 35.4444], icon: '🏛️' },
        { id: 2, name: "جرش", coords: [32.2730, 35.8911], icon: '🏛️' },
        { id: 3, name: "وادي رم", coords: [29.5732, 35.4194], icon: '🏜️' },
        { id: 4, name: "البحر الميت", coords: [31.5553, 35.4732], icon: '🌊' },
        { id: 5, name: "العقبة", coords: [29.5328, 34.9439], icon: '🏖️' },
    ];

    // --- MAP ICONS ---
    const redIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
    const blueIcon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

    // --- EFFECTS ---
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
            const currentSection = Object.keys(sectionRefs).find(key => {
                const ref = sectionRefs[key];
                if (ref.current) {
                    const rect = ref.current.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            if (currentSection) setActiveSection(currentSection);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sectionRefs]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchInsights = async () => {
            const apiKey = 'YOUR_API_KEY_HERE'; // <--- ضع مفتاحك هنا
            const getWeatherData = async (lat, lon) => {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Weather data fetch failed");
                    const data = await response.json();
                    setInsights(prev => ({ ...prev, temp: Math.round(data.main.temp), humidity: data.main.humidity }));
                } catch (error) {
                    console.error("Weather API Error:", error);
                    setInsights(prev => ({ ...prev, temp: 25, humidity: 40 })); // Fallback
                }
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => getWeatherData(pos.coords.latitude, pos.coords.longitude),
                    () => getWeatherData(31.95, 35.93) // Fallback to Amman
                );
            } else {
                getWeatherData(31.95, 35.93); // Fallback if no geolocation
            }
        };

        const updateSimulatedInsights = () => {
            const crowdLevels = ["منخفض", "متوسط", "مرتفع"];
            const airQualityLevels = ["جيدة", "متوسطة", "سيئة"];
            setInsights(prev => ({
                ...prev,
                crowd: crowdLevels[Math.floor(Math.random() * 3)],
                air: airQualityLevels[Math.floor(Math.random() * 3)]
            }));
        };

        fetchInsights();
        updateSimulatedInsights();
        const interval = setInterval(updateSimulatedInsights, 10000); // Update simulated data every 10s
        return () => clearInterval(interval);
    }, []);

    // --- HANDLERS ---
    const scrollToSection = (id) => {
        sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const input = e.target.elements.message;
        const userInput = input.value.trim();
        if (!userInput) return;

        const newMessages = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);
        input.value = '';
        setIsTyping(true);

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
            const botResponse = data.response || "عذراً، لم أستطع الحصول على إجابة.";
            
            setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        } catch (error) {
            console.error("Chat API Error:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: `❌ عذراً، فشل الاتصال بالخادم. ${error.message}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="App">
            <nav className="navbar">
                <div className="nav-container container">
                    <a className="logo" href="#home" onClick={() => scrollToSection('home')}>SmartTour.JO</a>
                    <ul className="nav-menu">
                        {Object.keys(sectionRefs).map(key => (
                             <li key={key}>
                                <a href={`#${key}`} onClick={() => scrollToSection(key)} className={`nav-link ${activeSection === key ? 'active' : ''}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</a>
                             </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <main>
                <section ref={sectionRefs.home} id="home" className="hero">
                    <div className="hero-content">
                        <h1>اكتشف الأردن بذكاء</h1>
                        <p>رفيقك الذكي لاستكشاف كنوز الأردن الخفية</p>
                    </div>
                </section>
                
                <section ref={sectionRefs.features} id="features" className="section">
                    <div className="container">
                        <h2 className="section-title">الميزات الذكية</h2>
                        <div className="features-grid">
                            <div className="feature-card">🤖<h3>مرشد ذكي</h3><p>توصيات وخطط سياحية مخصصة.</p></div>
                            <div className="feature-card">📊<h3>مؤشرات حيوية</h3><p>بيانات لحظية للطقس والازدحام.</p></div>
                            <div className="feature-card">📸<h3>تجارب تفاعلية</h3><p>جولات افتراضية وعرض 360 درجة.</p></div>
                        </div>
                    </div>
                </section>

                <section ref={sectionRefs.insights} id="insights" className="section">
                    <div className="container">
                         <h2 className="section-title">المؤشرات الحيوية</h2>
                         <div className="insights-grid">
                            <div className="insight-card"><span className="insight-icon">🌡️</span><div className="insight-value">{insights.temp}°C</div><div className="insight-label">درجة الحرارة</div></div>
                            <div className="insight-card"><span className="insight-icon">💧</span><div className="insight-value">{insights.humidity}%</div><div className="insight-label">الرطوبة</div></div>
                            <div className="insight-card"><span className="insight-icon">👥</span><div className="insight-value">{insights.crowd}</div><div className="insight-label">الازدحام</div></div>
                            <div className="insight-card"><span className="insight-icon">🌬️</span><div className="insight-value">{insights.air}</div><div className="insight-label">جودة الهواء</div></div>
                        </div>
                    </div>
                </section>

                <section ref={sectionRefs.map} id="map" className="section">
                    <div className="container">
                        <h2 className="section-title">الخريطة التفاعلية</h2>
                        <div className="map-container">
                             <MapContainer center={[31.95, 35.93]} zoom={7} style={{ height: '500px', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {touristSites.map(site => (
                                    <Marker key={site.id} position={site.coords} icon={blueIcon}>
                                        <Popup>{site.name}</Popup>
                                    </Marker>
                                ))}
                             </MapContainer>
                        </div>
                    </div>
                </section>

                 <section ref={sectionRefs.explore} id="explore" className="section">
                    <div className="container">
                        <h2 className="section-title">تجارب تفاعلية</h2>
                        <p className="section-subtitle">انغمس في جمال الأردن قبل أن تصل</p>
                        <div className="gallery-buttons">
                            <a href="/virtual-tour.html" target="_blank" className="btn btn-primary">🎥 جولة افتراضية</a>
                            <a href="/360-view.html" target="_blank" className="btn btn-primary">🌍 عرض 360°</a>
                        </div>
                    </div>
                </section>

            </main>

            <div className="chatbot-container">
                <div className="chat-window">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                    {isTyping && <div className="chat-message bot typing">...</div>}
                    <div ref={chatEndRef} />
                </div>
                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input name="message" type="text" placeholder="اسأل أي شيء..."/>
                    <button type="submit" className="btn btn-primary">أرسل</button>
                </form>
            </div>

            {showBackToTop && <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="back-to-top">↑</button>}
        </div>
    );
};

export default App;