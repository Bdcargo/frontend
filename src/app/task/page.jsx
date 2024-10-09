"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaShareAlt, FaCoins, FaUserFriends } from "react-icons/fa";


const TasksPage = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [referredPeopleCount, setReferredPeopleCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const search = useSearchParams();
  const username = search.get("username");

  const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getUser/${username}`; // Define your API URL

  
// Share link using phone's default sharing options
const shareReferralLink = async (username) => {
  const referralLink = `https://t.me/BabyZuma_Bot/BZUMA/?startapp=${username}`;
  
  try {
    if (navigator.share) {
      // Use native share functionality if available
      await navigator.share({
        title: "Share Your Referral Link",
        text: `Join using my referral link!`,
        url: referralLink,
      });
    } else {
      // Fallback for older browsers
      alert(`Copy this referral link: ${referralLink}`);
    }
  } catch (error) {
    console.error("Error sharing:", error);
  }
};


  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setWalletBalance(data?.user?.wallet.balance);
        setReferredPeopleCount(data?.user?.referrals);
        console.log("ref count", data?.user?.referrals);
      } catch (error) {
        setError("Failed to load user data");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const tasks = [
    {
      title: "Share link",
      status: "",
      icon: <FaShareAlt />,
      action: () => shareReferralLink(username),
    },
    {
      title: "Commit a stake",
      status: walletBalance === 0 ? "Uncompleted" : "Completed",
      icon: <FaCoins />,
      action: () => {
        if (walletBalance === 0) {
          // Navigate to stake page or show a message
        }
      },
    },
    {
      title: "Refer people (min 10)",
      status: `${referredPeopleCount.length}`,
      icon: <FaUserFriends />,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-cover pt-12" style={{ backgroundImage: "url('/assets/bg.png')" }}>
      <div onClick={() => router.back()} className="absolute top-8 left-4">
        <button className="flex items-center p-2 pl-4 pr-6 rounded-full bg-[#ffffff20] backdrop-blur-lg shadow-lg text-white">
          <FaArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="my-auto w-full flex flex-col items-center">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-4/5 max-w-md p-4 mb-4 rounded-full bg-[#ffffff20] backdrop-blur-lg shadow-lg text-white mt-4 cursor-pointer"
              onClick={task.action}
            >
              <div className="flex items-center">
                <span className="mr-3">{task.icon}</span>
                <p className="font-medium text-lg">{task.title}</p>
              </div>
              <p className="text-sm">{task.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Wrapping the MatesPage component in a Suspense boundary
const TaskPageWithSuspense = () => (
  <React.Suspense fallback={<div className="text-white">Loading...</div>}>
    <TasksPage />
  </React.Suspense>
);

export default TaskPageWithSuspense;