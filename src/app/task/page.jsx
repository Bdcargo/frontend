"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaShareAlt, FaCoins, FaUserFriends } from "react-icons/fa";

// Share link using phone's default sharing options
const shareReferralLink = async (username) => {
  const referralLink = `${window.location.origin}?ref=${username}`;
  
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

const TasksPage = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [referredPeopleCount, setReferredPeopleCount] = useState(0);
  const [username, setUsername] = useState("user123"); // Fetch the current username from auth context or API

  const router = useRouter();

  // Fetch user data such as wallet balance and referred people count
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate fetching wallet balance and referral count
        const userData = await fetch("/api/user-data"); // Replace with your actual API
        const data = await userData.json();

        setWalletBalance(data.walletBalance); // Example: fetched wallet balance
        setReferredPeopleCount(data.referredPeopleCount); // Example: number of referred people
        setUsername(data.username); // Set the username from fetched data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Task definitions with dynamic values based on state
  const tasks = [
    {
      title: "Share link",
      status: "",
      icon: <FaShareAlt />,
      action: () => shareReferralLink(username), // Action for sharing
    },
    {
      title: "Commit a stake",
      status: walletBalance === 0 ? "Uncompleted" : "Completed",
      icon: <FaCoins />,
    },
    {
      title: "Refer people (min 6)",
      status: `${referredPeopleCount}`, // Number of referred people
      icon: <FaUserFriends />,
    },
  ];

  return (
    <div
      className="flex flex-col items-center justify-start h-screen bg-cover pt-12"
      style={{
        backgroundImage: "url('/assets/bg.png')", // Replace with your correct asset path
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Back Button */}
      <div onClick={() => router.back()} className="absolute top-8 left-4">
        <button className="flex items-center p-2 pl-4 pr-6 rounded-full bg-[#ffffff20] backdrop-blur-lg shadow-lg text-white">
          <FaArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Back</span>
        </button>
      </div>

      {/* Tasks */}
      <div className="my-auto w-full flex flex-col items-center">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex justify-between items-center w-4/5 max-w-md p-4 mb-4 rounded-full bg-[#ffffff20] backdrop-blur-lg shadow-lg text-white mt-4 cursor-pointer"
            onClick={task.action} // Handle action if present
          >
            {/* Task Icon */}
            <div className="flex items-center">
              <span className="mr-3">{task.icon}</span>
              <p className="font-medium text-lg">{task.title}</p>
            </div>
            <p className="text-sm">{task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasksPage;
