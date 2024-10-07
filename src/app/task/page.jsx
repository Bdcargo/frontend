"use client"
import React from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaShareAlt, FaCoins, FaUserFriends } from "react-icons/fa";

const TasksPage = () => {
  const tasks = [
    { title: "Share link", status: "Uncompleted", icon: <FaShareAlt /> },
    { title: "Commit a stake", status: "Uncompleted", icon: <FaCoins /> },
    { title: "Refer 6 people", status: "2/6", icon: <FaUserFriends /> },
  ];

  const router = useRouter()



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
      <div onClick={()=> router.back()} className="absolute top-8 left-4">
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
          className="flex justify-between items-center w-4/5 max-w-md p-4 mb-4 rounded-full bg-[#ffffff20] backdrop-blur-lg shadow-lg text-white mt-4"
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
