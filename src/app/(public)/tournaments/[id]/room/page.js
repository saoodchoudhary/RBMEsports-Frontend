"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  FiLock, 
  FiCopy, 
  FiChevronLeft, 
  FiVideo,
  FiShield,
  FiInfo,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";
import {
  GiSwordsPower,
  GiBattleGear,
  GiShield,
  GiMachineGun,
  GiTargeting,
  GiSkull,
  GiKey,
  GiDoor,
  GiSecretDoor
} from "react-icons/gi";
import { MdSecurity, MdVerified, MdOutlineLock } from "react-icons/md";
import { BsShieldLock, BsShieldCheck } from "react-icons/bs";

function copy(text) {
  if (!text) return Promise.resolve(false);
  return navigator.clipboard.writeText(String(text)).then(() => true).catch(() => false);
}

export default function RoomPage({ params }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);
  const [showRoomId, setShowRoomId] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const roomId = data?.roomId || "";
  const roomPassword = data?.roomPassword || "";

  const roomReady = Boolean(roomId) && Boolean(roomPassword);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await api.room(id);
        if (!mounted) return;
        setData(res.data);
        setErr(null);
      } catch (e) {
        if (!mounted) return;

        if (e?.status === 401) {
          router.push(`/login?next=/tournaments/${id}/room`);
          return;
        }

        setErr(e?.message || "Failed to load room details");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  const title = useMemo(() => data?.title || "Room Details", [data]);

  return (
    <div className="w-full">
      <div className="">
        
        {/* Main Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          
          {/* Header with Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 p-5 sm:p-6 lg:p-8 border-b border-gray-700">
            {/* Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Icon */}
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-xl flex-shrink-0">
                    <GiSecretDoor className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  
                  {/* Title */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                        SECURE ACCESS
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-600"></span>
                      <span className="text-xs font-medium text-gray-400">
                        Tournament Room
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                      {title}
                    </h1>
                  </div>
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center gap-2 text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all text-sm font-semibold w-full sm:w-auto justify-center"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  Back to Tournament
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mt-4 flex items-start gap-2 border-t border-gray-700 pt-4">
                <FiShield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Room details visible only to registered & paid participants (or admin).</span>
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 lg:p-8">
            
            {/* Loading State */}
            {loading && (
              <div className="space-y-4">
                <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
              </div>
            )}

            {/* Error State */}
            {!loading && err && (
              <div className="bg-gradient-to-br from-red-50 to-red-50 border border-red-200 rounded-xl p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                    <FiLock className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-800 text-base sm:text-lg mb-2">Access Restricted</h3>
                    <p className="text-sm text-red-700 mb-3">{err}</p>
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-100/50 p-3 rounded-lg">
                      <FiInfo className="w-4 h-4 flex-shrink-0" />
                      <span>Room details are visible only after payment success and tournament registration.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success State with Room Details */}
            {!loading && !err && data && (
              <div className="space-y-5 sm:space-y-6">
                
                {/* Room Details Grid */}
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  
                  {/* Room ID Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                          <GiKey className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Room ID
                        </span>
                      </div>
                      {roomReady && (
                        <button
                          onClick={() => setShowRoomId(!showRoomId)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          type="button"
                        >
                          {showRoomId ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    <div className="font-mono text-base sm:text-lg lg:text-xl font-bold text-gray-900 break-all bg-gray-100 p-3 rounded-lg border border-gray-200">
                      {roomReady ? (showRoomId ? roomId : "••••••••••••") : "Not announced yet"}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!roomReady}
                        onClick={async () => {
                          if (await copy(roomId)) {
                            setCopiedId(true);
                            setTimeout(() => setCopiedId(false), 2000);
                          }
                        }}
                        className={`inline-flex items-center gap-2 border-gray-300 ${
                          copiedId ? "text-green-600 border-green-300 bg-green-50" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {copiedId ? (
                          <>
                            <FiCheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FiCopy className="w-4 h-4" />
                            Copy ID
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Room Password Card */}
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                          <GiDoor className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Room Password
                        </span>
                      </div>
                      {roomReady && (
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          type="button"
                        >
                          {showPassword ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
                        </button>
                      )}
                    </div>

                    <div className="font-mono text-base sm:text-lg lg:text-xl font-bold text-gray-900 break-all bg-gray-100 p-3 rounded-lg border border-gray-200">
                      {roomReady ? (showPassword ? roomPassword : "••••••••••••") : "Not announced yet"}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!roomReady}
                        onClick={async () => {
                          if (await copy(roomPassword)) {
                            setCopiedPwd(true);
                            setTimeout(() => setCopiedPwd(false), 2000);
                          }
                        }}
                        className={`inline-flex items-center gap-2 border-gray-300 ${
                          copiedPwd ? "text-green-600 border-green-300 bg-green-50" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {copiedPwd ? (
                          <>
                            <FiCheckCircle className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FiCopy className="w-4 h-4" />
                            Copy Password
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Not Ready Warning */}
                {!roomReady && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-50 border border-amber-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <FiAlertCircle className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-amber-800 text-sm sm:text-base mb-1">
                          Room Details Not Announced Yet
                        </h4>
                        <p className="text-xs sm:text-sm text-amber-700">
                          Room ID and password will be revealed closer to match time. 
                          Please check back 30 minutes before tournament start.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ready Status */}
                {roomReady && (
                  <div className="bg-gradient-to-br from-green-50 to-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <BsShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-green-700">
                          <span className="font-bold">Room details are live!</span> Copy the credentials above to join the tournament.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MdSecurity className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm mb-1">Security Guidelines</h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                          <span>Never share room credentials with anyone outside the tournament</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                          <span>Join the room exactly at scheduled time to avoid disqualification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>
                          <span>Contact support immediately if you face any issues joining</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 text-sm sm:text-base"
                    onClick={() => router.push(`/tournaments/${id}`)}
                  >
                    <GiSwordsPower className="w-4 h-4 mr-2" />
                    View Tournament Details
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 text-sm sm:text-base"
                    onClick={() => window.open('https://www.battlegroundsmobileindia.com', '_blank')}
                  >
                    <GiMachineGun className="w-4 h-4 mr-2" />
                    Open BGMI
                  </Button>
                </div>

                {/* Note */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <FiInfo className="w-3.5 h-3.5" />
                    Room details are encrypted and only visible to authenticated participants.
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Verified Badge */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <MdVerified className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-gray-500">RBM ESports • Secure Room Access • AES-256 Encrypted</span>
        </div>

      </div>
    </div>
  );
}