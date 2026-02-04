'use client';

import { useState, useEffect } from 'react';
import { 
  mockStartups, 
  mockInvestors, 
  mockInterests, 
  mockMeetings,
  mockMomentumScores,
  mockAnalytics 
} from '@/lib/mockData';

export default function AdminDashboard() {
  const [realTimeEvents, setRealTimeEvents] = useState<any[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'startups' | 'investors' | 'analytics'>('overview');

  // Simulate real-time events streaming in
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const eventTypes = ['interest', 'view', 'meeting', 'scan'];
        const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const randomStartup = mockStartups[Math.floor(Math.random() * mockStartups.length)];
        const randomInvestor = mockInvestors[Math.floor(Math.random() * mockInvestors.length)];

        const newEvent = {
          id: Date.now(),
          type: randomType,
          startup: randomStartup.name,
          investor: randomInvestor.name,
          firm: randomInvestor.firm,
          timestamp: new Date(),
        };

        setRealTimeEvents(prev => [newEvent, ...prev].slice(0, 50));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate overall stats
  const totalInterests = mockInterests.length;
  const strongInterests = mockInterests.filter(i => i.level === 'STRONGLY_INTERESTED').length;
  const totalMeetings = mockMeetings.length;
  const confirmedMeetings = mockMeetings.filter(m => m.status === 'CONFIRMED').length;
  const conversionRate = Math.round((strongInterests / totalInterests) * 100);
  const avgMomentumScore = Math.round(
    mockMomentumScores.reduce((acc, ms) => acc + ms.score, 0) / mockMomentumScores.length
  );

  // Get stuck connections (interests with no meetings)
  const stuckConnections = mockInterests.filter(interest => {
    return !mockMeetings.some(m => 
      m.startupId === interest.startupId && m.investorId === interest.investorId
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white pt-24">
      <div className="max-w-7xl mx-auto px-8 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Breakthrough Command Center</h1>
            <p className="text-gray-400">Real-time Demo Day monitoring & analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Live</span>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSelectedView('overview')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedView === 'overview'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView('startups')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedView === 'startups'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Startups
          </button>
          <button
            onClick={() => setSelectedView('investors')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedView === 'investors'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Investors
          </button>
          <button
            onClick={() => setSelectedView('analytics')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedView === 'analytics'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Analytics
          </button>
        </div>

        {selectedView === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Total Interests</div>
                <div className="text-4xl font-bold text-blue-400 mb-2">{totalInterests}</div>
                <div className="text-xs text-gray-400">{strongInterests} strong interest</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Meetings Scheduled</div>
                <div className="text-4xl font-bold text-green-400 mb-2">{totalMeetings}</div>
                <div className="text-xs text-gray-400">{confirmedMeetings} confirmed</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Conversion Rate</div>
                <div className="text-4xl font-bold text-purple-400 mb-2">{conversionRate}%</div>
                <div className="text-xs text-gray-400">Interest → Strong</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Avg Momentum</div>
                <div className="text-4xl font-bold text-orange-400 mb-2">{avgMomentumScore}</div>
                <div className="text-xs text-gray-400">Across all startups</div>
              </div>
            </div>
            
            {/* ... REST OF YOUR CODE STAYS EXACTLY THE SAME ... */}

          <div className="grid grid-cols-3 gap-6">
            {/* Real-Time Event Stream */}
            <div className="col-span-2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Live Event Stream</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">Live</span>
                </div>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {realTimeEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className="text-2xl">
                      {event.type === 'interest' && '⭐'}
                      {event.type === 'view' && '👁️'}
                      {event.type === 'meeting' && '📅'}
                      {event.type === 'scan' && '📱'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {event.investor} {event.type === 'interest' && 'expressed interest in'}
                        {event.type === 'view' && 'viewed'}
                        {event.type === 'meeting' && 'scheduled meeting with'}
                        {event.type === 'scan' && 'scanned QR for'} {event.startup}
                      </div>
                      <div className="text-xs text-gray-400">{event.firm}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                {realTimeEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Waiting for events...
                  </div>
                )}
              </div>
            </div>

            {/* Stuck Connections Alert */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">⚠️</span>
                <h2 className="text-xl font-bold">Stuck Connections</h2>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Interests that haven't converted to meetings yet
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {stuckConnections.slice(0, 10).map((interest) => {
                  const startup = mockStartups.find(s => s.id === interest.startupId);
                  return (
                    <div 
                      key={interest.id}
                      className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                    >
                      <div className="text-sm font-medium mb-1">{startup?.name}</div>
                      <div className="text-xs text-gray-400 mb-2">
                        ← {interest.investorName}
                      </div>
                      <div className="text-xs text-yellow-400">
                        {Math.floor((Date.now() - new Date(interest.createdAt).getTime()) / (1000 * 60 * 60))}h without follow-up
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Momentum Leaderboard */}
          <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Momentum Leaderboard</h2>
            <div className="space-y-2">
              {mockMomentumScores.map((ms, idx) => {
                const startup = mockStartups.find(s => s.id === ms.startupId)!;
                return (
                  <div 
                    key={ms.id}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${idx === 0 ? 'bg-yellow-500 text-black' : ''}
                      ${idx === 1 ? 'bg-gray-300 text-black' : ''}
                      ${idx === 2 ? 'bg-orange-600 text-white' : ''}
                      ${idx > 2 ? 'bg-white/10 text-gray-400' : ''}
                    `}>
                      {idx + 1}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold">
                      {startup.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{startup.name}</div>
                      <div className="text-sm text-gray-400">{startup.industry}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-400">{ms.score}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        {ms.trend === 'up' && <span className="text-green-400">↗️ +{ms.change}%</span>}
                        {ms.trend === 'down' && <span className="text-red-400">↘️ {ms.change}%</span>}
                        {ms.trend === 'stable' && <span className="text-gray-400">→ {ms.change}%</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <div className="text-gray-400">Views</div>
                        <div className="font-medium">{ms.profileViews}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Docs</div>
                        <div className="font-medium">{ms.documentViews}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Int.</div>
                        <div className="font-medium">{ms.interestsCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Mtgs</div>
                        <div className="font-medium">{ms.meetingsCount}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {selectedView === 'startups' && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Startup Performance</h2>
          <div className="space-y-3">
            {mockStartups.map((startup) => {
              const interests = mockInterests.filter(i => i.startupId === startup.id);
              const meetings = mockMeetings.filter(m => m.startupId === startup.id);
              const momentum = mockMomentumScores.find(ms => ms.startupId === startup.id);
              
              return (
                <div 
                  key={startup.id}
                  className="p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl font-bold">
                      {startup.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{startup.name}</div>
                      <div className="text-sm text-gray-400">{startup.tagline}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Momentum Score</div>
                      <div className="text-2xl font-bold text-orange-400">{momentum?.score}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400 mb-1">Interests</div>
                      <div className="font-medium">{interests.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Strong</div>
                      <div className="font-medium text-orange-400">
                        {interests.filter(i => i.level === 'STRONGLY_INTERESTED').length}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Meetings</div>
                      <div className="font-medium text-green-400">{meetings.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Stage</div>
                      <div className="font-medium">{startup.stage}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-1">Goal</div>
                      <div className="font-medium">${(startup.fundingGoal! / 1000000).toFixed(1)}M</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedView === 'investors' && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Investor Activity</h2>
          <div className="space-y-3">
            {mockInvestors.map((investor) => {
              const interests = mockInterests.filter(i => i.investorId === investor.id);
              const meetings = mockMeetings.filter(m => m.investorId === investor.id);
              
              return (
                <div 
                  key={investor.id}
                  className="p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                    <div className="flex-1">
                      <div className="font-medium">{investor.name}</div>
                      <div className="text-sm text-gray-400">{investor.title} at {investor.firm}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-gray-400 mb-1">Interests</div>
                        <div className="text-xl font-bold text-blue-400">{interests.length}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 mb-1">Strong</div>
                        <div className="text-xl font-bold text-orange-400">
                          {interests.filter(i => i.level === 'STRONGLY_INTERESTED').length}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400 mb-1">Meetings</div>
                        <div className="text-xl font-bold text-green-400">{meetings.length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedView === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Funnel Metrics</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Profile Views</span>
                    <span className="font-medium">{mockAnalytics.filter(a => a.eventType === 'profile_view').length}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Interests Expressed</span>
                    <span className="font-medium">{totalInterests}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Meetings Scheduled</span>
                    <span className="font-medium">{totalMeetings}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Engagement Quality</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Strong Interest Rate</span>
                    <span className="text-2xl font-bold text-orange-400">{conversionRate}%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Meeting Conversion</span>
                    <span className="text-2xl font-bold text-green-400">
                      {Math.round((totalMeetings / totalInterests) * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Avg Time to Meeting</span>
                    <span className="text-2xl font-bold text-blue-400">2.4 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}