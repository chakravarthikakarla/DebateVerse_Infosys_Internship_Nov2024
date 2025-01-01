
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import DebateCard from '../components/DebateCard';
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
const AdminDashboard = () => {
	const { user } = useAuthStore();
  const navigate = useNavigate();
  const [debates, setDebates] = useState([]);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/debates");
        const data = await response.json();
        setDebates(data);
      } catch (error) {
        console.error("Error fetching debates: ", error);
      }
    };
    fetchDebates();
  }, []);

 
  
  return (
    <div className="min-h-screen bg-gray-690 bg-opacity-75 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          All Debates ({debates.length})
          </h1>
          
		  
        </div>

        <div className="space-y-6">
          {debates.map((debate) => (
            <DebateCard key={debate.id} debate={debate} />
          ))}
        </div>

        {debates.length > 5 && (
          <div className="text-center mt-6">
            <button className="text-blue-600 hover:text-blue-700 font-comic">
              See All
            </button>
          </div>
        )}
      </div>
      
      <div className="text-center text-gray-500 text-sm mt-12 font-comic">
        DebateHub. All rights reserved. 2024
      </div>
    </div>
  );
};

export default AdminDashboard;