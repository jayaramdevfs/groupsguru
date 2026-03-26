"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import { AccessCheckResponse, ParentOption } from "@/lib/access";
import { paymentApi } from "@/lib/payment";
import { motion } from "framer-motion";
import { Multilang } from "./Multilang";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessInfo: AccessCheckResponse | null;
  entityType: string;
  entityId: number;
  entityName: string;
  onSuccess: () => void;
}

export default function PaywallModal({
  isOpen,
  onClose,
  accessInfo,
  entityType,
  entityId,
  entityName,
  onSuccess,
}: PaywallModalProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (type: string, id: number, name: string, price: number) => {
    setLoading(true);
    try {
      const orderId = await paymentApi.createOrder(type, id);

      const options = {
        key: "rzp_test_SU3wy02Xv8CfbL", // Test Key
        amount: price * 100,
        currency: "INR",
        name: "GroupsGuru",
        description: `Purchase access to ${name}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await paymentApi.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            onSuccess();
            onClose();
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#D97706",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!accessInfo) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<Multilang en="Locked Content" te="లాక్ చేయబడిన కంటెంట్" />}
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#D97706]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#3A3A3A]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <p className="text-[#A0A0A0] text-lg">
            <Multilang
              en={`You need a premium subscription to access ${entityName}.`}
              te={`${entityName}ని యాక్సెస్ చేయడానికి మీకు ప్రీమియం సభ్యత్వం అవసరం.`}
            />
          </p>
        </div>

        {/* Primary Option */}
        <button
          onClick={() => handlePayment(entityType, entityId, entityName, accessInfo.price || 0)}
          disabled={loading}
          className="w-full p-6 rounded-lg bg-[#D97706] hover:bg-[#F59E0B] transition-colors border border-[#3A3A3A] group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-left">
            <div>
              <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Standard Access</div>
              <div className="text-xl font-bold text-white tracking-tight">{entityName}</div>
            </div>
            <div className="text-2xl font-mono font-bold text-white">₹{accessInfo.price}</div>
          </div>
        </button>

        {/* Bundle Options */}
        {accessInfo.parentOptions && accessInfo.parentOptions.length > 0 && (
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-[#666666] uppercase tracking-[0.2em] pl-1">
              RECOMMENDED BUNDLES
            </div>
            {accessInfo.parentOptions.map((parent: ParentOption) => (
              <button
                key={`${parent.entityType}-${parent.entityId}`}
                onClick={() => handlePayment(parent.entityType, parent.entityId, parent.name, parent.price)}
                disabled={loading}
                className="w-full p-4 rounded-lg bg-[#141414] border border-[#3A3A3A] hover:bg-[#363636] transition-colors flex items-center justify-between group"
              >
                <div className="text-left">
                  <div className="text-[10px] text-[#666666] font-mono uppercase tracking-wider">
                    {parent.entityType.replace("_", " ")} Level
                  </div>
                  <div className="font-bold text-[#E8E8E8]">{parent.name}</div>
                </div>
                <div className="text-lg font-mono font-bold text-[#D97706]">₹{parent.price}</div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 text-[#FAFAF9]/40 hover:text-[#FAFAF9]/60 transition-colors text-sm"
        >
          Cancel and return
        </button>
      </div>
    </Modal>
  );
}
