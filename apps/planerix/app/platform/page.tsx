'use client';
import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Shield,
  Lock,
  Database,
  Globe,
  Cloud,
  Activity,
  Server,
  Cpu,
  KeyRound,
  FileCode2,
  Plug,
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import ContactForm from '@/components/ContactForm';

export default function PlatformPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const pillars = [
    {
      icon: Server,
      title: 'Scalable architecture',
      desc: 'Multi-tenant by default with isolation per workspace. Horizontal scaling, queue-backed jobs, idempotent workers.',
      bullets: ['Stateless app nodes', 'Async job queues', 'Idempotent commands', 'Zero-downtime deploys'],
    },
    {
      icon: Shield,
      title: 'Security first',
      desc: 'Defense-in-depth with least-privilege RBAC, secrets management, and encrypted transport/storage.',
      bullets: ['RBAC & object-level ACL', 'TLS in transit', 'AES-256 at rest', 'Key rotation policy'],
    },
    {
      icon: Activity,
      title: 'Reliability',
      desc: 'Self-healing orchestration, health checks, circuit breakers, request budgets, error budgets.',
      bullets: ['Health probes', 'Circuit breaking', 'Auto-restart', 'Blue/green rollouts'],
    },
  ];

  const security = [
    { icon: Lock, title: 'SSO / SAML', text: 'Connect your IdP (Okta, Azure AD, Google Workspace). SCIM for user provisioning.' },
    { icon: KeyRound, title: 'Key management', text: 'Managed KMS with rotation and envelope encryption.' },
    { icon: Database, title: 'Backups', text: 'Daily encrypted backups. Point-in-time recovery window up to 7 days.' },
    { icon: Globe, title: 'Data residency', text: 'EU and US regions. EU residency available for all paid plans.' },
  ];

  const perf = [
    { title: 'Low-latency UI', text: 'Edge caching and incremental streaming for fast interactions.' },
    { title: 'Query performance', text: 'Adaptive indices and read replicas for analytics-heavy views.' },
    { title: 'Async pipelines', text: 'Long-running work moved to queues with status tracking.' },
    { title: 'Observability', text: 'Metrics, logs, traces — correlated for quick RCA.' },
  ];

  const api = [
    { icon: FileCode2, title: 'Open API', text: 'REST + webhooks. SDKs for JS/TS and Python.' },
    { icon: Plug, title: 'Integrations', text: 'Native connectors for popular SaaS. Events bus for custom flows.' },
    { icon: Cpu, title: 'AI runtime', text: 'Guardrails, prompt templates, evaluation harness for AI features.' },
    { icon: Cloud, title: 'Infrastructure', text: 'Autoscaled workers, job retries, dead-letter queues.' },
  ];

  const faqs = [
    { q: 'Do you support SSO/SAML and SCIM?', a: 'Yes. SSO via SAML 2.0 with major IdPs. SCIM is available on Premium for automated provisioning.' },
    { q: 'Can we keep data in the EU?', a: 'Yes. EU data residency is available for Team and Premium. Backups remain in-region and encrypted.' },
    { q: 'What is your backup/restore policy?', a: 'Daily encrypted backups with point-in-time recovery (up to 7 days). Restores are executed on request.' },
    { q: 'How is tenant isolation enforced?', a: 'Workspace-level isolation with row-level guards, scoped keys, and explicit access checks in the service layer.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-10 pb-16 px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-medium">Secure • Scalable • Observable</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Platform built for security and scale</h1>
              <p className="text-xl text-gray-600">
                Liderix combines enterprise-grade security, regional data residency, and a developer-friendly API — so you can run mission-critical work with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#lead-access"
                  className="group relative px-8 py-4 bg-gray-900 text-white rounded-lg font-medium overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="relative z-10">Request access</span>
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </a>
                <a
                  href="/pricing"
                  className="flex items-center justify-center px-8 py-4 bg-white border-2 border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors text-gray-900"
                >
                  View pricing
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Core runtime</h3>
                  <p className="text-blue-200">API • Workers • Queues • Storage</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['p95 latency: 120ms', 'Uptime: 99.9%', 'Jobs/day: 2.1M', 'Regions: EU/US'].map((s, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-white/80 text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">EU residency</p>
                    <p className="text-lg font-bold">Available now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-gray-600 mb-4">{p.desc}</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {p.bullets.map((b, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security & compliance</h2>
            <p className="text-xl text-gray-600">Enterprise controls from day one</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {security.map((s, i) => {
              const Icon = s.icon as any;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-bold mb-2">{s.title}</h4>
                  <p className="text-gray-600 text-sm">{s.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="font-bold mb-3">Access control</h4>
              <p className="text-gray-600 mb-4">Role-based access (RBAC) with object-level permissions. Audit trails for critical actions.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {['Granular roles & scopes', 'Approval workflows', 'Audit log export'].map((b) => (
                  <li key={b} className="flex items-start"><Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="font-bold mb-3">Data protection</h4>
              <p className="text-gray-600 mb-4">Encryption at rest and in transit. Configurable data retention policies per workspace.</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {['AES-256 storage encryption', 'TLS 1.2+ transport', 'Configurable retention'].map((b) => (
                  <li key={b} className="flex items-start"><Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Performance & Observability */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Performance & observability</h2>
            <p className="text-xl text-gray-600">See and improve what matters</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {perf.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold mb-2">{p.title}</h4>
                <p className="text-gray-600 text-sm">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API & Integrations */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {api.map((a, i) => {
              const Icon = a.icon as any;
              return (
                <div key={i} className="bg-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">{a.title}</h4>
                  <p className="text-blue-100 text-sm">{a.text}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <a
              href="/integrations"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Browse integrations
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* SLA & Residency CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">SLA & regional residency</h2>
          <p className="text-xl text-gray-600 mb-8">99.9% uptime target with EU/US residency options.</p>
          <a
            href="#lead-connection"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Discuss enterprise rollout
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Lead forms */}
      <section id="lead-access" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <LeadForm type="access" />
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
            <p className="text-xl text-gray-600">Platform, security, and performance</p>
          </div>
        </div>
        <div className="container mx-auto max-w-4xl space-y-6">
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
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Talk to our team</h2>
            <p className="text-xl text-gray-600">We’ll tailor a walkthrough for your security & compliance needs</p>
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