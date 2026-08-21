import React from 'react';
import Container from '../components/Container';
import { SparklesIcon, UsersIcon, ReceiptIcon } from '../assets/icons/icons';

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AboutUsPage = () => {
  const features = [
    { title: 'Instant Room Creation', text: 'Spin up a shareable order space in 10 seconds.' },
    { title: 'Live Realtime Sync', text: 'Watch teammates add items to the collective order live.' },
    { title: 'Personal Selections', text: 'Every participant maintains their individual bill.' },
    { title: 'Consolidated Kitchen View', text: 'Restaurant summary automatically totals quantities.' },
    { title: 'Smart Bill Splitting', text: 'Evenly or proportionally split delivery fees and tips.' },
    { title: 'One-Click Multi-Sharing', text: 'Export receipt summaries directly to WhatsApp or Slack.' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-base-100 py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in-up">
          {/* Hero Banner */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-base-200 shadow-xs text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>About Orderly</span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-base-content tracking-tight mb-3">
              Group Dining, Simplified.
            </h1>
            <p className="font-body text-base text-neutral max-w-xl mx-auto">
              The modern way for teams, friends, and families to coordinate food orders without confusing chat threads or messy bill calculations.
            </p>
          </div>

          {/* Mission & Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-base-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit mb-4">
                  <UsersIcon className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-base-content mb-2">
                  Our Mission
                </h2>
                <p className="font-body text-sm text-neutral leading-relaxed">
                  Collecting group orders usually involves messy screenshots, lost notes, and awkward bill math. Orderly streamlines the process from live item picking to consolidated kitchen totals and transparent bill splitting.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-base-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="p-3 bg-secondary/10 text-secondary rounded-2xl w-fit mb-4">
                  <ReceiptIcon className="w-6 h-6" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-base-content mb-2">
                  Why Orderly?
                </h2>
                <p className="font-body text-sm text-neutral leading-relaxed">
                  Real-time sync ensures no duplicate orders or missed dietary customizations. With flexible bill splitting, hosts and participants always have crystal-clear receipts.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-base-200 shadow-xs">
            <h2 className="font-heading text-2xl font-bold text-base-content mb-6 text-center">
              Core Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <div key={index} className="p-4 bg-base-200/40 rounded-2xl border border-base-200/60">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircleIcon />
                    <h3 className="font-heading text-base font-bold text-base-content">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="font-body text-xs text-neutral pl-7">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutUsPage;
