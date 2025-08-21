'use client';
import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Check,
  Target,
  Briefcase,
  Brain,
  Users,
  Award,
  BarChart3,
  Zap,
  Database,
  Lock,
  Shield,
  LineChart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function FeaturesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featureCategories = [
    {
      icon: Target,
      title: 'OKR & Strategy',
      description: 'Set measurable objectives, align teams, and track outcomes with visual progress.',
      color: 'from-blue-500 to-indigo-600',
      points: [
        'Company → Team → Individual OKR cascade',
        'Progress and confidence scoring',
        'Quarterly and annual cycles',
        'Initiatives linked to key results',
      ],
    },
    {
      icon: Briefcase,
      title: 'Projects & Tasks',
      description: 'Plan and execute with Kanban, Gantt, and sprints — all in one place.',
      color: 'from-cyan-500 to-blue-600',
      points: [
        'Kanban boards and backlogs',
        'Sprints with story points',
        'Gantt timelines and dependencies',
        'Automations and templates',
      ],
    },
    {
      icon: Brain,
      title: 'AI Analytics',
      description: 'Turn data into action with forecasts, insights, and contextual recommendations.',
      color: 'from-indigo-500 to-violet-600',
      points: [
        'Trend forecasting and anomaly alerts',
        'Natural-language insights',
        'Playbooks with next-best actions',
        'Risk scoring across portfolios',
      ],
    },
    {
      icon: Users,
      title: 'CRM & Sales',
      description: 'Manage the full customer lifecycle and accelerate revenue.',
      color: 'from-sky-500 to-blue-600',
      points: [
        'Custom pipelines and stages',
        'Email/meeting sync',
        'Deal health scoring',
        'Quotes and basic invoicing',
      ],
    },
    {
      icon: Award,
      title: 'People & HR',
      description: 'Grow talent and culture with structured rituals and visibility.',
      color: 'from-blue-500 to-cyan-600',
      points: [
        '1-on-1s and performance reviews',
        'Skill matrices and career paths',
        'Goals connected to OKRs',
        'Hiring pipelines and onboarding',
      ],
    },
    {
      icon: BarChart3,
      title: 'Finance & Budgets',
      description: 'Plan budgets, monitor P&L, and keep spend under control.',
      color: 'from-sky-600 to-indigo-600',
      points: [
        'Real-time P&L snapshots',
        'Budget vs. actuals',
        'Forecasts and cash runway',
        'Export to CSV/XLSX',
      ],
    },
  ];

  const deepDives = [
    {
      tag: 'Strategy',
      title: 'Align every initiative to measurable outcomes',
      text: 'Connect projects and tasks directly to key results. See impact and trade-offs before committing resources.',
      bullets: [
        'Scenario planning with what-if models',
        'Cross-team dependencies map',
        'Executive scorecards',
        'Automatic weekly check-ins',
      ],
    },
    {
      tag: 'Delivery',
      title: 'Ship faster with predictable execution',
      text: 'Unify sprints, capacity, and timelines. Automations keep status fresh without extra meetings.',
      bullets: [
        'Sprint velocity and burn-down',
        'Critical path in Gantt',
        'Definition of Done policies',
        'Retro templates and action items',
      ],
    },
    {
      tag: 'Revenue',
      title: 'Close deals with data-driven guidance',
      text: 'AI pinpoints stalled deals and suggests next steps. Pipelines adapt to your process — not the other way around.',
      bullets: [
        'Playbooks and sequences',
        'Email tracking and meeting notes',
        'Win-loss insights',
        'Revenue forecasts',
      ],
    },
    {
      tag: 'People',
      title: 'Grow people, elevate performance',
      text: 'Make growth visible: feedback loops, career ladders, and goals tied to real outcomes.',
      bullets: [
        'OKR-linked development goals',
        '1-on-1 agendas and notes',
        'Calibration and review cycles',
        'Pulse surveys',
      ],
    },
  ];

  const useCases = [
    {
      kpi: 'Time-to-value',
      lift: '+45%',
      title: 'PMO & Ops',
      details: ['Portfolio intake and prioritization', 'Capacity planning', 'Risk heatmaps', 'Executive reporting'],
    },
    {
      kpi: 'Release cadence',
      lift: '+30%',
      title: 'Product & Engineering',
      details: ['Roadmaps to OKRs', 'Sprints and incident links', 'DORA signals import', 'Launch checklists'],
    },
    {
      kpi: 'Win rate',
      lift: '+12%',
      title: 'Sales & Marketing',
      details: ['MQL→SQL handoff SLAs', 'Multi-touch attribution snapshot', 'AI deal health', 'Playbooks by segment'],
    },
  ];

  const security = [
    { icon: Lock, title: 'Enterprise-grade security', text: 'Encryption in transit and at rest, SSO/SAML, SCIM, audit logs.' },
    { icon: Database, title: 'Data residency & backups', text: 'Daily encrypted backups and export on demand.' },
    { icon: Shield, title: 'Compliance-ready', text: 'Built to support GDPR. Role-based access and least-privilege.' },
    { icon: LineChart, title: 'Observability', text: 'Real-time health dashboards and activity trails.' },
  ];

  const faqs = [
    { q: 'Do features require separate add-ons?', a: 'Core modules are available on Team and Premium. Starter includes OKR and tasks. Advanced AI and audit logs are part of Premium.' },
    { q: 'How does AI work in Liderix?', a: 'AI runs forecasts, detects anomalies, and generates contextual insights using your authorized data and role permissions.' },
    { q: 'Can we import historical data?', a: 'Yes. Use CSV/XLSX importers or native integrations. Our team can assist with guided migration.' },
    { q: 'Is there a sandbox?', a: 'Yes — launch a sandbox from the hero section or request a live demo for your use case.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-10 pb-16 px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                <Zap className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-medium">Feature suite — from strategy to execution</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Features to run your company in one place</h1>
              <p className="text-xl text-gray-600">
                Align goals, ship faster, grow revenue, and develop people — with AI-powered insights across your workflows.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/#demo"
                  className="group relative px-8 py-4 bg-gray-900 text-white rounded-lg font-medium overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="relative z-10">Book a live demo</span>
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </a>
                <a
                  href="/#sandbox"
                  className="flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors text-gray-900"
                >
                  Launch sandbox
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Unified Work Graph</h3>
                  <p className="text-blue-200">Goals ↔ Projects ↔ Tasks ↔ Results</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['OKR progress: 78%', 'Active projects: 26', 'Deals this quarter: 58', 'Hiring pipeline: 12'].map((stat, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-white/80 text-sm">{stat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Everything you need — connected</h2>
            <p className="text-xl text-gray-600">Each module is powerful alone and unstoppable together.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCategories.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-gray-600 mb-4">{f.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {f.points.map((p, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep dives */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            {deepDives.map((d, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                <span className="inline-flex text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold mb-3">{d.tag}</span>
                <h3 className="text-2xl font-bold mb-3">{d.title}</h3>
                <p className="text-gray-600 mb-6">{d.text}</p>
                <ul className="space-y-2 text-gray-700">
                  {d.bullets.map((b, j) => (
                    <li key={j} className="flex items-start">
                      <Check className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Proven in real workflows</h2>
            <p className="text-xl text-gray-600">Pick a starting point and grow as you scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((u, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold">{u.title}</h3>
                  <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                    {u.kpi} • {u.lift}
                  </span>
                </div>
                <ul className="mt-4 space-y-2 text-gray-700">
                  {u.details.map((d, j) => (
                    <li key={j} className="flex items-start">
                      <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {security.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="bg-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">{s.title}</h4>
                  <p className="text-blue-100 text-sm">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section id="pricing-cta" className="py-20 px-6 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">See pricing and pick your plan</h2>
          <p className="text-xl text-gray-600 mb-8">Transparent monthly billing in euro. Upgrade anytime.</p>
          <a
            href="/pricing"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Explore pricing
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-xl text-gray-600">Answers about Liderix features and capabilities</p>
          </div>
          <div className="space-y-6">
            {faqs.map((f, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full p-6 text-left font-bold flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
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
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">hello@planerix.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+48 12 345 67 89</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Office</p>
                    <p className="text-gray-600">ul. Przykładowa 123, Kraków, Poland</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="font-medium mb-4">Follow us</p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Facebook className="w-5 h-5 text-gray-600" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Twitter className="w-5 h-5 text-gray-600" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Linkedin className="w-5 h-5 text-gray-600" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors">
                    <Youtube className="w-5 h-5 text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}