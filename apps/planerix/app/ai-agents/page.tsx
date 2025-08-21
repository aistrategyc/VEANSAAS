'use client';
import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Bot,
  Brain,
  Sparkles,
  Shield,
  Plug,
  GitBranch,
  MessageSquare,
  Code2,
  Activity,
  BarChart3,
  PlayCircle,
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import ContactForm from '@/components/ContactForm';

export default function AiAgentsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroStats = ['Avg handle time: -38%', 'CSAT: +21%', 'Leads qualified: +44%', 'Ops cost per ticket: -27%'];

  const capabilities = [
    {
      icon: Bot,
      title: 'Autonomous & assisted agents',
      text: 'Run fully autonomous flows or co-pilot mode with approvals and handoffs.',
      bullets: ['Human-in-the-loop approvals', 'Escalations to owners', 'Action audit trail'],
    },
    {
      icon: Plug,
      title: 'Tools & integrations',
      text: 'Agents call tools to read/write data across your stack and trigger workflows.',
      bullets: ['Native SaaS connectors', 'HTTP/Webhook tools', 'Read/write with safeguards'],
    },
    {
      icon: Brain,
      title: 'RAG & knowledge',
      text: 'Ground agents in your private docs, FAQs, CRM, and project context.',
      bullets: ['Embeddings + vector search', 'Document chunking', 'Freshness/policy filters'],
    },
    {
      icon: Shield,
      title: 'Guardrails & policy',
      text: 'Role-aware prompts, constrained outputs, PII redaction, rate limits.',
      bullets: ['RBAC-scoped context', 'Schema-validated outputs', 'PII scrubbing'],
    },
    {
      icon: GitBranch,
      title: 'Orchestration',
      text: 'Multi-step plans with branching logic, retries, and fallbacks.',
      bullets: ['DAG builder', 'Time/event triggers', 'Circuit breakers'],
    },
    {
      icon: Activity,
      title: 'Monitoring & evals',
      text: 'Track quality, latency, and cost. Run offline evals before rollout.',
      bullets: ['Scorecards & sampling', 'Regression tests', 'A/B and shadow runs'],
    },
  ];

  const playbooks = [
    {
      icon: MessageSquare,
      title: 'L1 support agent',
      desc: 'Resolves common tickets, drafts replies, and escalates with a full context bundle.',
      steps: ['Detect intent & pull KB', 'Summarize history', 'Draft answer with sources', 'Create/close task'],
      impact: 'AHT -35%, CSAT +18%',
    },
    {
      icon: BarChart3,
      title: 'Revenue assistant',
      desc: 'Qualifies inbound leads, enriches accounts, and creates opportunities.',
      steps: ['Parse lead', 'Enrich via tools', 'Score & route', 'Create opportunity'],
      impact: 'Lead response +2.3x',
    },
    {
      icon: Code2,
      title: 'Delivery co-pilot',
      desc: 'Keeps projects on track with risk flags, check-ins, and automated summaries.',
      steps: ['Check project signals', 'Detect risks/anomalies', 'Post updates', 'Open actions'],
      impact: 'On-time delivery +24%',
    },
  ];

  const faq = [
    { q: 'Can we keep agents constrained to read-only?', a: 'Yes. Tools are permissioned per role and can be set to read-only or sandboxed write with approval gates.' },
    { q: 'How do agents avoid hallucinations?', a: 'RAG with source grounding, schema validation, and policy prompts. We also offer offline evals and shadow runs pre-launch.' },
    { q: 'Which models are supported?', a: 'We support multiple LLM providers and isolate prompts/keys per workspace. You can choose models per agent.' },
    { q: 'How are costs controlled?', a: 'Budgets and rate limits per agent, plus observability on tokens, latency, and tool calls.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-10 pb-16 px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm font-medium">AI Agents for ops, revenue, and support</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Ship reliable AI agents fast</h1>
              <p className="text-xl text-gray-600">
                Liderix agents connect to your tools, follow policy guardrails, and deliver measurable outcomes — with full observability.
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
                  <h3 className="text-2xl font-bold mb-2">Agent control panel</h3>
                  <p className="text-blue-200">Status • Quality • Cost</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {heroStats.map((s, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="text-white/80 text-sm">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">One-click rollout</p>
                    <p className="text-lg font-bold">Shadow → A/B → Full</p>
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
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What agents can do</h2>
            <p className="text-xl text-gray-600">Tool-calling, grounding, guardrails, and observability — built in</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((c, i) => {
              const Icon = c.icon;
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

      {/* Playbooks */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-2">Proven playbooks</h2>
            <p className="text-xl text-gray-600">Start fast with ready patterns — customize as you go</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {playbooks.map((p, i) => {
              const Icon = p.icon as any;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="text-gray-600 mt-2 mb-4">{p.desc}</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {p.steps.map((s, j) => (
                      <li key={j} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-sm text-blue-700 bg-blue-100 inline-flex px-2 py-1 rounded-full">{p.impact}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Observability */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-3">Quality, latency, and cost — at a glance</h3>
              <p className="text-gray-600 mb-4">
                Sample and score outputs, track token spend, and catch regressions before they hit production.
              </p>
              <ul className="space-y-2 text-gray-700">
                {['Offline evals & golden sets', 'Live sampling & annotations', 'Token/latency budgets', 'Drift alerts & rollback'].map((b) => (
                  <li key={b} className="flex items-start">
                    <Check className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-bold mb-3">Orchestrate multi-tool agents</h3>
              <p className="text-blue-100 mb-4">Define tool chains with retries, fallbacks, and approvals where needed.</p>
              <ul className="space-y-2">
                {['HTTP → CRM → Email reply', 'Docs search → Summarize → Ticket update', 'Logs scan → Risk flag → PM post'].map((b) => (
                  <li key={b} className="flex items-start">
                    <Check className="w-5 h-5 text-white mr-2 mt-0.5" />
                    <span className="text-blue-100">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Pilot an agent in your environment</h2>
          <p className="text-xl text-gray-600 mb-8">Start with a sandbox, then graduate to shadow runs and A/B.</p>
          <a
            href="#lead-demo"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Request a demo
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
      <section id="lead-access" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <LeadForm type="access" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-xl text-gray-600">AI agents, guardrails, and rollout</p>
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
            <p className="text-xl text-gray-600">We’ll help design an agent that fits your policies & stack</p>
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