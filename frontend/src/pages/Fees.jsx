import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Fees = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for beginners getting started',
      monthlyPrice: 0,
      yearlyPrice: 0,
      transactionFee: 5,
      features: [
        'Up to 25 products',
        'Basic store themes',
        'Standard shipping rates',
        'Email support',
        'Basic analytics',
        'SSL certificate included'
      ],
      limitations: [
        'Limited customization options',
        'Basic support only',
        'Standard processing speed'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Best for growing businesses',
      monthlyPrice: 29,
      yearlyPrice: 290,
      transactionFee: 3,
      features: [
        'Up to 1,000 products',
        'Premium store themes',
        'Discounted shipping rates',
        'Priority support',
        'Advanced analytics',
        'Marketing tools included',
        'Abandoned cart recovery',
        'Custom domain support',
        'Social media integration'
      ],
      limitations: [],
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large scale operations',
      monthlyPrice: 99,
      yearlyPrice: 990,
      transactionFee: 2,
      features: [
        'Unlimited products',
        'Custom store design',
        'Wholesale shipping rates',
        'Dedicated account manager',
        'Advanced analytics & reports',
        'API access',
        'White-label solution',
        'Multi-store management',
        'Advanced automation',
        'Custom integrations'
      ],
      limitations: [],
      popular: false
    }
  ];

  const additionalFees = [
    {
      category: 'Payment Processing',
      items: [
        {
          name: 'Credit Card Processing',
          fee: '2.9% + $0.30',
          description: 'Standard rate for all major credit cards'
        },
        {
          name: 'PayPal Processing',
          fee: '2.9% + $0.30',
          description: 'PayPal transaction processing fee'
        },
        {
          name: 'International Cards',
          fee: '3.4% + $0.30',
          description: 'For non-US issued credit cards'
        }
      ]
    },
    {
      category: 'Optional Services',
      items: [
        {
          name: 'Premium Support',
          fee: '$19/month',
          description: 'Phone support and faster response times'
        },
        {
          name: 'Custom Design',
          fee: '$299 one-time',
          description: 'Professional store design service'
        },
        {
          name: 'SEO Audit',
          fee: '$149 one-time',
          description: 'Comprehensive SEO analysis and recommendations'
        },
        {
          name: 'Marketing Setup',
          fee: '$99 one-time',
          description: 'Facebook & Google Ads account setup'
        }
      ]
    }
  ];

  const comparisonFeatures = [
    {
      feature: 'Products',
      starter: '25',
      professional: '1,000',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Storage',
      starter: '1 GB',
      professional: '10 GB',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Bandwidth',
      starter: '10 GB/month',
      professional: '100 GB/month',
      enterprise: 'Unlimited'
    },
    {
      feature: 'Store Themes',
      starter: 'Basic (3)',
      professional: 'Premium (25+)',
      enterprise: 'Custom Design'
    },
    {
      feature: 'Support',
      starter: 'Email Only',
      professional: 'Email + Chat',
      enterprise: 'Phone + Dedicated Manager'
    },
    {
      feature: 'Analytics',
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Enterprise + Custom Reports'
    },
    {
      feature: 'API Access',
      starter: '❌',
      professional: 'Limited',
      enterprise: 'Full Access'
    },
    {
      feature: 'White Label',
      starter: '❌',
      professional: '❌',
      enterprise: '✅'
    }
  ];

  const faqs = [
    {
      question: 'Are there any setup fees?',
      answer: 'No, there are no setup fees for any of our plans. You can start selling immediately after creating your store.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.'
    },
    {
      question: 'What happens if I exceed my product limit?',
      answer: 'You\'ll receive a notification to upgrade your plan. We provide a grace period to allow you to upgrade without any service interruption.'
    },
    {
      question: 'Are transaction fees charged on refunds?',
      answer: 'No, transaction fees are not charged on refunded orders. The original transaction fee is also refunded.'
    },
    {
      question: 'Do you offer discounts for annual billing?',
      answer: 'Yes, you save approximately 17% when you choose annual billing instead of monthly.'
    },
    {
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees. All costs are clearly outlined. You only pay the plan fee, transaction fees, and any optional services you choose.'
    }
  ];

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 0) return 'Free';
    return billingPeriod === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.yearlyPrice;
    return Math.round((savings / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-apple-gray-50 to-white py-20 lg:py-32">
        <div className="section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-apple-headline mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-apple-subheadline mb-8 max-w-2xl mx-auto">
              No hidden fees, no surprises. Choose the plan that fits your business size and grow as you scale.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 font-medium ${billingPeriod === 'monthly' ? 'text-apple-gray-900' : 'text-apple-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-apple-blue transition-colors focus:outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-2"
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className={`ml-3 font-medium ${billingPeriod === 'yearly' ? 'text-apple-gray-900' : 'text-apple-gray-500'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <span className="ml-3 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  Save up to 17%
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
                plan.popular ? 'border-apple-blue' : 'border-apple-gray-200'
              }`}>
                {plan.popular && (
                  <div className="bg-apple-blue text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-apple-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-apple-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-apple-gray-800">
                        ${getPrice(plan)}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-apple-gray-600 ml-2">
                          /{billingPeriod === 'monthly' ? 'month' : 'month'}
                        </span>
                      )}
                    </div>
                    {billingPeriod === 'yearly' && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        Save {getSavings(plan)}% with annual billing
                      </p>
                    )}
                    <p className="text-sm text-apple-gray-600 mt-2">
                      + {plan.transactionFee}% transaction fee
                    </p>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-semibold text-apple-gray-800 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-apple-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-apple-blue text-white hover:bg-blue-700' 
                      : 'bg-apple-gray-100 text-apple-gray-800 hover:bg-apple-gray-200'
                  }`}>
                    {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Fees */}
      <section className="py-20 bg-apple-gray-50">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
                Additional Fees
              </h2>
              <p className="text-xl text-apple-gray-600">
                Complete breakdown of all potential costs.
              </p>
            </div>

            <div className="space-y-12">
              {additionalFees.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-2xl font-bold text-apple-gray-800 mb-6">
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-apple-gray-800">{item.name}</h4>
                          <span className="text-lg font-bold text-apple-blue">{item.fee}</span>
                        </div>
                        <p className="text-apple-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
                Compare Features
              </h2>
              <p className="text-xl text-apple-gray-600">
                Detailed comparison of what's included in each plan.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-apple-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-apple-gray-800">Feature</th>
                    <th className="text-center py-4 px-6 font-semibold text-apple-gray-800">Starter</th>
                    <th className="text-center py-4 px-6 font-semibold text-apple-gray-800">Professional</th>
                    <th className="text-center py-4 px-6 font-semibold text-apple-gray-800">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, index) => (
                    <tr key={index} className="border-b border-apple-gray-100">
                      <td className="py-4 px-6 font-medium text-apple-gray-800">{row.feature}</td>
                      <td className="py-4 px-6 text-center text-apple-gray-600">{row.starter}</td>
                      <td className="py-4 px-6 text-center text-apple-gray-600">{row.professional}</td>
                      <td className="py-4 px-6 text-center text-apple-gray-600">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-apple-gray-50">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-apple-gray-600">
                Everything you need to know about our pricing.
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-apple-gray-800 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-apple-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-apple-gray-800">
        <div className="section-padding text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-apple-gray-300 mb-8 max-w-2xl mx-auto">
            Start your free trial today. No credit card required, no setup fees.
            Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-apple text-lg px-8 py-4">
              Start Free Trial
            </Link>
            <Link to="/tools" className="btn-apple-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-apple-gray-800">
              Explore Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Fees;
