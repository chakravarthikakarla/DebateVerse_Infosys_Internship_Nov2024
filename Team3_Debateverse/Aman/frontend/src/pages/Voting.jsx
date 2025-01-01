import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { likeRequest, setLiked } from "../redux/slices/allDebatesSlice";
import { BiSolidUpvote } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { setVotes } from "../redux/slices/votingSlice";
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const Voting = () => {
  const { debate, liked, Qno, votes, isVoted, isLoading } = useSelector(
    (states) => states.voting
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVote = (index, val) => {
    if (val == "") return;
    let totalVotesCasted = votes.reduce((acc, curr) => acc + curr, 0);
    if (totalVotesCasted >= 10 && val === 1)
      return toast.error("10 votes already distributed !");
    if (votes[index] === 0 && val === -1) return;
    dispatch(setVotes({ index, val }));
  };

  const handleLike = (_id, index) => {
    dispatch(likeRequest(_id));
    liked
      ? dispatch(setLiked({ index, val: -1 }))
      : dispatch(setLiked({ index, val: 1 }));
  };

  const handleSubmission = async () => {
    console.log(votes.length);
    let totalVotesCasted = votes.reduce((acc, curr) => acc + curr, 0);
    if (totalVotesCasted < 10) return toast.error("Please cast all 10 votes !");
    try {
      const res = await axios.post(
        "http://localhost:3000/api/debates/voterequest",
        { debateId: debate._id, votes: votes },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(res);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err);
    }
  };
  return (
    <div className="pt-16 lg:p-48 p-5 flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-500">
      {!isLoading && (
        <div className=" w-full">
          <button
            onClick={() => navigate("/userdebates")}
            className="bg-blue-500 px-6 py-2 rounded-lg mb-4"
          >
            Go Back
          </button>
          <div className={`bg-indigo-600 rounded-lg p-5 w-full text-white `}>
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">
                Asked by{" "}
                <span className="text-red-400">{debate.createdBy}</span> on{" "}
                <span className="text-green-400">
                  {format(new Date(debate.createdOn), "dd-MM-yyyy,  hh:mm a")}
                </span>
              </h1>
              <button
                onClick={() => {
                  handleLike(debate._id, Qno - 1);
                }}
                className={`flex gap-3 justify-center ${
                  liked ? "text-red-500" : ""
                } font-bold items-center`}
              >
                <Heart fill={liked ? "red" : "white"} />
                {debate.totalLikes}
              </button>
            </div>

            <div>
              <h1 className="font-extrabold text-xl py-2">
                {Qno}. {debate.question}
              </h1>
            </div>

            <div className="flex gap-5 flex-col justify-start md:items-center">
              <div className="options w-full">
                {debate.options.map((option, ind) => {
                  return (
                    <div
                      key={ind}
                      className="option w-full font-bold flex justify-between py-1 items-center gap-2"
                    >
                      <div className="w-full bg-blue-400 rounded-lg px-2 flex gap-3 flex-wrap justify-between items-center">
                        <h1 key={ind}>{`${ind + 1}. ${option.answer}`}</h1>
                        <button
                          className={`flex gap-2 justify-center font-bold items-center`}
                        >
                          <BiSolidUpvote size={28} fill="white" />
                          {option.votes}
                        </button>
                      </div>
                      <div className="flex justify-center items-center gap-1 md:ml-10">
                        <button
                          disabled={isVoted}
                          onClick={() => handleVote(ind, -1)}
                          className="p-2 rounded-full bg-violet-500"
                        >
                          <FaMinus size={16} />
                        </button>
                        <h1 className="px-5 py-1 bg-blue-600 rounded-xl">
                          {votes[ind]}
                        </h1>
                        {/* <input type="number" value={vote[ind]} onChange={(e)=>handleVote(ind, e.target.value)} min="0" max="10" className="p-1 text-center rounded-lg text-black" /> */}
                        <button
                          onClick={() => handleVote(ind, 1)}
                          className="p-2 rounded-full bg-violet-500"
                        >
                          <FaPlus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="graph w-full flex justify-between items-center">
                <ResponsiveContainer width="80%" height="50%" aspect={5}>
                  <BarChart data={debate.options}>
                    <XAxis
                      dataKey=""
                      stroke="#000"
                      tickFormatter={(value, index) => index + 1}
                    />
                    <YAxis stroke="#000" />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
                <button
                  disabled={isVoted}
                  onClick={handleSubmission}
                  className={`p-8 ${
                    isVoted ? "bg-emerald-200" : "bg-emerald-500"
                  } rounded-lg font-bold text-2xl`}
                >
                  {isVoted ? "Voted" : "Vote"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Voting;
