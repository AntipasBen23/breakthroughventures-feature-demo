'use client';

import { useState } from 'react';
import { mockStartups, mockInvestors } from '@/lib/mockData';
import { Startup, Interest, InterestLevel } from '@/lib/types';

export default function QRScanner() {
  const [scannedStartup, setScannedStartup] = useState<Startup | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [interestSaved, setInterestSaved] = useState(false);
  
  // Simulating logged-in investor
  const currentInvestor = mockInvestors[0];

  // Simulate QR code scan
  const simulateScan = (qrCode: string) => {
    const startup = mockStartups.find(s => s.qrCode === qrCode);
    if (startup) {
      setScannedStartup(startup);
      setShowScanner(false);
    }
  };

  const expressInterest = (level: InterestLevel, notes?: string) => {
    // In real app, this would save to backend
    console.log('Interest saved:', {
      startupId: scannedStartup?.id,
      investorId: currentInvestor.id,
      level,
      notes,
      scannedViaQR: true,
      timestamp: new Date(),
    });
    
    setInterestSaved(true);
    setTimeout(() => {
      setScannedStartup(null);
      setInterestSaved(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white pt-24">
      {!scannedStartup ? (
        // Scanner View
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-8">
          {!showScanner ? (
            // Welcome Screen
            <div className="text-center max-w-md w-full">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                <span className="text-6xl">📱</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Breakthrough Demo Day</h1>
              <p className="text-gray-400 mb-8">
                Scan startup QR codes during their pitch to express interest and get instant access to their materials
              </p>
              <button
                onClick={() => setShowScanner(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg transition-all"
              >
                Start Scanning
              </button>
              
              {/* Quick Demo Buttons */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-4">Quick Demo - Simulate scanning:</p>
                <div className="space-y-2">
                  {mockStartups.slice(0, 3).map((startup) => (
                    <button
                      key={startup.id}
                      onClick={() => simulateScan(startup.qrCode!)}
                      className="w-full bg-white/5 hover:bg-white/10 text-left p-3 rounded-lg transition-all text-sm"
                    >
                      <div className="font-medium">{startup.name}</div>
                      <div className="text-gray-400 text-xs">{startup.qrCode}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Scanner Active
            <div className="text-center max-w-md w-full">
              <div className="relative w-full aspect-square bg-black/50 rounded-2xl mb-6 overflow-hidden border-4 border-blue-500">
                {/* Scanner Frame Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-64">
                    {/* Corner Brackets */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>
                    
                    {/* Scanning Line */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-30">📱</div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Point at QR Code</h2>
              <p className="text-gray-400 mb-6">Position the QR code within the frame</p>
              
              <button
                onClick={() => setShowScanner(false)}
                className="text-gray-400 hover:text-white transition-all"
              >
                Cancel
              </button>

              {/* Quick Demo Buttons */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">Simulate scan:</p>
                <div className="grid grid-cols-2 gap-2">
                  {mockStartups.slice(0, 4).map((startup) => (
                    <button
                      key={startup.id}
                      onClick={() => simulateScan(startup.qrCode!)}
                      className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-all text-xs text-left"
                    >
                      {startup.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Scanned Startup Detail
        <div className="min-h-[calc(100vh-6rem)] px-8 py-8 flex items-center justify-center">
          {!interestSaved ? (
            <div className="max-w-2xl w-full bg-slate-900 rounded-2xl p-8 border border-white/10">
              {/* Success Animation */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-4xl">✓</span>
                </div>
                <div className="text-green-400 font-semibold mb-1">QR Code Scanned!</div>
                <div className="text-sm text-gray-400">Connected to {scannedStartup.name}</div>
              </div>

              {/* Startup Info */}
              <div className="flex items-start gap-6 mb-6 pb-6 border-b border-white/10">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-4xl font-bold flex-shrink-0">
                  {scannedStartup.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{scannedStartup.name}</h2>
                  <p className="text-gray-400 mb-3">{scannedStartup.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                      {scannedStartup.industry}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">
                      {scannedStartup.stage}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                      ${(scannedStartup.fundingGoal! / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-300 leading-relaxed">{scannedStartup.description}</p>
              </div>

              {/* Founder */}
              <div className="mb-8 pb-6 border-b border-white/10">
                <h3 className="text-lg font-semibold mb-3">Founder</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <div>
                    <div className="font-medium">{scannedStartup.founderName}</div>
                    <div className="text-sm text-gray-400">{scannedStartup.founderEmail}</div>
                  </div>
                </div>
              </div>

              {/* Interest Level Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Express Your Interest</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Let {scannedStartup.founderName} know you're interested. They'll get instant notification.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => expressInterest('STRONGLY_INTERESTED')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">🔥</span>
                  <span>Strongly Interested - Let's Talk</span>
                </button>
                <button
                  onClick={() => expressInterest('WANT_TO_LEARN_MORE')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-xl">👀</span>
                  <span>Want to Learn More</span>
                </button>
                <button
                  onClick={() => expressInterest('MAYBE_LATER')}
                  className="w-full bg-white/5 hover:bg-white/10 text-gray-400 py-4 rounded-xl font-semibold transition-all"
                >
                  Maybe Later
                </button>
              </div>

              {/* Skip Button */}
              <button
                onClick={() => setScannedStartup(null)}
                className="w-full mt-4 text-gray-400 hover:text-white transition-all text-sm"
              >
                Skip for now
              </button>
            </div>
          ) : (
            // Success Confirmation
            <div className="text-center max-w-md">
              <div className="w-32 h-32 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-6xl">✓</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-green-400">Interest Saved!</h2>
              <p className="text-gray-400 mb-6">
                {scannedStartup.founderName} has been notified. You'll receive their pitch deck and materials shortly.
              </p>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-sm text-gray-400 mb-2">What happens next:</div>
                <ul className="text-left space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Access to pitch deck & data room</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Founder will reach out within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span>Schedule follow-up meeting</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}