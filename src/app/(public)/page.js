// app/(public)/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TournamentCard from "@/components/tournaments/TournamentCard";
import WinnerCard from "@/components/winners/WinnerCard";
import { api } from "@/lib/api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  GiTrophy,
  GiMoneyStack,
  GiCrossedSwords,
  GiGamepad,
  GiPodiumWinner,
  GiRank3,
  GiTargetPrize,
  GiHelmet,
  GiBulletBill,
  GiBattleGear,
  GiPlayerTime,
  GiShield,
  GiAmmoBox
} from "react-icons/gi";
import {
  FiUsers,
  FiAward,
  FiCalendar,
  FiChevronRight,
  FiTrendingUp,
  FiStar,
  FiShield as FiShieldIcon,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
  FiBarChart2,
  FiTarget,
  FiAward as FiReward,
  FiTarget as FiScope,
  FiZap,
  FiActivity,
  FiGlobe
} from "react-icons/fi";
import {
  MdOutlineEmojiEvents,
  MdSecurity,
  MdVerified,
  MdMilitaryTech,
  MdSportsEsports,
  MdLocalFireDepartment,
  MdFlashOn
} from "react-icons/md";
import { BsGraphUp, BsPeopleFill, BsFillShieldFill, BsFillLightningFill } from "react-icons/bs";
import { FaCrown, FaMedal, FaRegCheckCircle, FaSkullCrossbones, FaRocket } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [data, setData] = useState({
    tournaments: [],
    winners: [],
    stats: null,
    featuredTournaments: []
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [tournamentsRes, winnersRes, statsRes, featuredRes] = await Promise.all([
          api.listTournaments("?limit=12&page=1"),
          api.winnersRecent(8),
          api.getStats(),
          api.listTournaments("?featured=true&limit=3")
        ]);

        setData({
          tournaments: tournamentsRes.data || [],
          winners: winnersRes.data || [],
          stats: statsRes.data || null,
          featuredTournaments: featuredRes.data || []
        });
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const ongoing = data.tournaments.filter(t =>
    ["registration_open", "ongoing"].includes(t.status)
  );
  const upcoming = data.tournaments.filter(t =>
    t.status === "upcoming"
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-96 skeleton rounded-2xl"></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 skeleton rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section - Light BGMI Theme */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-white to-blue-50 border-2 border-blue-100 shadow-xl">
        {/* Background Pattern - Subtle */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-amber-50/20"></div>
          <div className="absolute inset-0 bg-grid-blue-200/[0.02] bg-[size:60px_60px]"></div>
          
          {/* Subtle Tactical Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-blue-100/50"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full border border-amber-100/50"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 h-full">
          <div className="container h-full">
            <div className="flex flex-col lg:flex-row items-center h-full gap-8 lg:gap-12 py-8 lg:py-0">
              {/* Left Content */}
              <div className="flex-1 lg:py-12">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 px-4 py-2 mb-6">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-sm font-semibold text-blue-700">🎮 LIVE TOURNAMENTS ACTIVE</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-slate-900">
                  <span className="block">Conquer the</span>
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                    BattleGround
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 max-w-2xl">
                  Join India's premier BGMI tournament platform. Prove your skills,
                  compete with elite players, and win massive prizes. Every match
                  is a step toward legendary status.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <GiTrophy className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{data.stats?.totalTournaments || 0}+</div>
                      <div className="text-sm text-slate-600">Tournaments</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
                      <FiDollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">₹{data.stats?.totalPrize?.toLocaleString() || 0}</div>
                      <div className="text-sm text-slate-600">Prize Distributed</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
                      <BsPeopleFill className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{data.stats?.totalPlayers || 0}+</div>
                      <div className="text-sm text-slate-600">Players</div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-3 px-8"
                    onClick={() => router.push('/tournaments')}
                  >
                    <GiGamepad className="w-5 h-5" />
                    <span className="font-semibold">Join Tournament</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center gap-3 px-8"
                    onClick={() => router.push('/winners')}
                  >
                    <GiPodiumWinner className="w-5 h-5" />
                    <span>View Winners</span>
                  </Button>
                </div>
              </div>

              {/* Right Side - BGMI Character */}
              <div className="relative w-full lg:w-2/5 h-64 lg:h-96">
                {/* Character Container */}
                <div className="relative h-full flex items-end justify-end">
                  {/* Main Image Container */}
                  <div className="relative h-72 w-72 lg:h-96 lg:w-96">
                    {/* Image with Glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Outer Glow */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/20 via-cyan-200/20 to-teal-200/20 rounded-full blur-xl"></div>
                      
                      {/* Image Frame */}
                      <div className="relative h-full w-full">
                        {/* Frame Border */}
                        <div className="absolute inset-0 rounded-2xl  border-white  overflow-hidden">
                          {/* Actual Image */}
                          <div className="relative h-full w-full">
                            <Image
                              src="/images/bgmi-men.png"
                              alt="BGMI Character"
                              fill
                              className="object-cover"
                              priority
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent"></div>
                          </div>
                        </div>
                        
                      </div>
                    </div>

                   
                  </div>
                </div>

                

               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Tabs Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <GiCrossedSwords className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Battle Arena</h2>
                <p className="text-slate-600">Choose your battleground and prove your skills</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("live")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === "live"
                ? "text-blue-600 border-blue-600"
                : "text-slate-600 hover:text-slate-800 border-transparent"
                }`}
            >
              <div className={`h-2 w-2 rounded-full ${activeTab === "live" ? "bg-blue-500 animate-pulse" : "bg-slate-400"}`}></div>
              Live Tournaments
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === "upcoming"
                ? "text-emerald-600 border-emerald-600"
                : "text-slate-600 hover:text-slate-800 border-transparent"
                }`}
            >
              <FiCalendar className="w-4 h-4" />
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === "featured"
                ? "text-purple-600 border-purple-600"
                : "text-slate-600 hover:text-slate-800 border-transparent"
                }`}
            >
              <FaCrown className="w-4 h-4" />
              Featured
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "live" && (
            ongoing.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ongoing.slice(0, 6).map((tournament) => (
                  <div key={tournament._id} className="group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative">
                      <TournamentCard t={tournament} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16 border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 mb-6">
                  <GiGamepad className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-3">No Live Battles</h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">
                  Prepare your squad. New tournaments launching soon!
                </p>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 flex items-center gap-2 mx-auto"
                  onClick={() => router.push('/tournaments')}
                >
                  <FiCalendar className="w-4 h-4" />
                  View All Tournaments
                </Button>
              </Card>
            )
          )}

          {activeTab === "upcoming" && (
            upcoming.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.slice(0, 6).map((tournament) => (
                  <div key={tournament._id} className="group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative">
                      <TournamentCard t={tournament} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16 border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 mb-6">
                  <FiCalendar className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-3">No Upcoming Battles</h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">
                  New tournaments are being prepared. Stay tuned!
                </p>
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 flex items-center gap-2 mx-auto"
                  onClick={() => router.push('/tournaments')}
                >
                  <FiCalendar className="w-4 h-4" />
                  Check Tournaments
                </Button>
              </Card>
            )
          )}

          {activeTab === "featured" && (
            data.featuredTournaments.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.featuredTournaments.slice(0, 6).map((tournament) => (
                  <div key={tournament._id} className="group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative">
                      <TournamentCard t={tournament} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-16 border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 mb-6">
                  <FaCrown className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-3">No Featured Battles</h3>
                <p className="text-slate-600 max-w-md mx-auto mb-6">
                  Premium tournaments with exclusive rewards coming soon!
                </p>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 flex items-center gap-2 mx-auto"
                  onClick={() => router.push('/tournaments')}
                >
                  <FaCrown className="w-4 h-4" />
                  Explore Tournaments
                </Button>
              </Card>
            )
          )}
        </div>
      </section>

      {/* Battle Features - Professional Cards */}
      <section className="space-y-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Battle-Ready Features</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Designed for competitive BGMI players who demand the best
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <GiShield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Pro-Level Security</h3>
                <p className="text-slate-600 text-sm">
                  Advanced anti-cheat systems and fair play enforcement
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Real-time cheat detection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Match verification system</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Player behavior monitoring</span>
              </div>
            </div>
          </Card>

          {/* Feature 2 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 bg-gradient-to-br from-white to-emerald-50/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <TbTargetArrow className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Precision Analytics</h3>
                <p className="text-slate-600 text-sm">
                  Detailed match statistics and performance tracking
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>K/D ratio tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Damage per match</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Survival time analysis</span>
              </div>
            </div>
          </Card>

          {/* Feature 3 */}
          <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 bg-gradient-to-br from-white to-amber-50/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <GiAmmoBox className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">Instant Rewards</h3>
                <p className="text-slate-600 text-sm">
                  Fast and secure prize distribution to winners
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Automated payouts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Multiple withdrawal options</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiCheckCircle className="w-4 h-4 text-green-500" />
                <span>24/7 support</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Elite Champions Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg">
                <MdMilitaryTech className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-800">Elite Champions</h2>
                <p className="text-slate-600">Top performers who dominated the battleground</p>
              </div>
            </div>
          </div>

          <a
            href="/winners"
            className="group inline-flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold transition-colors"
          >
            View All Champions
            <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.winners.map((winner, index) => (
            <WinnerCard key={winner._id} w={winner} rank={index + 1} />
          ))}
        </div>

        {data.winners.length === 0 && (
          <Card className="p-8 border-2 border-dashed border-slate-200 bg-gradient-to-br from-white to-slate-50">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 mb-4">
                <GiPodiumWinner className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">No Champions Yet</h3>
              <p className="text-slate-600 mb-4">Be the first to claim victory!</p>
              <Button
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                onClick={() => router.push('/tournaments')}
              >
                Join Battle
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* Final CTA - Light Theme */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-cyan-50 border-2 border-blue-100 shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-grid-blue-300/[0.03] bg-[size:40px_40px]"></div>
        </div>

        <div className="relative z-10 p-8 md:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 mb-6 border border-blue-200">
              <GiBattleGear className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">BATTLE READY</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
              Ready for Your Next Victory?
            </h2>

            <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
              Join thousands of elite players on India's most competitive
              BGMI tournament platform. Prove your skills, claim your rewards,
              and etch your name in the halls of legendary champions.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 px-10 py-4 font-semibold"
                onClick={() => router.push('/register')}
              >
                Enlist Now
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 px-10 py-4 font-semibold"
                onClick={() => router.push('/tournaments')}
              >
                <GiCrossedSwords className="w-5 h-5 mr-2" />
                Browse Battles
              </Button>
            </div>

            {/* Battle Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
              <div className="text-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto mb-3">
                  <GiHelmet className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-sm text-slate-600">Pro Players</div>
              </div>

              <div className="text-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-3">
                  <FiReward className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-sm text-slate-600">Guaranteed Prizes</div>
              </div>

              <div className="text-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center mx-auto mb-3">
                  <FiScope className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-sm text-slate-600">Fair Matches</div>
              </div>

              <div className="text-center">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-3">
                  <GiRank3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-sm text-slate-600">Live Rankings</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}