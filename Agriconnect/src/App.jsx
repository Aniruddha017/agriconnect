import React, { useState, useEffect, useRef } from 'react';
import { Cloud, Droplets, Wind, ThermometerSun, Sprout, TrendingUp, MessageSquare, Users, BarChart3, Sun, Moon, Menu, X, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
const apiKey = "694acb9098ddf20e13e0eae5af2a5cc9";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const WeatherPage = ({ city, setCity, weather, fetchWeather, weatherLoading, t, darkMode }) => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
      <Cloud className="text-blue-600" />
      {t.weatherUpdates}
    </h1>

    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-lg mb-8`}>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder={t.enterCity}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 p-3 border rounded-lg"
        />
        <button
          onClick={fetchWeather}
          disabled={weatherLoading}
          className="bg-blue-600 text-black px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          {weatherLoading ? "Loading..." : t.getWeather}
        </button>
      </div>

      {weather && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className={`${darkMode ? 'bg-orange-900' : 'bg-orange-50'} p-6 rounded-xl text-center`}>
              <ThermometerSun className="mx-auto mb-3 text-orange-600" size={40} />
              <p className="text-sm opacity-70 mb-2">Temperature</p>
              <p className="text-3xl font-bold text-orange-600">{weather.temperature}°C</p>
            </div>

            <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-6 rounded-xl text-center`}>
              <Droplets className="mx-auto mb-3 text-blue-600" size={40} />
              <p className="text-sm opacity-70 mb-2">Humidity</p>
              <p className="text-3xl font-bold text-blue-600">{weather.humidity}%</p>
            </div>

            <div className={`${darkMode ? 'bg-cyan-900' : 'bg-cyan-50'} p-6 rounded-xl text-center`}>
              <Wind className="mx-auto mb-3 text-cyan-600" size={40} />
              <p className="text-sm opacity-70 mb-2">Wind Speed</p>
              <p className="text-3xl font-bold text-cyan-600">{weather.windSpeed} km/h</p>
            </div>

            <div className={`${darkMode ? 'bg-indigo-900' : 'bg-indigo-50'} p-6 rounded-xl text-center`}>
              <Cloud className="mx-auto mb-3 text-indigo-600" size={40} />
              <p className="text-sm opacity-70 mb-2">Rainfall</p>
              <p className="text-3xl font-bold text-indigo-600">{weather.rainfall} mm</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">5-Day Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weather.forecast}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rain"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Rainfall (mm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} p-6 rounded-xl`}>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="text-green-600" />
              Farming Advice
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Moderate temperature ideal for most crops</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Plan irrigation for days with low rainfall forecast</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Good conditions for field preparation and sowing</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  </div>
);

const ChatPage = ({ messages, userInput, setUserInput, sendChatMessage, t, darkMode }) => {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendChatMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <MessageSquare className="text-purple-600" />
        {t.communityChatbot}
      </h1>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
        <div 
          className="h-96 overflow-y-auto mb-4 space-y-4 pr-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : darkMode ? 'bg-gray-700 rounded-bl-none' : 'bg-gray-100 rounded-bl-none'
              }`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex gap-3">
          <input 
            ref={inputRef}
            type="text"
            placeholder={t.typeMessage}
            className={`flex-1 p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button 
            onClick={sendChatMessage}
            className="bg-green-600 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            {t.sendMessage}
          </button>
        </div>
        
        <div className={`mt-6 p-4 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-xl`}>
          <p className="text-sm">
            <strong>Sample Questions:</strong> "Which crop is best for black soil in Rabi season?" • 
            "How to control pests in paddy?" • "Best fertilizer for wheat?"
          </p>
        </div>
      </div>
      
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="text-green-600" />
            Connect with Local Experts
          </h3>
          <div className="space-y-3">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-4 rounded-lg`}>
              <p className="font-semibold">Dr. Amit Patel</p>
              <p className="text-sm opacity-70">Soil Science Expert</p>
              <p className="text-sm text-green-600">Available Now</p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-green-50'} p-4 rounded-lg`}>
              <p className="font-semibold">Sunita Verma</p>
              <p className="text-sm opacity-70">Crop Management Specialist</p>
              <p className="text-sm text-green-600">Available Now</p>
            </div>
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Agricultural Helplines</h3>
          <div className="space-y-3">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
              <p className="font-semibold">Kisan Call Centre</p>
              <p className="text-blue-600">1800-180-1551</p>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-blue-50'} p-4 rounded-lg`}>
              <p className="font-semibold">Agriculture Ministry Helpline</p>
              <p className="text-blue-600">011-23382012</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForumPage = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Best fertilizers for Loamy Soil",
      content: "What fertilizers work best for loamy soil to maximize yield?",
      author: "Ravi Sharma",
      time: "2 hours ago",
      comments: [
        { author: "Expert Anil", text: "Use NPK 10:26:26 or compost for better soil structure." },
        { author: "Suman", text: "Organic manure also helps in loamy soil!" }
      ],
      showComments: false
    },
    {
      id: 2,
      title: "How to deal with pest attack in Kharif season?",
      content: "Recently my crops are affected by pests, please suggest remedies.",
      author: "Amit Kumar",
      time: "5 hours ago",
      comments: [
        { author: "Expert Renu", text: "Spray neem-based organic pesticide every 7 days." }
      ],
      showComments: false
    },
    {
      id: 3,
      title: "Drip irrigation setup guide for beginners",
      content: "I want to set up drip irrigation for 2 acres of land. Any guidance?",
      author: "Priya Verma",
      time: "1 day ago",
      comments: [],
      showComments: false
    }
  ]);

  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });

  const addPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.author) return;
    const post = {
      id: Date.now(),
      ...newPost,
      time: "Just now",
      comments: [],
      showComments: false
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', author: '' });
  };

  const toggleComments = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, showComments: !p.showComments } : p));
  };

  const addComment = (postId, author, text) => {
    if (!author || !text) return;
    setPosts(posts.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { author, text }] }
        : p
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold mb-4 flex items-center gap-3 text-green-600">
        <MessageSquare className="text-green-600" /> Discussion Forum
      </h1>

      {/* Create Post Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Start a New Discussion</h2>
        <form onSubmit={addPost} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-3 border rounded-lg border-gray-300"
          />
          <textarea
            placeholder="Write your discussion content..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="w-full p-3 border rounded-lg border-gray-300"
            rows="3"
          ></textarea>
          <input
            type="text"
            placeholder="Your Name"
            value={newPost.author}
            onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
            className="w-full p-3 border rounded-lg border-gray-300"
          />
          <button
            type="submit"
            className="bg-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            Post Discussion
          </button>
        </form>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold mb-2 text-green-700">{post.title}</h3>
            <p className="text-gray-700 mb-3">{post.content}</p>
            <p className="text-sm text-gray-500 mb-4">
              Posted by <span className="font-semibold">{post.author}</span> • {post.time}
            </p>

            <button
              onClick={() => toggleComments(post.id)}
              className="text-green-600 font-medium mb-3"
            >
              {post.showComments
                ? `Hide Comments (${post.comments.length})`
                : `View Comments (${post.comments.length})`}
            </button>

            {post.showComments && (
              <div className="mt-4 space-y-4">
                {post.comments.map((c, i) => (
                  <div key={i} className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">{c.author}:</span> {c.text}
                    </p>
                  </div>
                ))}

                {/* Add Comment */}
                <AddCommentForm postId={post.id} addComment={addComment} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ⬇️ Comment Form with "Post Comment" button
