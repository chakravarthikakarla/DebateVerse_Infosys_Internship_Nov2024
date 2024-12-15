
import { useNavigate, Link } from 'react-router-dom';
import { Search, Calendar } from 'lucide-react';
import VoteGraph from '../components/VoteGraph';
import { useEffect, useState } from "react";
const Debates = () => {
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


  
  const [searchTerm, setSearchTerm] = useState('');
  const [exactMatch, setExactMatch] = useState(false);
  const [minLikes, setMinLikes] = useState(0);
  const [minVotes, setMinVotes] = useState(0);
  const [dateAfter, setDateAfter] = useState('');

  const filteredDebates = debates.filter(debate => {
    const matchesSearch = exactMatch 
      ? debate.title.toLowerCase() === searchTerm.toLowerCase()
      : debate.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLikes = debate.likes >= minLikes;
    const matchesVotes = debate.options.some(opt => opt.votes >= minVotes);
    const matchesDate = !dateAfter || new Date(debate.createdAt) >= new Date(dateAfter);
    return matchesSearch && matchesLikes && matchesVotes && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-690 bg-opacity-75 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hiddenp-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"
          >
            Back to Dashboard
          </button>
          <div className="relative flex-1 max-w-xl mx-8">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search debates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-orange-300 rounded-lg font-comic"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1 bg-white rounded-lg shadow-lg p-6 h-[50vh]">
            <div className="space-y-6 font-comic">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exactMatch}
                    onChange={(e) => setExactMatch(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span>Exact Match</span>
                </label>
              </div>

              <div>
                <label className="block mb-2">Likes greater than</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={minLikes}
                  onChange={(e) => setMinLikes(Number(e.target.value))}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>0</span>
                  <span>{minLikes}</span>
                  <span>10k+</span>
                </div>
              </div>

              <div>
                <label className="block mb-2">Votes greater than</label>
                <input
                  type="range"
                  min="0"
                  max="25000"
                  value={minVotes}
                  onChange={(e) => setMinVotes(Number(e.target.value))}
                  className="w-full h-2 bg-orange-200 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-xs mt-1">
                  <span>0</span>
                  <span>{minVotes}</span>
                  <span>25k+</span>
                </div>
              </div>

              <div>
                <label className="block mb-2">Posted After</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={dateAfter}
                    onChange={(e) => setDateAfter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 space-y-4">
            {filteredDebates.map((debate) => (
              <div 
                key={debate.id}
                onClick={() => navigate(`/debates/${debate.id}`)}
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text font-comic">
                      {debate.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 font-comic">
                      Posted by{' '}
                      <Link
                        to={`/user/${debate.createdBy}`}
                        className="text-blue-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {debate.createdBy}
                      </Link>
                      {' '}on {new Date(debate.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-red-500 font-comic">
                    <span>❤️ {debate.likes}</span>
                  </div>
                </div>

                <VoteGraph options={debate.options} compact={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debates;