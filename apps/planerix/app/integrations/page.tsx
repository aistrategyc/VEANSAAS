'use client';
import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Check,
  Plug,
  Search,
  Filter,
  Webhook,
  FileCode2,
  Shield,
  Database,
  Cloud,
  GitBranch,
  MessageSquare,
  Mail,
  Server,
  Folder,
  BarChart3,
  Link2,
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import ContactForm from '@/components/ContactForm';

type Connector = {
  name: string;
  category: 'CRM' | 'Comms' | 'Dev' | 'Storage' | 'Finance' | 'Analytics' | 'HR' | 'IT';
  description: string;
  status: 'Available' | 'Beta' | 'Coming soon';
};

const CATEGORIES = ['All', 'CRM', 'Comms', 'Dev', 'Storage', 'Finance', 'Analytics', 'HR', 'IT'] as const;

const CONNECTORS: Connector[] = [
  { name: 'Salesforce', category: 'CRM', description: 'Accounts, opportunities, activities sync.', status: 'Available' },
  { name: 'HubSpot', category: 'CRM', description: 'Contacts, deals, engagements.', status: 'Available' },
  { name: 'Pipedrive', category: 'CRM', description: 'Pipelines, stages, activities.', status: 'Beta' },

  { name: 'Slack', category: 'Comms', description: 'Channels, mentions, notifications.', status: 'Available' },
  { name: 'Microsoft Teams', category: 'Comms', description: 'Teams, channels, webhooks.', status: 'Available' },
  { name: 'Gmail', category: 'Comms', description: 'Send & track emails with threads.', status: 'Beta' },
  { name: 'Outlook 365', category: 'Comms', description: 'Calendar & mail actions.', status: 'Coming soon' },

  { name: 'Jira', category: 'Dev', description: 'Issues, sprints, releases.', status: 'Available' },
  { name: 'GitHub', category: 'Dev', description: 'PRs, issues, workflows.', status: 'Available' },
  { name: 'Linear', category: 'Dev', description: 'Issues, projects, cycles.', status: 'Beta' },

  { name: 'Google Drive', category: 'Storage', description: 'Docs, sheets, permissions.', status: 'Available' },
  { name: 'Dropbox', category: 'Storage', description: 'Files, folders, shares.', status: 'Beta' },
  { name: 'OneDrive', category: 'Storage', description: 'Files & links.', status: 'Coming soon' },

  { name: 'Stripe', category: 'Finance', description: 'Invoices, payments, events.', status: 'Available' },
  { name: 'Xero', category: 'Finance', description: 'Accounts, P&L, invoices.', status: 'Coming soon' },
  { name: 'QuickBooks', category: 'Finance', description: 'Expenses, invoices, reports.', status: 'Coming soon' },

  { name: 'GA4', category: 'Analytics', description: 'Web analytics snapshots.', status: 'Beta' },
  { name: 'BigQuery', category: 'Analytics', description: 'Warehouse queries.', status: 'Available' },
  { name: 'Snowflake', category: 'Analytics', description: 'Secure data sharing.', status: 'Available' },

  { name: 'Workday', category: 'HR', description: 'People, positions, approvals.', status: 'Coming soon' },
  { name: 'BambooHR', category: 'HR', description: 'Employees & PTO.', status: 'Beta' },

  { name: 'Okta', category: 'IT', description: 'SSO/SAML, SCIM provisioning.', status: 'Available' },
  { name: 'Azure AD', category: 'IT', description: 'SSO/SAML, SCIM provisioning.', status: 'Available' },
];

