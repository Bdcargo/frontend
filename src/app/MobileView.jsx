"use client";
import React, { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import CustomModal from "@/components/CustomModal"; // Import the custom modal component

const MobileView = () => {
  const [telegramUser, setTelegramUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0); // State for wallet balance
  const [amount, setAmount] = useState(0); // State for the amount to send
  const [transactionHash, setTransactionHash] = useState("");
  const [walletAddress, setWalletAddress] = useState("0x1234567890abcdef");


  // Modal states
  const [openAmountModal, setOpenAmountModal] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");

  

  // Fetch user data and wallet balance
  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      setTelegramUser(user);

      if (user) {
        fetchWalletBalance(user.id); // Fetch wallet balance using user's ID
      }

      window.Telegram.WebApp.ready();
    }
  }, []);

  // Fetch wallet balance function
  const fetchWalletBalance = async (userId) => {
    try {
      const response = await fetch(`/api/wallet/${userId}`); // Example API to get wallet balance
      const data = await response.json();
      if (response.ok) {
        setWalletBalance(data.balance); // Set the fetched balance
      } else {
        console.error("Error fetching wallet balance:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handlers for opening/closing modals
  const openAmountSheet = () => setOpenAmountModal(true);
  const closeAmountSheet = () => setOpenAmountModal(false);

  const openWalletSheet = () => setOpenWalletModal(true);
  const closeWalletSheet = () => setOpenWalletModal(false);

  const handlePaymentOptionClick = (wallet) => {
    setSelectedWallet(wallet);
    setOpenAmountModal(false);
    setOpenWalletModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Copied to clipboard");
  };

  // Handle transaction confirmation
  const handleTransactionConfirm = async () => {
    if (!transactionHash || amount <= 0) {
      alert("Please enter a valid amount and transaction hash");
      return;
    }

    try {
      const response = await fetch("/api/wallet/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: telegramUser.id,
          amount,
          transactionHash,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Transaction successful!");
        setWalletBalance((prevBalance) => prevBalance - amount); // Update wallet balance after successful transaction
        closeWalletSheet(); // Close the modal after success
      } else {
        alert(`Transaction failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };

  return (
    <div
      className="flex flex-col items-center bg-cover justify-between h-screen bg-blue-800 text-white"
      style={{
        backgroundImage: "url(" + "/assets/bg.png" + ")",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header with Logo */}
      <div className="flex md:items-center flex-col w-full px-6">
        <div className="mt-12 ">
          <h1 className="text-xl font-extrabold">Texo Coin</h1>
        </div>

        {/* Wallet Balance */}
        <div className="text-center flex flex-col items-start mt-8">
          <p className="text-sm font-medium">Wallet Balance</p>
          <h2 className="text-6xl font-bold my-2">{walletBalance}</h2> {/* Display dynamic wallet balance */}
          <button className="px-4 bg-[#2583ff80] py-1 rounded-full text-sm font-light">
            Stats
          </button>
        </div>
      </div>

    
    
      {/* Cardano Coin Image */}
      <div className="mt-4">
        <img
          src="/assets/cointeko.jpg"
          alt="Cardano Coin"
          className="w-64 h-64 mix-blend-lighten	"
        />
      </div>

      {/* Bottom Navigation */}
      <div
        className="flex justify-center gap-2 mx-8 mb-8 w-fit px-6 bg-contain py-8 rounded-t-3xl"
        style={{
          backgroundImage: "url(" + "/assets/bgd.png" + ")",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex bg-[#00000033] hover:bg-[#4eb8ff33] cursor-pointer p-1 px-3 m-1 rounded-lg w-fit flex-col items-center">
          <img
            src="/assets/share.png"
            alt="Mates"
            className="w-6 h-6 object-contain"
          />
          <p className="text-sm font-light mt-1">Mates</p>
        </div>
        <div className="flex bg-[#00000033] hover:bg-[#4eb8ff33] cursor-pointer p-1 px-3 m-1 rounded-lg w-fit flex-col items-center">
          <img
            src="/assets/task.png"
            alt="Task"
            className="w-6 h-6 object-contain"
          />
          <a href="/task">
            <p className="text-sm font-light mt-1">Task</p>
          </a>
        </div>
        <div
          onClick={openAmountSheet}
          className="flex bg-[#00000033] hover:bg-[#4eb8ff33] cursor-pointer p-1 px-3 m-1 rounded-lg w-fit flex-col items-center"
        >
          <img
            src="/assets/money.png"
            alt="Staking"
            className="w-6 h-6 object-contain"
          />
          <p className="text-sm font-light mt-1">Staking</p>
        </div>
        <div className="flex opacity-50 bg-[#00000033] p-1 px-3 m-1 rounded-lg w-fit flex-col items-center">
          <img
            src="/assets/boost.png"
            alt="Boost"
            className="w-6 h-6 object-contain"
          />
          <p className="text-sm font-light mt-1">Boost</p>
        </div>
      </div>


      {/* Amount Modal */}
      <CustomModal isOpen={openAmountModal} onClose={closeAmountSheet} title="Enter Amount">
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full mt-4 p-3 text-2xl bg-gray-100 rounded-lg shadow-md text-black"
          value={amount}
          onChange={(e) => setAmount(e.target.value)} // Set the entered amount
        />
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-black">Select Payment Option:</h3>
          <div className="flex justify-around mt-4">
            <button
              onClick={() => handlePaymentOptionClick("USDT")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              USDT Wallet
            </button>
            <button
              onClick={() => handlePaymentOptionClick("BNB")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              BNB Wallet
            </button>
          </div>
        </div>
      </CustomModal>

      {/* Wallet Modal */}
      <CustomModal isOpen={openWalletModal} onClose={closeWalletSheet} title={`${selectedWallet} Wallet Information`}>
        <div className="flex items-center justify-between mt-6 p-4 border border-white rounded-xl bg-gray-50">
          <p className="text-lg text-black">{walletAddress}</p>
          <button onClick={handleCopy}>
            <FaCopy className="text-gray-500" />
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-black">Enter Transaction Hash:</h3>
          <input
            type="text"
            placeholder="Transaction Hash"
            className="w-full mt-2 p-3 bg-gray-100 rounded-lg shadow-md text-black"
            value={transactionHash}
            onChange={(e) => setTransactionHash(e.target.value)} // Set the entered transaction hash
          />
        </div>

        <button
          onClick={handleTransactionConfirm} // Confirm transaction on click
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Confirm Payment
        </button>
      </CustomModal>
    </div>
  );
};

export default MobileView;
