'use client';

import { useState, useEffect } from 'react';
import { 
  mockStartups, 
  mockInterests, 
  mockDocumentViews, 
  mockMeetings, 
  mockMomentumScores,
  mockAnalytics 
} from '@/lib/mockData';
import { Interest, DocumentView, AnalyticsEvent } from '@/lib/types';

export default function FounderDashboard() {
  // Simulating logged-in founder (Sarah Chen from NeuralFlow AI)
  const currentStartup = mockStartups[0];
  
  const [interests] = useState(mockInterests.filter(i => i.startupId === currentStartup.id));
  const [documentViews] = useState(mockDocumentViews.filter(dv => 
    dv.documentId.includes(currentStartup.id) || dv.documentId === 'doc-1' || dv.documentId === 'doc-2'
  ));
  const [meetings] = useState(mockMeetings.filter(m => m.startupId === currentStartup.id));
  const [analytics, setAnalytics] = useState(
    mockAnalytics.filter(a => a.startupId === currentStartup.id)
  );
  const momentumScore = mockMomentumScores.find(ms => ms.startupId === currentStartup.id)!;

  // Simulate real-time analytics coming in
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newEvent: AnalyticsEvent = {
          id: `analytics-${Date.now()}`,
          startupId: currentStartup.id,
          investorName: 'Anonymous Investor',
          eventType: 'profile_view',
          eventData: { source: 'dashboard' },
          timestamp: new Date(),
        };
        setAnalytics(prev => [newEvent, ...prev]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentStartup.id]);

  // Calculate stats
  const strongInterests = interests.filter(i => i.level === 'STRONGLY_INTERESTED').length;
  const uniqueInvestors = new Set(interests.map(i => i.investorId)).size;
  const avgEngagement = documentViews.length > 0
    ? Math.round(documentViews.reduce((acc, dv) => acc + (dv.completionRate || 0), 0) / documentViews.length)
    : 0;

  // Get recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentActivity = analytics.filter(a => new Date(a.timestamp) > sevenDaysAgo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{currentStartup.name}</h1>
          <p className="text-gray-400">Founder Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium">{currentStartup.founderName}</div>
            <div className="text-sm text-gray-400">Founder & CEO</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
        </div>
      </div>

      {/* Momentum Score Hero */}
      <div className="relative bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-8 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-orange-300 mb-1">Your Momentum Score</div>
              <div className="flex items-center gap-4">
                <div className="text-6xl font-bold text-orange-400">{momentumScore.score}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-2xl ${momentumScore.trend === 'up' ? 'text-green-400' : 'text-gray-400'}`}>
                      {momentumScore.trend === 'up' ? '↗️' : '→'}
                    </span>
                    <span className={`text-lg font-semibold ${momentumScore.trend === 'up' ? 'text-green-400' : 'text-gray-400'}`}>
                      {momentumScore.change > 0 ? '+' : ''}{momentumScore.change}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">Ranked #{momentumScore.rank} of {mockStartups.length}</div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 mb-2">Top 5 Leaderboard</div>
              <div className="space-y-1">
                {mockMomentumScores.slice(0, 5).map((ms, idx) => (
                  <div 
                    key={ms.id} 
                    className={`text-sm flex items-center gap-2 ${
                      ms.startupId === currentStartup.id ? 'text-orange-400 font-bold' : 'text-gray-400'
                    }`}
                  >
                    <span className="w-5">{idx + 1}.</span>
                    <span className="w-16">{ms.score}</span>
                    <span className="text-xs">{mockStartups.find(s => s.id === ms.startupId)?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Profile Views</div>
              <div className="text-2xl font-bold">{momentumScore.profileViews}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Document Views</div>
              <div className="text-2xl font-bold">{momentumScore.documentViews}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Interests</div>
              <div className="text-2xl font-bold">{momentumScore.interestsCount}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Meetings</div>
              <div className="text-2xl font-bold">{momentumScore.meetingsCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Investor Interest</div>
          <div className="text-3xl font-bold text-blue-400">{interests.length}</div>
          <div className="text-xs text-gray-400 mt-1">{uniqueInvestors} unique investors</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Strong Interest</div>
          <div className="text-3xl font-bold text-orange-400">{strongInterests}</div>
          <div className="text-xs text-gray-400 mt-1">{Math.round((strongInterests / interests.length) * 100)}% conversion</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Meetings Scheduled</div>
          <div className="text-3xl font-bold text-green-400">{meetings.length}</div>
          <div className="text-xs text-gray-400 mt-1">{meetings.filter(m => m.status === 'CONFIRMED').length} confirmed</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Avg. Engagement</div>
          <div className="text-3xl font-bold text-purple-400">{avgEngagement}%</div>
          <div className="text-xs text-gray-400 mt-1">Document completion</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Investor Interest Panel */}
        <div className="col-span-2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">Interested Investors ({interests.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {interests.map((interest) => (
              <div 
                key={interest.id}
                className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{interest.investorName}</span>
                    <span className={`
                      px-2 py-0.5 text-xs rounded
                      ${interest.level === 'STRONGLY_INTERESTED' 
                        ? 'bg-orange-500/20 text-orange-400' 
                        : 'bg-blue-500/20 text-blue-400'}
                    `}>
                      {interest.level === 'STRONGLY_INTERESTED' ? '🔥 Strong' : '👀 Learning'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2">{interest.investorFirm}</div>
                  {interest.notes && (
                    <p className="text-sm text-gray-300 italic line-clamp-2">"{interest.notes}"</p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {interest.scannedViaQR && '📱 Scanned QR • '}
                    {new Date(interest.createdAt).toLocaleDateString()} at {new Date(interest.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Live Activity</h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Live</span>
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analytics.slice(0, 15).map((event) => (
              <div 
                key={event.id}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-lg text-sm"
              >
                <div className="text-xl">
                  {event.eventType === 'profile_view' && '👁️'}
                  {event.eventType === 'document_view' && '📄'}
                  {event.eventType === 'interest_expressed' && '⭐'}
                  {event.eventType === 'qr_scan' && '📱'}
                  {event.eventType === 'meeting_scheduled' && '📅'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-300 mb-1">
                    {event.eventType === 'profile_view' && 'Profile viewed'}
                    {event.eventType === 'document_view' && 'Document viewed'}
                    {event.eventType === 'interest_expressed' && 'Interest expressed'}
                    {event.eventType === 'qr_scan' && 'QR code scanned'}
                    {event.eventType === 'meeting_scheduled' && 'Meeting scheduled'}
                  </div>
                  {event.investorName && (
                    <div className="text-xs text-gray-400 truncate">by {event.investorName}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document Views */}
      <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4">Document Views ({documentViews.length})</h2>
        <div className="space-y-3">
          {documentViews.map((view) => (
            <div 
              key={view.id}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="flex-1">
                <div className="font-medium">{view.viewerName}</div>
                <div className="text-sm text-gray-400">{view.viewerFirm}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Duration</div>
                <div className="font-medium">{Math.floor(view.duration! / 60)}m {view.duration! % 60}s</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Pages</div>
                <div className="font-medium">{view.pagesViewed}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Completion</div>
                <div className={`font-medium ${
                  view.completionRate! >= 80 ? 'text-green-400' : 
                  view.completionRate! >= 50 ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {view.completionRate}%
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(view.viewedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4">Upcoming Meetings ({meetings.length})</h2>
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div 
              key={meeting.id}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-lg"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="flex-1">
                <div className="font-medium">{meeting.title}</div>
                <div className="text-sm text-gray-400">with {meeting.investorName} • {meeting.investorFirm}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  {new Date(meeting.scheduledAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(meeting.scheduledAt).toLocaleTimeString()} • {meeting.duration}min
                </div>
              </div>
              <div>
                <span className={`
                  px-3 py-1 text-sm rounded
                  ${meeting.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
                `}>
                  {meeting.status === 'CONFIRMED' ? '✓ Confirmed' : '⏳ Pending'}
                </span>
              </div>
              {meeting.meetingLink && (
                <a 
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                >
                  Join
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}