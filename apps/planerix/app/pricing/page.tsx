'use client';
import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Award,
  BarChart3,
  Database,
  Lock,
  Globe,
  Mail,
} from 'lucide-react';
import LeadForm from '@/components/LeadForm';
import ContactForm from '@/components/ContactForm';

type Billing = 'monthly' | 'yearly';

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const nf = useMemo(
    () => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }),
    []
  );

  const baseMonthly = {
    Starter: 0,
    Team: 1900,
    Premium: 4900,
  };

  const priceLabel = (plan: keyof typeof baseMonthly) => {
    if (billing === 'monthly') {
      return `${nf.format(baseMonthly[plan])} / mo`;
    }
    // Yearly: 20% off → billed annually, show effective monthly
    const eff = Math.round(baseMonthly[plan] * 0.8);
    return `${nf.format(eff)} / mo • billed yearly`;
  };

  const priceBadge = billing === 'yearly' ? 'Save 20% annually' : 'Flexible monthly';

  const plans = [
    {
      name: 'Starter',
      popular: false,
      color: 'from-blue-500 to-indigo-600',
      features: [
        'Up to 5 users',
        'OKR & Tasks modules',
        '1 GB storage',
        'Email support',
        'Core integrations',
      ],
      ctaText: 'Start for free',
      ctaHref: 'https://app.planerix.com/register?plan=starter',
      footnote: 'No credit card required',
    },
    {
      name: 'Team',
      popular: true,
      color: 'from-blue-600 to-indigo-700',
      features: [
        'Up to 50 users',
        'All essential modules',
        '100 GB storage',
        'Priority support',
        'Basic AI analytics',
        'API access',
      ],
      ctaText: 'Start 14-day trial',
      ctaHref: 'https://app.planerix.com/register?plan=team',
      footnote: 'Cancel anytime',
    },
    {
      name: 'Premium',
      popular: false,
      color: 'from-indigo-600 to-violet-700',
      features: [
        'Unlimited users',
        'All modules + customization',
        'Unlimited storage',
        'Dedicated success manager',
        'Advanced AI analytics',
        'White-label option',
      ],
      ctaText: 'Contact sales',
      ctaHref: '#lead-sales',
      footnote: 'Tailored enterprise rollout',
    },
  ] as const;

  type MatrixCell = boolean | 'basic' | 'advanced' | 'limited' | '—';

  const matrix: Array<{
    feature: string;
    starter: MatrixCell;
    team: MatrixCell;
    premium: MatrixCell;
    note?: string;
  }> = [
    { feature: 'OKR & Strategy', starter: true, team: true, premium: true },
    { feature: 'Projects & Tasks', starter: true, team: true, premium: true },
    { feature: 'CRM & Sales', starter: false, team: true, premium: true },
    { feature: 'People & HR', starter: false, team: true, premium: true },
    { feature: 'Finance & Budgets', starter: false, team: true, premium: true },
    { feature: 'Automation (rules & triggers)', starter: false, team: true, premium: true },
    { feature: 'Integrations (core connectors)', starter: true, team: true, premium: true },
    { feature: 'API access', starter: false, team: true, premium: true },
    { feature: 'AI analytics', starter: false, team: 'basic', premium: 'advanced' },
    { feature: 'SSO/SAML', starter: false, team: false, premium: true },
    { feature: 'SCIM provisioning', starter: false, team: false, premium: true },
    { feature: 'Audit logs', starter: false, team: false, premium: true },
    { feature: 'EU data residency', starter: false, team: true, premium: true },
    { feature: 'White-label', starter: false, team: false, premium: true },
    { feature: 'Uptime SLA (99.9%)', starter: false, team: true, premium: true },
    { feature: 'Dedicated success manager', starter: false, team: false, premium: true },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Enterprise-grade security',
      text: 'Defense-in-depth: RBAC, encryption in transit/at rest, audit trails, and least-privilege scopes.',
    },
    {
      icon: Globe,
      title: 'EU data residency',
      text: 'Keep your data in the EU. Backups are encrypted and stay in-region.',
    },
    {
      icon: Zap,
      title: 'Automation built-in',
      text: 'Rules, schedules, approvals, and observable runs — cut toil and speed up delivery.',
    },
    {
      icon: BarChart3,
      title: 'Unified analytics',
      text: 'AI-powered insights across goals, projects, CRM, HR, and finance. See impact in one place.',
    },
    {
      icon: Users,
      title: 'Faster adoption',
      text: 'Opinionated defaults, templates, and check-ins drive consistency without heavy change management.',
    },
    {
      icon: Award,
      title: 'Proven outcomes',
      text: 'Customers report +30% release cadence, +12% win rate, and -22% month-end close time.',
    },
  ];

  const stats = [
    { value: '99.9%', label: 'SLA uptime' },
    { value: '24/7', label: 'Monitoring' },
    { value: 'EU/US', label: 'Regions' },
    { value: '2.1M+', label: 'Jobs/day capacity' },
  ];

  const faqs = [
    {
      q: 'What’s included in the 14-day Team trial?',
      a: 'All Team features, including core modules, API access, automation, and basic AI analytics — no credit card required.',
    },
    {
      q: 'How does yearly billing work?',
      a: 'Yearly plans are billed upfront with a 20% discount. The price shown is the effective monthly rate when billed annually.',
    },
    { q: 'Can we switch plans later?', a: 'Yes. Upgrade or downgrade anytime; changes pro-rate to the next billing cycle.' },
    { q: 'Do prices include VAT?', a: 'Prices are shown excl. VAT. VAT is added where applicable based on your billing country.' },
    {
      q: 'Do you offer volume discounts?',
      a: 'Yes. For larger seat counts or multi-year commitments, contact sales for tailored pricing.',
    },
  ];

  const renderCell = (v: MatrixCell) => {
    if (v === true) return <Check className="w-5 h-5 text-blue-600" />;
    if (v === false || v === '—') return <span className="text-gray-400">—</span>;
    const label = v === 'basic' ? 'Basic' : v === 'advanced' ? 'Advanced' : 'Limited';
    const tone =
      v === 'basic' ? 'text-blue-700 bg-blue-100' : v === 'advanced' ? 'text-indigo-700 bg-indigo-100' : 'text-gray-700 bg-gray-100';
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tone}`}>{label}</span>;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero with billing toggle */}
      <section className="pt-10 pb-16 px-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
              <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-800 text-sm font-medium">Transparent pricing — scale with confidence</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">Pricing that grows with you</h1>
            <p className="text-xl text-gray-600 mt-4">
              Choose a plan and get started today. Switch anytime. No hidden fees.
            </p>
            <div className="mt-8 inline-flex items-center bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-6 py-2 rounded-md font-medium ${billing === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-6 py-2 rounded-md font-medium ${billing === 'yearly' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
              >
                Yearly (-20%)
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3">{priceBadge}</p>
          </div>

          {/* Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`bg-white rounded-2xl shadow-lg p-8 relative transform hover:scale-[1.02] transition-transform ${
                  p.popular ? 'border-2 border-blue-500' : ''
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
                <p className="text-4xl font-extrabold mt-2">{priceLabel(p.name as keyof typeof baseMonthly)}</p>
                <p className="text-gray-600 text-sm mt-1">Excl. VAT</p>
                <ul className="space-y-3 mt-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start">
                      <Check className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={p.ctaHref}
                  className={`mt-8 block w-full text-center py-3 rounded-lg font-medium transition-all duration-300 ${
                    p.popular
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
                      : 'border-2 border-gray-300 hover:border-gray-400 text-gray-900'
                  }`}
                >
                  {p.ctaText}
                </a>
                <p className="text-xs text-gray-500 mt-3">{p.footnote}</p>
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="mt-16">
            <p className="text-center text-gray-500 mb-8">Trusted by teams that value speed and control</p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Spotify'].map((c) => (
                <div key={c} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <BarChart3 className="w-12 h-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why teams choose Liderix</h2>
            <p className="text-xl text-gray-600">Deliver results faster — with security and governance built-in</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, i) => {
              const Icon = b.icon as any;
              return (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{b.title}</h3>
                  <p className="text-gray-600">{b.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature comparison matrix */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Compare plans</h2>
            <p className="text-gray-600">Everything you need to scale — pick the level of control you require</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-2xl shadow-lg">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-6 py-4 font-semibold">Capability</th>
                  <th className="px-6 py-4 font-semibold">Starter</th>
                  <th className="px-6 py-4 font-semibold">Team</th>
                  <th className="px-6 py-4 font-semibold">Premium</th>
                </tr>
              </thead>
              <tbody>
                {matrix.map((r, i) => (
                  <tr key={i} className="border-t last:border-b-0">
                    <td className="px-6 py-4">{r.feature}</td>
                    <td className="px-6 py-4">{renderCell(r.starter)}</td>
                    <td className="px-6 py-4">{renderCell(r.team)}</td>
                    <td className="px-6 py-4">{renderCell(r.premium)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <a
              href="#lead-sales"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Talk to sales
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* ROI & Guarantees */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl font-extrabold">{s.value}</div>
                <div className="text-blue-100 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-white" />
                <h3 className="font-bold">14-day Team trial</h3>
              </div>
              <p className="text-blue-100 text-sm">Explore core modules, automation, and API with no commitment.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-6 h-6 text-white" />
                <h3 className="font-bold">Security-first</h3>
              </div>
              <p className="text-blue-100 text-sm">RBAC, audit logs, SSO/SAML, SCIM (Premium), and in-region backups.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-white" />
                <h3 className="font-bold">Dedicated onboarding</h3>
              </div>
              <p className="text-blue-100 text-sm">For Premium, we tailor rollout, training, and success metrics with you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lead: sales & connection */}
      <section id="lead-sales" className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <LeadForm type="connection" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-xl text-gray-600">Billing, trials, and plan details</p>
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
            <h2 className="text-4xl font-bold mb-4">Still have questions?</h2>
            <p className="text-xl text-gray-600">We’ll help you choose the right plan and rollout</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact details</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  Email: hello@planerix.com
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  Phone: +48 12 345 67 89
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  Office: ul. Przykładowa 123, Kraków, Poland
                </li>
              </ul>
              <div className="mt-6 text-sm text-gray-600">
                <p>• Prices excl. VAT. VAT added where applicable.</p>
                <p>• Cancel or change plan anytime.</p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}