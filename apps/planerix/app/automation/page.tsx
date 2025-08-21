'use client';
import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Check,
  Zap,
  Calendar,
  Clock,
  Webhook,
  Plug,
  GitBranch,
  UserCheck,
  RefreshCw,
  Activity,
  Shield,
  FileCode2,
  Database,
  ListChecks,
  Bell,
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import ContactForm from '@/components/ContactForm';

export default function AutomationPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const capabilities = [
    {
      icon: Zap,
      title: 'Triggers',
      text: 'Start flows from events, changes, or inbound webhooks.',
      bullets: ['Record created/updated', 'Status or field change', 'Webhook & API call', 'Schedule/time window'],
    },
    {
      icon: GitBranch,
      title: 'Flows & branches',
      text: 'Model business logic with branches, loops, and fallbacks.',
      bullets: ['If/else & switch', 'Parallel steps', 'Retries & backoff', 'Dead-letter queues'],
    },
    {
      icon: Plug,
      title: 'Actions & tools',
      text: 'Write to Liderix modules and external systems.',
      bullets: ['OKR/Project/CRM actions', 'Email/Slack/Teams', 'HTTP + OAuth2', 'CSV/XLSX export'],
    },
    {
      icon: UserCheck,
      title: 'Human-in-the-loop',
      text: 'Insert approvals and task handoffs where needed.',
      bullets: ['One/two step approvals', 'Owner routing & SLAs', 'Escalation chains', 'Audit trails'],
    },
    {
      icon: Shield,
      title: 'Guardrails',
      text: 'Least-privilege credentials and scoped contexts.',
      bullets: ['RBAC-scoped actions', 'Secrets vault', 'Rate limits', 'Change review gates'],
    },
    {
      icon: Activity,
      title: 'Run logs & observability',
      text: 'See every run, step status, latency, and outputs.',
      bullets: ['Run timeline', 'Inputs/outputs diff', 'Alerts & webhooks', 'SLO dashboards'],
    },
  ];

  const recipes = [
    {
      icon: ListChecks,
      title: 'Weekly OKR check-ins',
      impact: 'On-time updates +3.2×',
      steps: ['Every Fri 16:00 CET', 'Ping owners', 'Collect updates', 'Post summary to #leadership'],
    },
    {
      icon: Bell,
      title: 'Deal risk alerts',
      impact: 'Stalled deals -28%',
      steps: ['Detect idle >7d', 'Score risk', 'Notify AE & manager', 'Create recovery plan'],
    },
    {
      icon: Database,
      title: 'Finance snapshot',
      impact: 'Close time -22%',
      steps: ['Gather P&L signals', 'Reconcile variances', 'Export XLSX', 'Email CFO'],
    },
  ];

  const faq = [
    { q: 'Can I call external APIs and parse responses?', a: 'Yes. Use HTTP steps with OAuth2/API keys, map JSON to fields, and branch on conditions.' },
    { q: 'How do approvals work?', a: 'Add an approval step. Pick approvers, SLAs, and escalation rules. The run resumes automatically when approved.' },
    { q: 'What about idempotency and retries?', a: 'Steps are idempotent where possible, with configurable retries and exponential backoff.' },
    { q: 'How are credentials stored?', a: 'In an encrypted secrets vault, scoped per workspace and tool. Access is enforced by RBAC.' },
  ];

  const ExampleBlock = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <FileCode2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Example: Risk alert flow (YAML)</h3>
          <p className="text-gray-600 text-sm">Event → Branch → Notify → Task</p>
        </div>
      </div>
      <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm overflow-x-auto">
{`trigger:
  type: event
  source: crm.deal.updated
  when:
    - field: stage
      op: in
      value: ["Negotiation","Proposal"]
    - field: last_activity_days
      op: ">"
      value: 7
steps:
  - id: score
    action: ai.classify
    input: "{{deal.notes}}"
    params: { labels: ["low","medium","high"] }
  - id: branch
    action: branch
    on:
      - when: "{{steps.score.output == 'high'}}"
        then:
          - action: notify.slack
            channel: "#revenue-alerts"
            message: "⚠️ High-risk deal {{deal.name}} — owner {{deal.owner}}"
          - action: tasks.create
            assignee: "{{deal.owner}}"
            title: "Recovery plan for {{deal.name}}"
            due_in: "3d"
      - default:
          - action: log.info
            message: "Risk acceptable for {{deal.id}}"`}
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-10 pb-16 px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                <Zap className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-medium">Rules • Triggers • Approvals • Webhooks</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Automate work across teams and tools</h1>
              <p className="text-xl text-gray-600">
                Build reliable flows with schedules, branches, approvals, and tool calls — fully observable and governed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#lead-demo"
                  className="group relative px-8 py-4 bg-gray-900 text-white rounded-lg font-medium overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  <span className="relative z-10">Book a live demo</span>
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
                  <h3 className="text-2xl font-bold mb-2">Automation control panel</h3>
                  <p className="text-blue-200">Runs • Latency • Success rate</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['Runs/day: 210k', 'Success: 99.2%', 'p95: 180ms', 'Approvals: 1.4k'].map((s, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-white/80 text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Retries & idempotency</p>
                    <p className="text-lg font-bold">Built-in</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((c, i) => {
              const Icon = c.icon as any;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{c.title}</h3>
                  <p className="text-gray-600 mb-4">{c.text}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {c.bullets.map((b, j) => (
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

      {/* Example */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <ExampleBlock />
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <Webhook className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Inbound webhooks & schedules</h3>
              <p className="text-gray-600 mb-4">
                Trigger flows from your systems using signed webhooks, or run on cron-like schedules in your timezone.
              </p>
              <ul className="space-y-2 text-gray-700">
                {[
                  'HMAC signatures & timestamp tolerance',
                  'Per-flow secrets and IP allowlists',
                  'Cron & calendar schedules with holidays',
                  'Time windows and blackout periods',
                ].map((b) => (
                  <li key={b} className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                  <Calendar className="w-4 h-4 mr-1" /> Schedules
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                  <Clock className="w-4 h-4 mr-1" /> Time windows
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Starter recipes</h2>
            <p className="text-xl text-gray-600">Deploy in minutes — customize as you scale</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {recipes.map((r, i) => {
              const Icon = r.icon as any;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{r.title}</h3>
                  <div className="mt-2 mb-4 inline-flex text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">{r.impact}</div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {r.steps.map((s, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Governance CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Governed automation for enterprises</h2>
          <p className="text-blue-100 mb-8">RBAC, secrets vault, audit logs, and SLOs included.</p>
          <a
            href="#lead-connection"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-700 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Discuss rollout
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Lead forms */}
      <section id="lead-demo" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <LeadForm type="demo" />
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
            <p className="text-xl text-gray-600">Automation, reliability, and governance</p>
          </div>
          <div className="space-y-6">
            {faq.map((f, index) => (
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
            <p className="text-xl text-gray-600">We’ll help design your first automations</p>
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