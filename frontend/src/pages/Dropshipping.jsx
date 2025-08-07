import React from 'react';
import { Link } from 'react-router-dom';

const Dropshipping = () => {
  const steps = [
    {
      number: '01',
      title: 'Set Up Your Store',
      description: 'Create your TooSale store in minutes with our easy setup wizard',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Choose Products',
      description: 'Browse our catalog of 100,000+ products and add them to your store',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Market & Sell',
      description: 'Use our marketing tools to promote your products and drive sales',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'We Handle Everything',
      description: 'We process orders, handle shipping, and manage customer service',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    }
  ];

  const benefits = [
    {
      title: 'No Inventory Required',
      description: 'Start selling without investing in inventory or warehouse space',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: 'Low Startup Costs',
      description: 'Get started with minimal upfront investment and monthly fees',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Automated Processing',
      description: 'Orders are automatically processed and shipped to your customers',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      title: 'Global Suppliers',
      description: 'Access to verified suppliers worldwide with quality products',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Marketing Tools',
      description: 'Built-in tools to help you market and grow your business',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: '24/7 Support',
      description: 'Get help when you need it with our dedicated support team',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 25 products',
        'Basic store customization',
        'Standard shipping rates',
        'Email support',
        '5% transaction fee'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'Best for growing businesses',
      features: [
        'Up to 1,000 products',
        'Advanced store customization',
        'Discounted shipping rates',
        'Priority support',
        '3% transaction fee',
        'Marketing tools included'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'per month',
      description: 'For large scale operations',
      features: [
        'Unlimited products',
        'Custom branding',
        'Wholesale shipping rates',
        'Dedicated account manager',
        '2% transaction fee',
        'Advanced analytics',
        'API access'
      ],
      popular: false
    }
  ];

  const stats = [
    { label: 'Active Dropshippers', value: '15,000+' },
    { label: 'Products Available', value: '100K+' },
    { label: 'Orders Processed', value: '2M+' },
    { label: 'Average Monthly Profit', value: '$2,500' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-apple-gray-50 to-white py-20 lg:py-32">
        <div className="section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-apple-headline mb-6">
              Start Your Dropshipping Business Today
            </h1>
            <p className="text-apple-subheadline mb-8 max-w-2xl mx-auto">
              Build a profitable online business without inventory. Access 100,000+ products, 
              automated order processing, and powerful tools to grow your store.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-apple text-lg px-8 py-4">
                Start Free Trial
              </Link>
              <Link to="/tools" className="btn-apple-outline text-lg px-8 py-4">
                Explore Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-apple-gray-200">
        <div className="section-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl lg:text-4xl font-bold text-apple-blue mb-2">
                  {stat.value}
                </div>
                <div className="text-apple-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-apple-gray-50">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              How Dropshipping Works
            </h2>
            <p className="text-xl text-apple-gray-600">
              Get your business up and running in just 4 simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-apple-blue rounded-xl flex items-center justify-center mx-auto text-white">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-apple-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-apple-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-apple-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Why Choose TooSale for Dropshipping?
            </h2>
            <p className="text-xl text-apple-gray-600 max-w-2xl mx-auto">
              We provide everything you need to build a successful dropshipping business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-apple-blue rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-apple-gray-800 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-apple-gray-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-apple-gray-50">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-apple-gray-600">
              Start free and scale as your business grows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${plan.popular ? 'ring-2 ring-apple-blue' : ''}`}>
                {plan.popular && (
                  <div className="bg-apple-blue text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-apple-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-apple-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-apple-gray-800">{plan.price}</span>
                    <span className="text-apple-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-apple-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 px-6 rounded-xl font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-apple-blue text-white hover:bg-blue-700' 
                      : 'bg-apple-gray-100 text-apple-gray-800 hover:bg-apple-gray-200'
                  }`}>
                    {plan.price === 'Free' ? 'Get Started' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-apple-gray-800">
        <div className="section-padding text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Dropshipping Journey?
          </h2>
          <p className="text-xl text-apple-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful entrepreneurs who've built profitable businesses with TooSale.
            Start your free trial today - no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-apple text-lg px-8 py-4">
              Start Free Trial
            </Link>
            <Link to="/products" className="btn-apple-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-apple-gray-800">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dropshipping;
