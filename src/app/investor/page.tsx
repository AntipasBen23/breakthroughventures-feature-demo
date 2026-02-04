'use client';

import { useState } from 'react';
import { mockStartups, mockInvestors, mockInterests, mockDocumentViews, mockMeetings } from '@/lib/mockData';
import { Startup, Interest, InterestLevel } from '@/lib/types';

export default function InvestorDashboard() {
  // Simulating logged-in investor (Michael Chen from Sequoia)
  const currentInvestor = mockInvestors[0];
  
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'matched' | 'interested'>('all');
  const [interests, setInterests] = useState(mockInterests);

  // Get investor's interests
  const myInterests = interests.filter(i => i.investorId === currentInvestor.id);
  const myInterestStartupIds = myInterests.map(i => i.startupId);

  // Get investor's meetings
  const myMeetings = mockMeetings.filter(m => m.investorId === currentInvestor.id);

  // Calculate match score for each startup
  const getMatchScore = (startup: Startup) => {
    let score = 0;
    
    // Sector match
    if (currentInvestor.sectors.includes(startup.industry)) score += 40;
    
    // Stage match
    if (currentInvestor.stages.includes(startup.stage)) score += 30;
    
    // Check size match
    if (startup.fundingGoal && currentInvestor.checkSizeMin && currentInvestor.checkSizeMax) {
      if (startup.fundingGoal >= currentInvestor.checkSizeMin && startup.fundingGoal <= currentInvestor.checkSizeMax) {
        score += 30;
      }
    }
    
    return score;
  };

  // Filter startups based on view mode
  const getFilteredStartups = () => {
    if (viewMode === 'interested') {
      return mockStartups.filter(s => myInterestStartupIds.includes(s.id));
    }
    if (viewMode === 'matched') {
      return mockStartups.filter(s => getMatchScore(s) >= 60);
    }
    return mockStartups;
  };

  const filteredStartups = getFilteredStartups();

  // Express interest function
  const expressInterest = (startup: Startup, level: InterestLevel) => {
    const existingInterest = interests.find(
      i => i.startupId === startup.id && i.investorId === currentInvestor.id
    );

    if (existingInterest) {
      // Update existing interest
      setInterests(interests.map(i => 
        i.id === existingInterest.id ? { ...i, level, createdAt: new Date() } : i
      ));
    } else {
      // Create new interest
      const newInterest: Interest = {
        id: `interest-${Date.now()}`,
        startupId: startup.id,
        investorId: currentInvestor.id,
        investorName: currentInvestor.name,
        investorFirm: currentInvestor.firm,
        investorAvatar: currentInvestor.avatarUrl,
        level,
        isAnonymous: false,
        scannedViaQR: false,
        createdAt: new Date(),
      };
      setInterests([...interests, newInterest]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Investor Portal</h1>
          <p className="text-gray-400">Welcome back, {currentInvestor.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium">{currentInvestor.name}</div>
            <div className="text-sm text-gray-400">{currentInvestor.firm}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">My Interests</div>
          <div className="text-3xl font-bold text-blue-400">{myInterests.length}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Meetings Scheduled</div>
          <div className="text-3xl font-bold text-green-400">{myMeetings.length}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">High Matches</div>
          <div className="text-3xl font-bold text-purple-400">
            {mockStartups.filter(s => getMatchScore(s) >= 70).length}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Available Startups</div>
          <div className="text-3xl font-bold">{mockStartups.length}</div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            viewMode === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          All Startups ({mockStartups.length})
        </button>
        <button
          onClick={() => setViewMode('matched')}
          className={`px-4 py-2 rounded-lg transition-all ${
            viewMode === 'matched'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          Top Matches ({mockStartups.filter(s => getMatchScore(s) >= 60).length})
        </button>
        <button
          onClick={() => setViewMode('interested')}
          className={`px-4 py-2 rounded-lg transition-all ${
            viewMode === 'interested'
              ? 'bg-blue-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          My Interests ({myInterests.length})
        </button>
      </div>

      {/* Startups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.map((startup) => {
          const matchScore = getMatchScore(startup);
          const hasInterest = myInterestStartupIds.includes(startup.id);
          const myInterest = interests.find(
            i => i.startupId === startup.id && i.investorId === currentInvestor.id
          );

          return (
            <div
              key={startup.id}
              onClick={() => setSelectedStartup(startup)}
              className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {/* Match Score Badge */}
              {matchScore >= 70 && (
                <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                  {matchScore}% Match
                </div>
              )}

              {/* Interest Badge */}
              {hasInterest && (
                <div className="absolute top-4 left-4 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">
                  ⭐ Interested
                </div>
              )}

              {/* Logo */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center text-2xl font-bold mt-2">
                {startup.name.charAt(0)}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2">{startup.name}</h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{startup.tagline}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                  {startup.industry}
                </span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                  {startup.stage}
                </span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                  ${(startup.fundingGoal! / 1000000).toFixed(1)}M
                </span>
              </div>

              {/* Interest Level (if expressed) */}
              {myInterest && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-xs text-gray-400 mb-1">Your Interest Level:</div>
                  <div className={`text-sm font-medium ${
                    myInterest.level === 'STRONGLY_INTERESTED' ? 'text-orange-400' : 'text-blue-400'
                  }`}>
                    {myInterest.level === 'STRONGLY_INTERESTED' ? '🔥 Strongly Interested' : '👀 Want to Learn More'}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Startup Detail Modal */}
      {selectedStartup && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-50"
          onClick={() => setSelectedStartup(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedStartup(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

            {/* Match Score */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl font-bold">
                  {selectedStartup.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{selectedStartup.name}</h2>
                  <p className="text-gray-400">{selectedStartup.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Match Score</div>
                <div className="text-4xl font-bold text-green-400">{getMatchScore(selectedStartup)}%</div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                {selectedStartup.industry}
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                {selectedStartup.stage}
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                ${(selectedStartup.fundingGoal! / 1000000).toFixed(1)}M Goal
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-300 leading-relaxed">{selectedStartup.description}</p>
            </div>

            {/* Why It's a Match */}
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">Why This Matches Your Thesis</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {currentInvestor.sectors.includes(selectedStartup.industry) && (
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Matches your sector focus: {selectedStartup.industry}
                  </li>
                )}
                {currentInvestor.stages.includes(selectedStartup.stage) && (
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    At your preferred stage: {selectedStartup.stage}
                  </li>
                )}
                {selectedStartup.fundingGoal && 
                 currentInvestor.checkSizeMin && 
                 currentInvestor.checkSizeMax &&
                 selectedStartup.fundingGoal >= currentInvestor.checkSizeMin && 
                 selectedStartup.fundingGoal <= currentInvestor.checkSizeMax && (
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    Within your check size range (${(currentInvestor.checkSizeMin / 1000000).toFixed(1)}M - ${(currentInvestor.checkSizeMax / 1000000).toFixed(1)}M)
                  </li>
                )}
              </ul>
            </div>

            {/* Founder */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <h3 className="text-lg font-semibold mb-3">Founder</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                <div>
                  <div className="font-medium">{selectedStartup.founderName}</div>
                  <div className="text-sm text-gray-400">{selectedStartup.founderEmail}</div>
                </div>
              </div>
            </div>

            {/* Express Interest Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  expressInterest(selectedStartup, 'STRONGLY_INTERESTED');
                  setSelectedStartup(null);
                }}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-all"
              >
                🔥 Strongly Interested
              </button>
              <button
                onClick={() => {
                  expressInterest(selectedStartup, 'WANT_TO_LEARN_MORE');
                  setSelectedStartup(null);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-all"
              >
                👀 Want to Learn More
              </button>
              <button
                onClick={() => {
                  expressInterest(selectedStartup, 'MAYBE_LATER');
                  setSelectedStartup(null);
                }}
                className="px-6 bg-white/5 hover:bg-white/10 text-gray-400 py-3 rounded-lg font-medium transition-all"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}