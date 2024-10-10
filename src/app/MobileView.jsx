"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCopy } from "react-icons/fa";
import CustomModal from "@/components/CustomModal"; // Import the custom modal component
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const MobileView = () => {
  const [telegramUser, setTelegramUser] = useState({});
  const [user, setUser] = useState(null);
  // const [user, setUser] = useState({
  //   id: 123456789,
  //   first_name: "John",
  //   last_name: "Doe",
  //   username: "xtreme",
  //   language_code: "en",
  //   photo_url: "https://t.me/i/userpic/320/johndoe.jpg",
  // });
  const [walletBalance, setWalletBalance] = useState(0); // State for wallet balance
  const [amount, setAmount] = useState(0); // State for the amount to send
  const [transactionHash, setTransactionHash] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("inactive");
  const [walletAddress, setWalletAddress] = useState("0x1234567890abcdef");
  const [information, setInformation] = useState("");
  const [loading, setLoading] = useState(true);
  

  const router = useRouter();

  const [withdrawalAddress, setWithdrawalAddress] = useState("");
  const [referralCode, setReferralCode] = useState(null);

  const search = useSearchParams();

  // useEffect(() => {
  //   if (referralCode && user.username) {
  //      checkIfRefUserExists(user, referralCode);
  //   }
  // }, [referralCode, user]);

  // Modal states
  const [openAmountModal, setOpenAmountModal] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [openWithdrawModal, setOpenWthdrawModal] = useState(false);
  const [isHaveWallet, setIsHaveWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");

  // Fetch user data and wallet balance
  useEffect(() => {

    setLoading(true)

    const loadTelegramScript = async () => {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true; // Load the script asynchronously
      script.onload = async () => {
        // Initialize Telegram Web App after script is loaded
        if (window.Telegram?.WebApp) {
          const user = window.Telegram.WebApp.initDataUnsafe?.user;
          setTelegramUser(user);
          const startParam = window.Telegram.WebApp.initDataUnsafe.start_param;
          if (startParam) {
            setReferralCode(startParam); // Set the referral code
            console.log("Referral Code:", startParam);
          }
          if (user) {
            if (startParam) {
              await checkIfRefUserExists(user, startParam);
            } else {
              await checkIfUserExists(user); // Check if the user exists before fetching the wallet balance
            }
          }

          window.Telegram.WebApp.ready();
        }
      };
      document.body.appendChild(script);
    };

     loadTelegramScript();

    setLoading(false)

    // Optional: Cleanup function to remove the script if the component unmounts
    return () => {
      const scripts = document.querySelectorAll(
        'script[src="https://telegram.org/js/telegram-web-app.js"]'
      );
      scripts.forEach((script) => script.remove());
    };
  }, []);
  // Check if user exists in the database
  const checkIfUserExists = async (user) => {
    try {
      const getUserResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getUser/${user?.username}`
      ); // Adjust the API endpoint as per your backend
      const data = await getUserResponse.json();
      setUser(data?.user);
      console.log("user data", data, process.env.NEXT_PUBLIC_API_BASE_URL);

      if (getUserResponse.ok) {
        // User exists, proceed with fetching wallet balance
        fetchWalletBalance(user);
      } else {
        // User does not exist, register the user
        registerUser(user);
      }
    } catch (error) {
      toast.error("Error checking user existence.");
      console.error("Error checking user existence:", error);
    }
  };

  const checkIfRefUserExists = async (user, ref) => {
    try {
      console.log("mine", user);

      const getUserResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getUser/${user?.username}`
      ); // Adjust the API endpoint as per your backend
      const data = await getUserResponse.json();
      console.log("user data", data, process.env.NEXT_PUBLIC_API_BASE_URL);

      if (getUserResponse.ok) {
        // User exists, proceed with fetching wallet balance
        fetchWalletBalance(user);
      } else {
        // User does not exist, register the user
        registerRefUser(user, ref);
      }
    } catch (error) {
      toast.error("Error checking user existence.");
      console.error("Error checking user existence:", error);
    }
  };

  // Register the user if they don't exist
  const registerUser = async (user) => {
    try {
      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user?.username,
          }),
        }
      );

      const data = await registerResponse.json();
      console.log("reg data", data);
      if (registerResponse.ok) {
        // After successful registration, fetch wallet balance
        toast.success("User registered successfully!");
        fetchWalletBalance(user);
      } else {
        toast.error(`Error registering user: ${data.message}`);
        console.error("Error registering user:", data.message);
      }
    } catch (error) {
      toast.error("Error during user registration.");
      console.error("Error during user registration:", error);
    }
  };

  const registerRefUser = async (user, ref) => {
    try {
      const registerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user?.username,
            referredBy: ref, // Pass any other required data from the Telegram user
          }),
        }
      );

      const data = await registerResponse.json();
      console.log("reg data", data);
      if (registerResponse.ok) {
        // After successful registration, fetch wallet balance
        toast.success("User registered successfully!");
        fetchWalletBalance(user);
      } else {
        toast.error(`Error registering user: ${data.message}`);
        console.error("Error registering user:", data.message);
      }
    } catch (error) {
      toast.error("Error during user registration.");
      console.error("Error during user registration:", error);
    }
  };

  // Fetch wallet balance function
  const fetchWalletBalance = async (user) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getUser/${user?.username}`
      ); // Example API to get wallet balance
      const data = await response.json();
      if (response.ok) {
        setWalletBalance(data?.user?.wallet?.balance); // Set the fetched balance
        setUser(data?.user);
        setTransactionStatus(data?.user?.wallet?.transaction_status);
        setIsHaveWallet(data?.user?.wallet?.walletName ? true : false);
        setWithdrawalAddress(data?.user?.wallet?.name);
        console.log("Wallet balance fetched successfully!");
        console.log("done setting user", data.user);
      } else {
        toast.error("Error fetching wallet balance." + JSON.stringify(data));
        console.error("Error fetching wallet balance:", data);
      }
    } catch (error) {
      toast.error("Error fetching wallet balance.");
      console.error("Error:", error);
    }
  };

  // Handlers for opening/closing modals
  const openAmountSheet = () => setOpenAmountModal(true);
  const closeAmountSheet = () => setOpenAmountModal(false);

  const openWalletSheet = () => setOpenWalletModal(true);
  const closeWalletSheet = () => setOpenWalletModal(false);

  const openWithdrawSheet = () => setOpenWthdrawModal(true);
  const closeWithdrawSheet = () => setOpenWthdrawModal(false);

  const handlePaymentOptionClick = (wallet) => {
    setSelectedWallet(wallet);
    if (wallet === "USDT") {
      setWalletAddress("TFqWo7vqddgJN8or2qKULdnXbC472d9Cg1");
      setInformation("This is a USDT TRC20 address");
    } else {
      setInformation("This is a BEP20 address");
      setWalletAddress("0xcE749E462a5e815Da1D0b80CE5E8d3c10f1D5Af5");
    }
    setOpenAmountModal(false);
    setOpenWalletModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.info("Wallet address copied to clipboard!");
  };

  // Handle transaction confirmation
  const handleTransactionConfirm = async () => {
    if (!transactionHash || amount <= 0) {
      toast.warning("Please enter a valid amount and transaction hash.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?._id,
            amount,
            transactionHash,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Transaction successful!");

        closeWalletSheet(); // Close the modal after success
        router.refresh();
      } else {
        toast.error(`Transaction failed: ${data.message}`);
      }
    } catch (error) {
      toast.error("Transaction error.");
      console.error("Transaction error:", error);
    }
  };
  const handleSetWallet = async () => {
    if (!withdrawalAddress || withdrawalAddress.length <= 8) {
      toast.warning("Please enter a valid address");
      return;
    }

    try {
      console.log("req wal", user?._id, withdrawalAddress);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/setWalletName`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?._id,
            walletName: withdrawalAddress,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Wallet add successful!");
        closeWithdrawSheet(); // Close the modal after success
      } else {
        toast.error(`Wallet add failed: ${data.error || data.message}`);
      }
    } catch (error) {
      toast.error("Wallet error.");
      console.error("wallet error:", error);
    }
  };

  return (
    <>
      <div
        className="flex flex-col items-center bg-cover justify-between h-screen bg-orange-800 text-white"
        style={{
          backgroundImage: "url(/assets/bg.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >

        { loading ? (
          <div className="flex items-center bg-cover justify-between h-screen">
          Loading...
          </div>
        ) : (
          <>



<div className="flex flex-col w-screen h-screen items-center bg-cover justify-between">

{/* Header with Logo */}
<div className="flex md:items-center flex-col w-full px-6">
<div className="mt-8 flex justify-center ">
<img
  src="/assets/coin.png"
  className="w-28 object-contain "
  alt=""
/>
</div>

{/* Wallet Balance */}
<div className="text-center flex flex-col items-start mt-4">
<p className="text-sm font-medium">Wallet Balance</p>
<h2 className="text-6xl font-bold my-2">{walletBalance}</h2>{" "}
{/* Display dynamic wallet balance */}
<button className="px-4 bg-[#ffe9252f] py-1 rounded-full text-sm font-light">
  {transactionStatus}
</button>
</div>
</div>

{/* Cardano Coin Image */}
<div className="mt-4">
<img
src="/assets/coin.png"
alt="Cardano Coin"
className="w-full object-contain px-4 h-64"
/>
</div>

{/* Bottom Navigation */}
<div
className="flex justify-center gap-2 mx-8 mb-8 w-fit px-6 bg-contain py-8 rounded-t-3xl"
style={{
backgroundImage: "url(/assets/bgd.png)",
backgroundPosition: "center",
backgroundSize: "contain",
backgroundRepeat: "no-repeat",
}}
>
<a href={`/mates/?userId=${user?._id}`}>
<div className="flex bg-[#00000033] hover:bg-[#4eb8ff33] cursor-pointer p-1 px-3 m-1 rounded-lg w-fit flex-col items-center">
  <img
    src="/assets/share.png"
    alt="Mates"
    className="w-6 h-6 object-contain"
  />
  <p className="text-sm font-light mt-1">Mates</p>
</div>
</a>

<a href={`/task/?username=${user?.username}`}>
<div className="flex bg-[#00000033] hover:bg-[#4eb8ff33] cursor-pointer p-1 px-3 m-1 rounded-lg w-fit flex-col items-center">
  <img
    src="/assets/task.png"
    alt="Task"
    className="w-6 h-6 object-contain"
  />
  <p className="text-sm font-light mt-1">Task</p>
</div>
</a>

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
{user?.referrals && user?.referrals.length > 9 ? (
<>
  <div
    onClick={openWithdrawSheet}
    className="flex bg-[#00000033] hover:bg-[#4eb8ff33] cursor-pointer p-1 px-3 m-1 rounded-lg w-fit flex-col items-center"
  >
    <img
      src="/assets/boost.png"
      alt="Boost"
      className="w-6 h-6 object-contain"
    />
    <p className="text-sm font-light mt-1">Withdraw</p>
  </div>
</>
) : (
<>
  <div
    onClick={openWithdrawSheet}
    className="flex opacity-50 bg-[#00000033] p-1 px-3 m-1 rounded-lg w-fit flex-col items-center"
  >
    <img
      src="/assets/boost.png"
      alt="Boost"
      className="w-6 h-6 object-contain"
    />
    <p className="text-sm font-light mt-1">Withdraw</p>
  </div>
</>
)}
</div>

{/* Amount Modal */}
<CustomModal
isOpen={openAmountModal}
onClose={closeAmountSheet}
title="Enter Amount"
>
<h3 className="text-xs flex items-center justify-center font-semibold text-red-300">
You can stake a minimum of $10
</h3>
<input
type="number"
placeholder="Enter amount"
className="w-full mt-4 p-3 text-2xl bg-gray-100 rounded-lg shadow-md text-black"
value={amount}
onChange={(e) => setAmount(e.target.value)} // Set the entered amount
/>
<div className="mt-6">
<h3 className="text-xl font-semibold text-black">
  Select Payment Option:
</h3>
<div className="flex justify-around mt-4">
  <button
    onClick={() => handlePaymentOptionClick("USDT")}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    USDT Wallet
  </button>
  <button
    onClick={() => handlePaymentOptionClick("Crypto")}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
  >
    BEP20 Wallet
  </button>
</div>
</div>
</CustomModal>


{/* Wallet Modal */}
<CustomModal
isOpen={openWalletModal}
onClose={closeWalletSheet}
title="Confirm Payment"
>
<p className="text-black  my-4 text-xs   "> {information}</p>
<p className="text-black bg-orange-200 px-4 py-2 rounded-xl border border-slate-200 flex w-full my-4 text-xs   text-wrap whitespace-normal">
{" "}
{walletAddress}
</p>
<button
onClick={handleCopy}
className="px-3.5 py-1.5 bg-orange-800 text-white rounded-lg hover:bg-green-600"
>
Copy Address
</button>
<input
type="text"
placeholder="Transaction Hash"
className="w-full mt-4 p-3 text-lg bg-gray-100 rounded-lg shadow-md text-black"
value={transactionHash}
onChange={(e) => setTransactionHash(e.target.value)} // Set transaction hash
/>
<button
onClick={handleTransactionConfirm}
className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
>
Confirm Transaction
</button>
</CustomModal>

{/* Withdraw modal */}
<CustomModal
isOpen={openWithdrawModal}
onClose={closeWithdrawSheet}
title="Confirm Payment"
>
<div className="text-black">
{isHaveWallet ? (
  <>
    <p>we have your USDT Wallet Address:</p>
    <p className="px-4 py-2 bg-blue-100 rounded-xl border-slate-200 border">
      {" "}
      {withdrawalAddress}
    </p>
  </>
) : (
  <>
    <p>Enter your USDT Wallet Address:</p>

    <input
      type="text"
      placeholder="Wallet address"
      className="w-full mt-4 p-3 text-lg bg-gray-100 rounded-lg shadow-md text-black"
      value={withdrawalAddress}
      onChange={(e) => setWithdrawalAddress(e.target.value)} // Set transaction hash
    />
    <button
      onClick={handleSetWallet}
      className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Submit
    </button>
  </>
)}
</div>
</CustomModal>


</div>


           </>
        )

        }

            </div>
    </>
  );
};

const MobileWithSuspense = () => (
  <React.Suspense fallback={<div className="text-white">Loading...</div>}>
    <MobileView />
  </React.Suspense>
);

export default MobileWithSuspense;
