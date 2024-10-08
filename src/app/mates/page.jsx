"use client"; // Ensure this is a client component

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaUserFriends } from "react-icons/fa";

const MatesPage = () => {
  const search = useSearchParams();
  const userId = search.get("userId"); // Get the userId from search params
  const [referrals, setReferrals] = useState([]); // State to hold the referrals
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const router = useRouter();

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!userId) return; // Check if userId is available
      setLoading(true)

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/referrals/${userId}`
        ); // Adjust the API endpoint as per your backend
        const data = await response.json();

        if (response.ok) {
          setReferrals(data?.referrals); // Set the referrals data
          console.log("ref data here", data)
        } else {
          console.error("Error fetching referrals:", data.message);
          setError("Failed to load referrals.");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load referrals.");
      } finally {
        setLoading(false); // Stop loading after the fetch is done
      }
    };

    fetchReferrals();
  }, [userId]); // Dependency array includes userId

  return (
    <div
      className="flex flex-col items-center justify-start h-screen bg-cover pt-12"
      style={{ backgroundImage: "url('/assets/bg.png')" }}
    >
      <div onClick={() => router.back()} className="absolute top-8 left-4">
        <button className="flex items-center p-2 pl-4 pr-6 rounded-full bg-[#ffffff20] backdrop-blur-lg shadow-lg text-white">
          <FaArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Back</span>
        </button>
      </div>

    

      {loading ? (
        <p className="text-white">Loading referrals...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="my-auto w-full flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Your Mates</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
            {referrals &&  referrals.length > 0 ? (
              referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="flex flex-col items-center justify-center p-6 rounded-lg bg-[#ffffff20] backdrop-blur-lg shadow-lg text-white transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                 
                  <h2 className="text-xl font-semibold mb-1">
                    {referral.user.username}
                  </h2>
                  <p className={`w-full flex items-end justify-end text-md ${referral.status === "inactive" ? "text-red-300 " : "text-white"}`}>{referral.status}</p>                 
                </div>
              ))
            ) : (
              <div className="text-center text-gray-100">No referrals found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatesPage;
