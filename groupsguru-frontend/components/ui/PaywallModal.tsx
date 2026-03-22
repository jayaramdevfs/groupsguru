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
          color: "#9333ea",
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
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <p className="text-white/70 text-lg">
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
          className="w-full p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all border border-white/10 shadow-lg group relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-left">
            <div>
              <div className="text-sm text-white/60 font-medium">Standard Access</div>
              <div className="text-xl font-bold">{entityName}</div>
            </div>
            <div className="text-2xl font-black italic">₹{accessInfo.price}</div>
          </div>
        </button>

        {/* Bundle Options */}
        {accessInfo.parentOptions && accessInfo.parentOptions.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm font-bold text-white/40 uppercase tracking-widest pl-1">
              Recommended Bundles
            </div>
            {accessInfo.parentOptions.map((parent: ParentOption) => (
              <button
                key={`${parent.entityType}-${parent.entityId}`}
                onClick={() => handlePayment(parent.entityType, parent.entityId, parent.name, parent.price)}
                disabled={loading}
                className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all flex items-center justify-between group"
              >
                <div className="text-left">
                  <div className="text-xs text-white/40 capitalize">
                    {parent.entityType.replace("_", " ")} Level
                  </div>
                  <div className="font-semibold text-white/90">{parent.name}</div>
                </div>
                <div className="text-lg font-bold text-purple-400">₹{parent.price}</div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 text-white/40 hover:text-white/60 transition-colors text-sm"
        >
          Cancel and return
        </button>
      </div>
    </Modal>
  );
}
