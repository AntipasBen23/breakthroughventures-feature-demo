'use client';

import { useState, useEffect } from 'react';
import { mockStartups, mockInterests, mockInvestors } from '@/lib/mockData';
import { Startup, Interest } from '@/lib/types';

export default function LiveDemoDayDashboard() {
  const [startups] = useState<Startup[]>(mockStartups);
  const [interests, setInterests] = useState<Interest[]>(mockInterests);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);

  // Calculate live stats for each startup
  const getStartupStats = (startupId: string) => {
    const startupInterests = interests.filter(i => i.startupId === startupId);
    const strongInterests = startupInterests.filter(i => i.level === 'STRONGLY_INTERESTED').length;
    const totalInterests = startupInterests.length;
    
    return {
      interests: totalInterests,
      strongInterests,
      heat: strongInterests > 0 ? 'hot' : totalInterests > 0 ? 'warm' : 'cool'
    };
  };

  // Simulate real-time interest coming in
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomStartup = startups[Math.floor(Math.random() * startups.length)];
        const randomInvestor = mockInvestors[Math.floor(Math.random() * mockInvestors.length)];
        
        const newInterest: Interest = {
          id: `interest-${Date.now()}`,
          startupId: randomStartup.id,
          investorId: randomInvestor.id,
          investorName: randomInvestor.name,
          investorFirm: randomInvestor.firm,
          investorAvatar: randomInvestor.avatarUrl,
          level: Math.random() > 0.5 ? 'STRONGLY_INTERESTED' : 'WANT_TO_LEARN_MORE',
          isAnonymous: false,
          scannedViaQR: true,
          scanTimestamp: new Date(),
          createdAt: new Date(),
        };
        
        setInterests(prev => [...prev, newInterest]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [startups]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white pt-24">
      <div className="max-w-7xl mx-auto px-8 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-400">LIVE</span>
          </div>
          <h1 className="text-3xl font-bold">Demo Day • Spring 2026</h1>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">Total Startups</div>
            <div className="text-4xl font-bold">{startups.length}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">Live Interests</div>
            <div className="text-4xl font-bold text-green-400">{interests.length}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">Strong Interest</div>
            <div className="text-4xl font-bold text-orange-400">
              {interests.filter(i => i.level === 'STRONGLY_INTERESTED').length}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-sm text-gray-400 mb-2">Investors Attending</div>
            <div className="text-4xl font-bold text-blue-400">{mockInvestors.length}</div>
          </div>
        </div>

        {/* Startups Grid with Heat Map */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => {
            const stats = getStartupStats(startup.id);
            const startupInterests = interests.filter(i => i.startupId === startup.id);
            
            return (
              <div
                key={startup.id}
                onClick={() => setSelectedStartup(startup)}
                className={`
                  relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border cursor-pointer
                  transition-all duration-300 hover:scale-105 hover:shadow-2xl
                  ${stats.heat === 'hot' ? 'border-red-500/50 shadow-lg shadow-red-500/20' : ''}
                  ${stats.heat === 'warm' ? 'border-orange-500/50 shadow-lg shadow-orange-500/20' : ''}
                  ${stats.heat === 'cool' ? 'border-white/10' : ''}
                `}
              >
                {/* Heat Indicator */}
                {stats.heat === 'hot' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-medium">
                    🔥 HOT
                  </div>
                )}
                {stats.heat === 'warm' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
                    📈 Warm
                  </div>
                )}

                {/* Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 flex items-center justify-center text-2xl font-bold">
                  {startup.name.charAt(0)}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2">{startup.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{startup.tagline}</p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">👁️</span>
                    <span>{stats.interests}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">⭐</span>
                    <span className="text-orange-400">{stats.strongInterests}</span>
                  </div>
                  <div className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                    {startup.stage}
                  </div>
                </div>

                {/* Recent Interest Avatars */}
                {startupInterests.length > 0 && (
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <div className="flex -space-x-2">
                      {startupInterests.slice(0, 3).map((interest) => (
                        <div
                          key={interest.id}
                          className="w-8 h-8 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-400 to-purple-500"
                          title={interest.investorName}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      {startupInterests.length} investor{startupInterests.length !== 1 ? 's' : ''} interested
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Startup Detail Modal */}
      {selectedStartup && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedStartup(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 border border-white/10 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedStartup(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl leading-none"
            >
              ×
            </button>

            {/* Logo & Header */}
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl font-bold flex-shrink-0">
                {selectedStartup.name.charAt(0)}
              </div>
              <div className="flex-1 pr-8">
                <h2 className="text-3xl font-bold mb-2">{selectedStartup.name}</h2>
                <p className="text-gray-400 mb-3">{selectedStartup.tagline}</p>
                <div className="flex flex-wrap items-center gap-2">
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
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-gray-300 leading-relaxed">{selectedStartup.description}</p>
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

            {/* Interests */}
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Interested Investors ({interests.filter(i => i.startupId === selectedStartup.id).length})
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {interests
                  .filter(i => i.startupId === selectedStartup.id)
                  .map((interest) => (
                    <div
                      key={interest.id}
                      className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{interest.investorName}</div>
                        <div className="text-sm text-gray-400">{interest.investorFirm}</div>
                        {interest.notes && (
                          <p className="text-sm text-gray-300 mt-2 italic">"{interest.notes}"</p>
                        )}
                      </div>
                      <div className={`
                        px-2 py-1 text-xs rounded flex-shrink-0
                        ${interest.level === 'STRONGLY_INTERESTED' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}
                      `}>
                        {interest.level === 'STRONGLY_INTERESTED' ? '⭐ Strong' : '👀 Learning'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}