export default function IntegrationsPage() {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CONNECTORS.filter((c) => (cat === 'All' ? true : c.category === cat))
      .filter((c) => (q ? (c.name + ' ' + c.category + ' ' + c.description).toLowerCase().includes(q) : true));
  }, [query, cat]);

  const badge = (status: Connector['status']) =>
    status === 'Available'
      ? 'text-green-700 bg-green-100'
      : status === 'Beta'
      ? 'text-amber-700 bg-amber-100'
      : 'text-gray-600 bg-gray-100';

  const faq = [
    { q: 'How do auth and scopes work?', a: 'Each connector uses OAuth2 or key-based auth with least-privilege scopes. Admins approve and can revoke at any time.' },
    { q: 'Can we build a custom connector?', a: 'Yes. Use the open REST API and inbound webhooks to push/pull data. We provide examples and a testing sandbox.' },
    { q: 'Do you support SSO and SCIM?', a: 'Yes. Okta and Azure AD are supported for SSO (SAML 2.0) and SCIM user provisioning on Premium.' },
    { q: 'Where is data stored?', a: 'In-region (EU/US) with encryption in transit and at rest. You can export or delete integration data at any time.' },
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
                <span className="text-blue-800 text-sm font-medium">Connect Liderix to your stack in minutes</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Integrations & open API</h1>
              <p className="text-xl text-gray-600">
                Native connectors for the tools you use — plus an open API, webhooks, and secure single sign-on.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#gallery"
                  className="group relative px-8 py-4 bg-gray-900 text-white rounded-lg font-medium overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="relative z-10">Browse connectors</span>
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </a>
                <a
                  href="#build"
                  className="flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors text-gray-900"
                >
                  Build your own
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Integration control panel</h3>
                  <p className="text-blue-200">Connections • Health • Throughput</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['Active connections: 84', 'Events/day: 1.2M', 'Failures: 0.3%', 'Regions: EU/US'].map((s, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-white/80 text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">OAuth2 + SAML/SCIM</p>
                    <p className="text-lg font-bold">Enterprise-ready</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section id="gallery" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold">Directory</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search connectors…"
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="hidden lg:flex items-center gap-2 text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="text-sm">Filter by category</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {(CATEGORIES as readonly string[]).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c as any)}
                className={`px-3 py-1 rounded-full text-sm ${
                  cat === c ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((c) => (
              <div key={`${c.category}-${c.name}`} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      {/* Иконка по категории */}
                      {c.category === 'CRM' && <BarChart3 className="w-6 h-6 text-white" />}
                      {c.category === 'Comms' && <MessageSquare className="w-6 h-6 text-white" />}
                      {c.category === 'Dev' && <GitBranch className="w-6 h-6 text-white" />}
                      {c.category === 'Storage' && <Folder className="w-6 h-6 text-white" />}
                      {c.category === 'Finance' && <Database className="w-6 h-6 text-white" />}
                      {c.category === 'Analytics' && <Cloud className="w-6 h-6 text-white" />}
                      {c.category === 'HR' && <Mail className="w-6 h-6 text-white" />}
                      {c.category === 'IT' && <Server className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{c.name}</h3>
                      <p className="text-sm text-gray-600">{c.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge(c.status)}`}>{c.status}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{c.description}</p>
                <div className="flex gap-2">
                  <a
                    href="#lead-connection"
                    className="inline-flex items-center text-blue-700 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-lg text-sm"
                  >
                    Connect
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                  <a
                    href="#build"
                    className="inline-flex items-center text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center text-gray-600 mt-10">No connectors match your filters.</div>
          )}
        </div>
      </section>

      {/* Build your own */}
      <section id="build" className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <FileCode2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Open REST API</h3>
              <p className="text-gray-600 mb-4">Create, update, and query records across modules with fine-grained scopes.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {['OAuth2 & PAT keys', 'Rate limits per workspace', 'Cursor pagination & webhooks', 'SDKs for JS/TS & Python'].map((b) => (
                  <li key={b} className="flex items-start"><Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Webhook className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inbound webhooks</h3>
              <p className="text-gray-600 mb-4">Push events from your systems to trigger automations or keep data in sync.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {['HMAC signatures', 'Replay protection', 'IP allowlists', 'Per-flow secrets'].map((b) => (
                  <li key={b} className="flex items-start"><Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Link2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">iPaaS & low-code</h3>
              <p className="text-gray-600 mb-4">Connect via n8n, Zapier, Make, or your internal integration hub.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {['Prebuilt templates', 'Retry-friendly webhooks', 'Mapping & transforms', 'Human-in-the-loop approvals'].map((b) => (
                  <li key={b} className="flex items-start"><Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Governance & security */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Least privilege', text: 'Connector scopes limited by role and workspace policies.' },
              { icon: Database, title: 'Data residency', text: 'EU/US regions with encryption in transit and at rest.' },
              { icon: Cloud, title: 'Throughput & retries', text: 'Backoff with dead-letter queues and at-least-once delivery.' },
              { icon: GitBranch, title: 'Change control', text: 'Audit logs for config changes and secret rotation.' },
            ].map((b, i) => {
              const Icon = b.icon as any;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold mb-2">{b.title}</h4>
                  <p className="text-gray-600 text-sm">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Need a new connector or a custom flow?</h2>
          <p className="text-blue-100 mb-8">Tell us your stack — we’ll scope an integration in days, not months.</p>
          <a
            href="#lead-connection"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Request an integration
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Lead forms */}
      <section id="lead-connection" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <LeadForm type="connection" />
        </div>
      </section>
      <section id="lead-demo" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <LeadForm type="demo" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-xl text-gray-600">Authentication, security, and building custom connectors</p>
          </div>
          <div className="space-y-6">
            {faq.map((f, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  className="w-full p-6 text-left font-bold flex justify-between items-center hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {f.q}
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
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
            <p className="text-xl text-gray-600">We’ll help design the integration roadmap for your stack</p>
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