const AddCommentForm = ({ postId, addComment }) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment(postId, author, text);
    setAuthor('');
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-4 bg-green-50 p-4 rounded-xl border border-green-200">
      <input
        type="text"
        placeholder="Your Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="w-full p-2 border rounded-lg border-gray-300"
      />
      <textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded-lg border-gray-300"
        rows="2"
      ></textarea>
      <button
        type="submit"
        className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-semibold"
      >
        Post Comment
      </button>
    </form>
  );
};

const AgriConnect = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Crop Prediction States
  const [cropForm, setCropForm] = useState({
    soilType: '',
    landArea: '',
    season: '',
    cropName: '',
    irrigation: '',
    pesticide: '',
    insecticide: ''
  });
  const [prediction, setPrediction] = useState(null);
  
  // Weather States
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  // Chatbot States
  const [messages, setMessages] = useState([
    { role: 'bot', text: language === 'hi' ? 'नमस्ते! मैं AgriConnect सहायक हूं। मैं आपकी खेती से संबंधित किसी भी प्रश्न में मदद कर सकता हूं।' : 'Hello! I\'m AgriConnect Assistant. How can I help you with your farming queries today?' }
  ]);
  const [userInput, setUserInput] = useState('');

  const translations = {
    en: {
      title: 'AgriConnect',
      tagline: 'From Soil to Success — Smart Farming Starts Here',
      home: 'Home',
      predict: 'Predict Yield',
      weather: 'Weather',
      chat: 'Community',
      dashboard: 'Dashboard',
      predictCropYield: 'Predict Crop Yield',
      weatherUpdates: 'Weather Updates',
      communityChatbot: 'Chatbot',
      soilType: 'Soil Type',
      landArea: 'Land Area (hectares)',
      season: 'Season',
      cropName: 'Crop Name',
      irrigation: 'Irrigation Availability',
      pesticide: 'Pesticide Availability',
      insecticide: 'Insecticide Availability',
      available: 'Available',
      notAvailable: 'Not Available',
      submit: 'Predict',
      enterCity: 'Enter your city name',
      getWeather: 'Get Weather',
      sendMessage: 'Send',
      typeMessage: 'Type your farming question...'
    },
    hi: {
      title: 'एग्रीकनेक्ट',
      tagline: 'मिट्टी से सफलता तक — स्मार्ट खेती यहाँ से शुरू होती है',
      home: 'होम',
      predict: 'उपज की भविष्यवाणी',
      weather: 'मौसम',
      chat: 'समुदाय',
      dashboard: 'डैशबोर्ड',
      predictCropYield: 'फसल उपज की भविष्यवाणी करें',
      weatherUpdates: 'मौसम अपडेट',
      communityChatbot: 'चैटबॉट',
      soilType: 'मिट्टी का प्रकार',
      landArea: 'भूमि क्षेत्र (हेक्टेयर)',
      season: 'मौसम',
      cropName: 'फसल का नाम',
      irrigation: 'सिंचाई उपलब्धता',
      pesticide: 'कीटनाशक उपलब्धता',
      insecticide: 'कीटनाशक उपलब्धता',
      available: 'उपलब्ध',
      notAvailable: 'उपलब्ध नहीं',
      submit: 'भविष्यवाणी करें',
      enterCity: 'अपने शहर का नाम दर्ज करें',
      getWeather: 'मौसम प्राप्त करें',
      sendMessage: 'भेजें',
      typeMessage: 'अपना खेती से संबंधित प्रश्न टाइप करें...'
    }
  };

  const t = translations[language];

  const soilTypes = ['Alluvial', 'Red', 'Black', 'Laterite', 'Clayey', 'Sandy', 'Loamy'];
  const seasons = ['Kharif', 'Rabi', 'Zaid'];
  const crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Pulses', 'Soybean', 'Groundnut'];

  // Simulate ML prediction
  const predictCropYield = (e) => {
    e.preventDefault();
    
    const baseYield = Math.random() * 30 + 20;
    const irrigationBonus = cropForm.irrigation === 'Available' ? 5 : 0;
    const pesticideBonus = cropForm.pesticide === 'Available' ? 3 : 0;
    const insecticideBonus = cropForm.insecticide === 'Available' ? 2 : 0;
    
    const estimatedYield = (baseYield + irrigationBonus + pesticideBonus + insecticideBonus).toFixed(2);
    const totalProduction = (estimatedYield * parseFloat(cropForm.landArea)).toFixed(2);
    
    const soilHealthScore = 75 + Math.random() * 20;
    
    const nutrients = [
      { nutrient: 'Nitrogen (N)', level: Math.random() * 100, optimal: 80 },
      { nutrient: 'Phosphorus (P)', level: Math.random() * 100, optimal: 70 },
      { nutrient: 'Potassium (K)', level: Math.random() * 100, optimal: 75 },
      { nutrient: 'pH Level', level: 6 + Math.random() * 2, optimal: 6.5 }
    ];
    
    const recommendations = [
      'Apply organic compost to improve soil structure',
      'Consider crop rotation with legumes',
      'Monitor soil moisture regularly',
      'Use precision irrigation techniques'
    ];
    
    setPrediction({
      estimatedYield,
      totalProduction,
      soilHealthScore: soilHealthScore.toFixed(1),
      nutrients,
      recommendations,
      suggestedCrop: crops[Math.floor(Math.random() * crops.length)]
    });
  };

  // Fetch weather data
  const fetchWeather = async () => {
    if (!city) return;

    setWeatherLoading(true);

    try {
      const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
      const data = await response.json();

      if (data.cod !== 200) {
        alert(data.message);
        setWeather(null);
        setWeatherLoading(false);
        return;
      }

      setWeather({
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed),
        rainfall: data.rain ? data.rain['1h'] || 0 : 0,
        forecast: [
          { day: 'Mon', temp: Math.round(data.main.temp + 1), rain: 5 },
          { day: 'Tue', temp: Math.round(data.main.temp + 2), rain: 0 },
          { day: 'Wed', temp: Math.round(data.main.temp - 1), rain: 10 },
          { day: 'Thu', temp: Math.round(data.main.temp + 3), rain: 2 },
          { day: 'Fri', temp: Math.round(data.main.temp), rain: 0 },
        ]
      });
    } catch (error) {
      console.error(error);
      alert("Failed to fetch weather data");
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Handle chatbot messages
  const sendChatMessage = async () => {
    if (!userInput.trim()) return;

    const query = userInput;
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setUserInput('');

    try {
      const response = await fetch('http://localhost:8000/api/rag_query_stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';

      setMessages(prev => [...prev, { role: 'bot', text: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        botText += decoder.decode(value, { stream: true });

        setMessages(prev => {
          const updated = [...prev];
          let lastBotIdx = -1;
          for (let i = updated.length - 1; i >= 0; i--) {
            if (updated[i].role === 'bot') { lastBotIdx = i; break; }
          }

          if (lastBotIdx === -1) {
            updated.push({ role: 'bot', text: botText });
          } else {
            updated[lastBotIdx] = { ...updated[lastBotIdx], text: botText };
          }

          return updated;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error connecting to chatbot.' }]);
    }
  };

  // Analytics data
  const yieldTrendData = [
    { month: 'Jan', yield: 22 },
    { month: 'Feb', yield: 25 },
    { month: 'Mar', yield: 28 },
    { month: 'Apr', yield: 30 },
    { month: 'May', yield: 27 },
    { month: 'Jun', yield: 32 }
  ];

  const cropPerformanceData = [
    { crop: 'Rice', performance: 85 },
    { crop: 'Wheat', performance: 78 },
    { crop: 'Cotton', performance: 82 },
    { crop: 'Maize', performance: 75 }
  ];

  const soilRadarData = [
    { subject: 'N', A: 75, fullMark: 100 },
    { subject: 'P', A: 68, fullMark: 100 },
    { subject: 'K', A: 82, fullMark: 100 },
    { subject: 'pH', A: 70, fullMark: 100 },
    { subject: 'Organic', A: 65, fullMark: 100 }
  ];

  const HomePage = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className={`relative rounded-3xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-green-900 to-green-700' : 'bg-gradient-to-br from-green-600 to-emerald-500'} text-white p-12 md:p-20`}>
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {t.title}
          </h1>
          <p className="text-2xl md:text-3xl mb-4 opacity-90">
            {t.tagline}
          </p>
          <p className="text-lg md:text-xl mb-8 opacity-80">
            {language === 'hi' 
              ? 'कृत्रिम बुद्धिमत्ता और डेटा-संचालित अंतर्दृष्टि के साथ आधुनिक खेती को सशक्त बनाना। फसल की उपज की भविष्यवाणी करें, वास्तविक समय में मौसम अपडेट प्राप्त करें, और कृषि विशेषज्ञों से जुड़ें।'
              : 'Empowering modern agriculture with AI and data-driven insights. Predict crop yields, get real-time weather updates, and connect with agricultural experts.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setCurrentPage('predict')}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Sprout size={24} />
              {t.predictCropYield}
            </button>
            <button 
              onClick={() => setCurrentPage('weather')}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <Cloud size={24} />
              {t.weatherUpdates}
            </button>
            <button 
              onClick={() => setCurrentPage('chat')}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <MessageSquare size={24} />
              {t.communityChatbot}
            </button>
            <button
              onClick={() => setCurrentPage('forum')}
              className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              {language === 'hi' ? 'चर्चा मंच' : 'Forum'}
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 opacity-10">
          <Sprout size={400} />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-lg`}>
          <TrendingUp className="text-green-600 mb-4" size={48} />
          <h3 className="text-2xl font-bold mb-3">
            {language === 'hi' ? 'एआई-संचालित भविष्यवाणियां' : 'AI-Powered Predictions'}
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {language === 'hi' 
              ? 'मशीन लर्निंग मॉडल आपकी मिट्टी और मौसम की स्थिति के आधार पर सटीक फसल उपज का अनुमान लगाते हैं।'
              : 'Machine learning models predict accurate crop yields based on your soil and weather conditions.'}
          </p>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-lg`}>
          <Cloud className="text-blue-600 mb-4" size={48} />
          <h3 className="text-2xl font-bold mb-3">
            {language === 'hi' ? 'वास्तविक समय मौसम' : 'Real-Time Weather'}
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {language === 'hi'
              ? 'अपने क्षेत्र के लिए लाइव मौसम अपडेट और पूर्वानुमान प्राप्त करें, सिंचाई और फसल प्रबंधन की योजना बनाएं।'
              : 'Get live weather updates and forecasts for your region to plan irrigation and crop management.'}
          </p>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-lg`}>
          <Users className="text-purple-600 mb-4" size={48} />
          <h3 className="text-2xl font-bold mb-3">
            {language === 'hi' ? 'विशेषज्ञ समुदाय' : 'Expert Community'}
          </h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {language === 'hi'
              ? 'एआई चैटबॉट के माध्यम से या हमारे विशेषज्ञ समुदाय में शामिल होकर व्यक्तिगत कृषि सलाह प्राप्त करें।'
              : 'Get personalized farming advice through our AI chatbot or connect with our expert community.'}
          </p>
        </div>
      </div>

      {/* Success Stories */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-green-50'} p-8 rounded-2xl`}>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <CheckCircle className="text-green-600" />
          {language === 'hi' ? 'सफलता की कहानियां' : 'Success Stories'}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl`}>
            <p className="italic mb-4">
              {language === 'hi'
                ? '"AgriConnect ने मुझे अपनी उपज 35% बढ़ाने में मदद की। एआई सिफारिशें सटीक और लागू करने में आसान हैं।"'
                : '"AgriConnect helped me increase my yield by 35%. The AI recommendations are accurate and easy to implement."'}
            </p>
            <p className="font-semibold text-green-600">- {language === 'hi' ? 'राजेश कुमार, पंजाब' : 'Rajesh Kumar, Punjab'}</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} p-6 rounded-xl`}>
            <p className="italic mb-4">
              {language === 'hi'
                ? '"मौसम पूर्वानुमान सुविधा ने मुझे फसल के नुकसान से बचाया। मैं इसे प्रत्येक दिन उपयोग करता हूं!"'
                : '"The weather forecast feature saved my crops from damage. I use it every single day!"'}
            </p>
            <p className="font-semibold text-green-600">- {language === 'hi' ? 'प्रिया शर्मा, महाराष्ट्र' : 'Priya Sharma, Maharashtra'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const PredictPage = () => (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <Sprout className="text-green-600" />
        {t.predictCropYield}
      </h1>
      
      <form onSubmit={predictCropYield} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-lg mb-8`}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-2">{t.soilType}</label>
            <select 
              className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
              value={cropForm.soilType}
              onChange={(e) => setCropForm({...cropForm, soilType: e.target.value})}
              required
            >
              <option value="">Select Soil Type</option>
              {soilTypes.map(soil => <option key={soil} value={soil}>{soil}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">{t.landArea}</label>
            <input 
              type="number" 
              step="0.1"
              className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
              value={cropForm.landArea}
              onChange={(e) => setCropForm({...cropForm, landArea: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block font-semibold mb-2">{t.season}</label>
            <select 
              className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
              value={cropForm.season}
              onChange={(e) => setCropForm({...cropForm, season: e.target.value})}
              required
            >
              <option value="">Select Season</option>
              {seasons.map(season => <option key={season} value={season}>{season}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">{t.cropName}</label>
            <select 
              className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
              value={cropForm.cropName}
              onChange={(e) => setCropForm({...cropForm, cropName: e.target.value})}
              required
            >
              <option value="">Select Crop</option>
              {crops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">{t.irrigation}</label>
            <select 
              className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
              value={cropForm.irrigation}
              onChange={(e) => setCropForm({...cropForm, irrigation: e.target.value})}
              required
            >
              <option value="">Select</option>
              <option value="Available">{t.available}</option>
              <option value="Not Available">{t.notAvailable}</option>
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">{t.pesticide}</label>
            <select 
              className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
              value={cropForm.pesticide}
              onChange={(e) => setCropForm({...cropForm, pesticide: e.target.value})}
              required
            >
              <option value="">Select</option>
              <option value="Available">{t.available}</option>
              <option value="Not Available">{t.notAvailable}</option>
            </select>
          </div>
          
          <div>
            <label className="block font-semibold mb-2">{t.insecticide}</label>
            <select 
              className={`w-full p-3 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`}
              value={cropForm.insecticide}
              onChange={(e) => setCropForm({...cropForm, insecticide: e.target.value})}
              required
            >
              <option value="">Select</option>
              <option value="Available">{t.available}</option>
              <option value="Not Available">{t.notAvailable}</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit"
          className="mt-6 w-full bg-green-600 text-black px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105"
        >
          {t.submit}
        </button>
      </form>
      
      {prediction && (
        <div className="space-y-6">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-2xl shadow-lg`}>
            <h2 className="text-2xl font-bold mb-6 text-green-600">
              {language === 'hi' ? 'भविष्यवाणी परिणाम' : 'Prediction Results'}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} p-6 rounded-xl`}>
                <p className="text-sm opacity-70 mb-2">
                  {language === 'hi' ? 'अनुमानित उपज' : 'Expected Yield'}
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {prediction.estimatedYield} <span className="text-lg">q/ha</span>
                </p>
              </div>
              
              <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-6 rounded-xl`}>
                <p className="text-sm opacity-70 mb-2">
                  {language === 'hi' ? 'कुल उत्पादन' : 'Total Production'}
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {prediction.totalProduction} <span className="text-lg">quintals</span>
                </p>
              </div>
              
              <div className={`${darkMode ? 'bg-yellow-900' : 'bg-yellow-50'} p-6 rounded-xl`}>
                <p className="text-sm opacity-70 mb-2">
                  {language === 'hi' ? 'मिट्टी स्वास्थ्य स्कोर' : 'Soil Health Score'}
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {prediction.soilHealthScore}/100
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">
                {language === 'hi' ? 'पोषक तत्व विश्लेषण' : 'Nutrient Analysis'}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prediction.nutrients}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nutrient" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="level" fill="#10b981" name="Current Level" />
                  <Bar dataKey="optimal" fill="#3b82f6" name="Optimal Level" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className={`${darkMode ? 'bg-purple-900' : 'bg-purple-50'} p-6 rounded-xl mb-6`}>
              <h3 className="text-xl font-bold mb-3 text-purple-600">
                {language === 'hi' ? 'सुझाई गई सर्वोत्तम फसल' : 'Suggested Best Crop'}
              </h3>
              <p className="text-2xl font-semibold">{prediction.suggestedCrop}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">
                {language === 'hi' ? 'सिफारिशें' : 'Recommendations'}
              </h3>
              <ul className="space-y-3">
                {prediction.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const DashboardPage = () => (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <BarChart3 className="text-green-600" />
        Soil & Crop Analytics Dashboard
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Yield Trend Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yieldTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} name="Yield (q/ha)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Crop Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cropPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="performance" fill="#3b82f6" name="Performance Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Soil Nutrient Profile</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={soilRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Current Levels" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className={`${darkMode ? 'bg-green-900' : 'bg-green-50'} p-4 rounded-lg`}>
              <p className="font-semibold text-green-600 mb-2">✓ Optimal Growing Conditions</p>
              <p className="text-sm">Your soil and weather conditions are ideal for wheat and rice cultivation this season.</p>
            </div>
            <div className={`${darkMode ? 'bg-yellow-900' : 'bg-yellow-50'} p-4 rounded-lg`}>
              <p className="font-semibold text-yellow-600 mb-2">⚠ Nutrient Attention Required</p>
              <p className="text-sm">Phosphorus levels are slightly below optimal. Consider adding phosphate fertilizers.</p>
            </div>
            <div className={`${darkMode ? 'bg-blue-900' : 'bg-blue-50'} p-4 rounded-lg`}>
              <p className="font-semibold text-blue-600 mb-2">ℹ Weather Update</p>
              <p className="text-sm">Moderate rainfall expected in the next 5 days. Good time for irrigation planning.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
        <h3 className="text-xl font-bold mb-4">Recommended Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-600" />
              <span className="font-semibold">Soil Testing</span>
            </div>
            <p className="text-sm">Schedule next soil test in 2 months</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-600" />
              <span className="font-semibold">Irrigation</span>
            </div>
            <p className="text-sm">Increase water supply by 15% next week</p>
          </div>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-600" />
              <span className="font-semibold">Pest Control</span>
            </div>
            <p className="text-sm">Apply neem spray for preventive care</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 text-green-600' : 'bg-white'} shadow-md sticky top-0 z-50`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sprout className="text-green-600" size={36} />
              <h1 className="text-2xl font-bold">{t.title}</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`font-semibold hover:text-green-600 transition-colors ${currentPage === 'home' ? 'text-green-600' : ''}`}
              >
                {t.home}
              </button>
              <button 
                onClick={() => setCurrentPage('predict')}
                className={`font-semibold hover:text-green-600 transition-colors ${currentPage === 'predict' ? 'text-green-600' : ''}`}
              >
                {t.predict}
              </button>
              <button 
                onClick={() => setCurrentPage('weather')}
                className={`font-semibold hover:text-green-600 transition-colors ${currentPage === 'weather' ? 'text-green-600' : ''}`}
              >
                {t.weather}
              </button>
              <button 
                onClick={() => setCurrentPage('chat')}
                className={`font-semibold hover:text-green-600 transition-colors ${currentPage === 'chat' ? 'text-green-600' : ''}`}
              >
                {t.chat}
              </button>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`font-semibold hover:text-green-600 transition-colors ${currentPage === 'dashboard' ? 'text-green-600' : ''}`}
              >
                {t.dashboard}
              </button>
            </nav>
            
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-4 py-2 bg-green-600 text-black rounded-lg font-semibold hover:bg-green-700 transition-all"
              >
                {language === 'en' ? 'हिन्दी' : 'English'}
              </button>
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} hover:opacity-80 transition-all`}
              >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-3">
              <button 
                onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-semibold hover:text-green-600 transition-colors"
              >
                {t.home}
              </button>
              <button 
                onClick={() => { setCurrentPage('predict'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-semibold hover:text-green-600 transition-colors"
              >
                {t.predict}
              </button>
              <button 
                onClick={() => { setCurrentPage('weather'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-semibold hover:text-green-600 transition-colors"
              >
                {t.weather}
              </button>
              <button 
                onClick={() => { setCurrentPage('chat'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-semibold hover:text-green-600 transition-colors"
              >
                {t.chat}
              </button>
              <button 
                onClick={() => { setCurrentPage('dashboard'); setMobileMenuOpen(false); }}
                className="block w-full text-left font-semibold hover:text-green-600 transition-colors"
              >
                {t.dashboard}
              </button>
            </nav>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'predict' && <PredictPage />}
        {currentPage === 'weather' && (
          <WeatherPage 
            city={city} 
            setCity={setCity} 
            weather={weather} 
            fetchWeather={fetchWeather} 
            weatherLoading={weatherLoading} 
            t={t} 
            darkMode={darkMode} 
          />
        )}
        {currentPage === 'chat' && (
          <ChatPage 
            messages={messages}
            userInput={userInput}
            setUserInput={setUserInput}
            sendChatMessage={sendChatMessage}
            t={t}
            darkMode={darkMode}
          />
        )}
        {currentPage === 'forum' && <ForumPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
      </main>
      
      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-800'} text-white mt-16`}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sprout size={24} />
                AgriConnect
              </h3>
              <p className="text-gray-300">
                Empowering farmers with AI-driven insights and data-driven decision making.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-green-400">About Us</a></li>
                <li><a href="#" className="hover:text-green-400">Contact</a></li>
                <li><a href="#" className="hover:text-green-400">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-400">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-300">Email: support@agriconnect.com</p>
              <p className="text-gray-300">Phone: 1800-123-4567</p>
              <p className="text-gray-300 mt-4">© 2025 AgriConnect. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgriConnect;

