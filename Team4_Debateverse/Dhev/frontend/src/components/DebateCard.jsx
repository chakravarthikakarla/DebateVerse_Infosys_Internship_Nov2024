
import VoteGraph from './VoteGraph';

const DebateCard = ({ debate }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex gap-6">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="w-12 h-12">
            <div className="w-full h-3 bg-orange-300 mb-1 rounded"></div>
            <div className="w-full h-3 bg-orange-300 mb-1 rounded"></div>
            <div className="w-3/4 h-3 bg-orange-300 rounded"></div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text mb-1 font-comic">
                Asked on {new Date(debate.createdAt).toLocaleDateString()}
              </p>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text font-comic">
                {debate.title}
              </h2>
            </div>
            <div className="flex items-center text-red-500 gap-1 font-comic">
              <span>{debate.likes} Likes</span>
              <span>❤️</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {debate.options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-3 font-comic">
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text min-w-[20px]">{index + 1})</span>
                <span className="flex-1 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">{option.text}</span>
                <div className="flex items-center gap-4 min-w-[120px]">
                  <span className="text-blue-600">👍 {option.votes}</span>
                  <span className="text-red-500">👎 {option.userVotes}</span>
                </div>
              </div>
            ))}
          </div>

          <VoteGraph options={debate.options} />
        </div>
      </div>
    </div>
  );
};

export default DebateCard;