import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const WalletDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  // Fetch wallet balance
  const fetchBalance = async () => {
    try {
      const response = await axios.get("https://51.21.129.112/api/wallet", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the header
        },
      });
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  // Recharge wallet
  const rechargeWallet = async () => {
    if (!rechargeAmount) {
      toast("Please enter an amount.");
      return;
    }
    try {
      const response = await axios.post(
        "https://51.21.129.112/api/wallet/top-up",
        { amount: parseInt(rechargeAmount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast(response.data.message);
      fetchBalance();
      navigate("/dashboard");
    } catch (error) {
      console.error("Error recharging wallet:", error);
      toast("Recharge failed.");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div>
      <h1>Wallet Dashboard</h1>
      <p>Current Balance: ₹{balance}</p>
      <div>
        <input
          type="number"
          placeholder="Enter amount"
          value={rechargeAmount}
          onChange={(e) => setRechargeAmount(e.target.value)}
        />
        <button onClick={rechargeWallet}>Recharge Wallet</button>
      </div>
    </div>
  );
};

export default WalletDashboard;
