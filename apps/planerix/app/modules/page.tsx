'use client';
import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Target,
  Briefcase,
  Users,
  Award,
  BarChart3,
  Brain,
  Zap,
  Plug,
  Database,
  Lock,
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import ContactForm from '@/components/ContactForm';

export default function ModulesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const modules = [
    {
      icon: Target,
      title: 'OKR & Strategy',
      desc: 'Set measurable objectives, cascade goals, and track outcomes with confidence scoring.',
      color: 'from-blue-500 to-indigo-600',
      bullets: ['Company → Team → Individual cascade', 'Quarterly/annual cycles', 'Initiatives linked to KRs', 'Executive scorecards'],
      anchor: 'okr',
    },
    {
      icon: Briefcase,
      title: 'Projects & Tasks',
      desc: 'Plan and execute with Kanban, Gantt, and sprints — all in one place.',
      color: 'from-cyan-500 to-blue-600',
      bullets: ['Kanban & backlogs', 'Sprints with story points', 'Gantt with dependencies', 'Automation & templates'],
      anchor: 'projects',
    },
    {
      icon: Users,
      title: 'CRM & Sales',
      desc: 'Manage the full customer lifecycle and accelerate revenue.',
      color: 'from-sky-500 to-blue-600',
      bullets: ['Custom pipelines', 'Email/meeting sync', 'Deal health scoring', 'Quotes & basic invoicing'],
      anchor: 'crm',
    },
    {
      icon: Award,
      title: 'People & HR',
      desc: 'Grow talent and culture with structured rituals and visibility.',
      color: 'from-blue-500 to-cyan-600',
      bullets: ['1-on-1s & reviews', 'Skill matrices & career paths', 'OKR-linked development goals', 'Hiring & onboarding'],
      anchor: 'hr',
    },
    {
      icon: BarChart3,
      title: 'Finance & Budgets',
      desc: 'Plan budgets, monitor P&L, and control spend.',
      color: 'from-sky-600 to-indigo-600',
      bullets: ['Real-time P&L snapshots', 'Budget vs. actuals', 'Forecasts & runway', 'Export CSV/XLSX'],
      anchor: 'finance',
    },
    {
      icon: Brain,
      title: 'AI Analytics',
      desc: 'Forecast, detect anomalies, and get next-best actions.',
      color: 'from-indigo-500 to-violet-600',
      bullets: ['Trend forecasting', 'Natural-language insights', 'Risk scoring', 'Playbooks & recommendations'],
      anchor: 'ai',
    },
    {
      icon: Zap,
      title: 'Automation',
      desc: 'Automate workflows across modules and tools.',
      color: 'from-blue-600 to-indigo-700',
      bullets: ['Rules & triggers', 'Scheduled jobs', 'Webhooks', 'Human-in-the-loop approvals'],
      anchor: 'automation',
    },
    {
      icon: Plug,
      title: 'Integrations',
      desc: 'Connect Liderix to your stack in minutes.',
      color: 'from-indigo-600 to-violet-600',
      bullets: ['Native SaaS connectors', 'Open API & SDK', 'SSO/SAML/SCIM', 'Events & data sync'],
      anchor: 'integrations',
    },
    {
      icon: Database,
      title: 'Platform & Data',
      desc: 'Secure, scalable foundation with governance.',
      color: 'from-blue-400 to-blue-600',
      bullets: ['Role-based access', 'Audit logs', 'Backups & exports', 'GDPR-ready'],
      anchor: 'platform',
    },
  ];

  const planMatrix = [
    { feature: 'OKR & Strategy', starter: true, team: true, premium: true },
    { feature: 'Projects & Tasks', starter: true, team: true, premium: true },
    { feature: 'CRM & Sales', starter: false, team: true, premium: true },
    { feature: 'People & HR', starter: false, team: true, premium: true },
    { feature: 'Finance & Budgets', starter: false, team: true, premium: true },
    { feature: 'Automation', starter: false, team: true, premium: true },
    { feature: 'Integrations (core)', starter: true, team: true, premium: true },
    { feature: 'Advanced AI analytics', starter: false, team: false, premium: true },
    { feature: 'Audit logs & SCIM', starter: false, team: false, premium: true },
  ];

  const faqs = [
    { q: 'Can we enable modules gradually?', a: 'Yes. Start with any module and enable more as you scale. Permissions and navigation adapt automatically.' },
    { q: 'Do modules share data?', a: 'Yes. Liderix uses a unified work graph, so goals, projects, CRM, and HR align by design.' },
    { q: 'How do integrations work?', a: 'Use native connectors or the open API. SSO/SAML and SCIM are available on Premium.' },
    { q: 'Is Automation included?', a: 'Automation is included on Team and Premium. Advanced AI automation requires Premium.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-10 pb-16 px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                <Plug className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-medium">Modular by design — unified by data</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Modules: build your operating system for growth</h1>
              <p className="text-xl text-gray-600">Mix and match modules — all connected through OKRs, projects, CRM, HR, finance, and AI analytics.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#lead-demo" className="group relative px-8 py-4 bg-gray-900 text-white rounded-lg font-medium overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                  <span className="relative z-10">Book a live demo</span>
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </a>
                <a href="/pricing" className="flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors text-gray-900">
                  Explore pricing
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Unified Work Graph</h3>
                  <p className="text-blue-200">Goals ↔ Projects ↔ Deals ↔ People ↔ Finance</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['OKR progress: 78%', 'Active projects: 26', 'Deals this quarter: 58', 'Hiring pipeline: 12'].map((stat, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-white/80 text-sm">{stat}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role-based access</p>
                    <p className="text-lg font-bold">Fine-grained</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Choose your modules</h2>
            <p className="text-xl text-gray-600">Each module is powerful alone — and unstoppable together.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              return (
                <a key={idx} id={m.anchor} href={`#${m.anchor}`} className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
                  <div className={`w-14 h-14 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                  <p className="text-gray-600 mb-4">{m.desc}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {m.bullets.map((b, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plan matrix */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">What’s in each plan</h2>
            <p className="text-gray-600">Quick glance at module availability</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-lg">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-6 py-4 font-semibold">Module</th>
                  <th className="px-6 py-4 font-semibold">Starter</th>
                  <th className="px-6 py-4 font-semibold">Team</th>
                  <th className="px-6 py-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {planMatrix.map((row, i) => (
                  <tr key={i} className="border-t last:border-b-0">
                    <td className="px-6 py-4">{row.feature}</td>
                    {[row.starter, row.team, row.premium].map((v, j) => (
                      <td key={j} className="px-6 py-4">
                        {v ? <Check className="w-5 h-5 text-blue-600" /> : <span className="text-gray-400">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <a href="/pricing" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              View pricing
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Lead forms */}
      <section id="lead-demo" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <LeadForm type="demo" defaultPlan="Team" />
        </div>
      </section>
      <section id="lead-connection" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <LeadForm type="connection" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-xl text-gray-600">Modules, plans, and rollout</p>
          </div>
          <div className="space-y-6">
            {faqs.map((f, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button className="w-full p-6 text-left font-bold flex justify-between items-center hover:bg-gray-50 transition-colors" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {f.q}
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Talk to our team</h2>
            <p className="text-xl text-gray-600">We’ll tailor a walkthrough for your use case</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact details</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />Email: hello@planerix.com</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />Phone: +48 12 345 67 89</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />Office: ul. Przykładowa 123, Kraków, Poland</li>
              </ul>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}