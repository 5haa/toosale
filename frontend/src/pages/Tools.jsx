import React from 'react';
import { Link } from 'react-router-dom';

const Tools = () => {
  const toolCategories = [
    {
      title: 'Store Management',
      description: 'Powerful tools to manage your online store efficiently',
      tools: [
        {
          name: 'Store Builder',
          description: 'Drag-and-drop store builder with professional themes',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        },
        {
          name: 'Product Importer',
          description: 'Bulk import products with one-click from suppliers',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          )
        },
        {
          name: 'Inventory Sync',
          description: 'Real-time inventory synchronization with suppliers',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Marketing & Sales',
      description: 'Drive traffic and increase sales with built-in marketing tools',
      tools: [
        {
          name: 'SEO Optimizer',
          description: 'Optimize your store for search engines automatically',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )
        },
        {
          name: 'Email Campaigns',
          description: 'Create and send targeted email marketing campaigns',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )
        },
        {
          name: 'Social Media Integration',
          description: 'Connect and sell on Facebook, Instagram, and more',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Analytics & Insights',
      description: 'Make data-driven decisions with powerful analytics',
      tools: [
        {
          name: 'Sales Dashboard',
          description: 'Real-time sales tracking and performance metrics',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        {
          name: 'Customer Analytics',
          description: 'Understand your customers and their behavior',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )
        },
        {
          name: 'Profit Calculator',
          description: 'Calculate margins and profits for each product',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Order Management',
      description: 'Streamline order processing and fulfillment',
      tools: [
        {
          name: 'Auto Order Processing',
          description: 'Automatically process orders with suppliers',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          )
        },
        {
          name: 'Tracking Updates',
          description: 'Automatic tracking number updates for customers',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        },
        {
          name: 'Returns Management',
          description: 'Handle returns and refunds efficiently',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          )
        }
      ]
    }
  ];

  const features = [
    {
      title: 'All-in-One Platform',
      description: 'Everything you need to run your business in one place',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: 'Easy to Use',
      description: 'Intuitive interface designed for users of all skill levels',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: 'Mobile Optimized',
      description: 'Manage your business on the go with our mobile app',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'API Integration',
      description: 'Connect with third-party tools and services via API',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const integrations = [
    {
      name: 'Facebook',
      description: 'Sync your products with Facebook Shop',
      logo: '📘'
    },
    {
      name: 'Instagram',
      description: 'Sell directly on Instagram Shopping',
      logo: '📷'
    },
    {
      name: 'Google Ads',
      description: 'Create and manage Google Shopping campaigns',
      logo: '🔍'
    },
    {
      name: 'Shopify',
      description: 'Import existing Shopify stores',
      logo: '🛍️'
    },
    {
      name: 'WooCommerce',
      description: 'Connect your WordPress store',
      logo: '📝'
    },
    {
      name: 'eBay',
      description: 'List products on eBay marketplace',
      logo: '🏪'
    },
    {
      name: 'Amazon',
      description: 'Sync with Amazon FBA',
      logo: '📦'
    },
    {
      name: 'PayPal',
      description: 'Accept payments via PayPal',
      logo: '💳'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-apple-gray-50 to-white py-20 lg:py-32">
        <div className="section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-apple-headline mb-6">
              Powerful Tools for Your Business
            </h1>
            <p className="text-apple-subheadline mb-8 max-w-2xl mx-auto">
              Everything you need to build, manage, and scale your dropshipping business. 
              From store creation to analytics, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn-apple text-lg px-8 py-4">
                Try Tools Free
              </Link>
              <Link to="/dropshipping" className="btn-apple-outline text-lg px-8 py-4">
                Learn Dropshipping
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Categories Section */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Complete Business Toolkit
            </h2>
            <p className="text-xl text-apple-gray-600">
              Professional tools designed to help you succeed in dropshipping.
            </p>
          </div>
          
          <div className="space-y-16">
            {toolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-apple-gray-800 mb-4">
                    {category.title}
                  </h3>
                  <p className="text-lg text-apple-gray-600 max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="bg-apple-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="w-12 h-12 bg-apple-blue rounded-xl flex items-center justify-center text-white mb-4">
                        {tool.icon}
                      </div>
                      <h4 className="text-xl font-semibold text-apple-gray-800 mb-3">
                        {tool.name}
                      </h4>
                      <p className="text-apple-gray-600">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-apple-gray-50">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Why Our Tools Stand Out
            </h2>
            <p className="text-xl text-apple-gray-600">
              Built by entrepreneurs, for entrepreneurs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-apple-blue rounded-xl flex items-center justify-center mx-auto mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-apple-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-apple-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-white">
        <div className="section-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-apple-gray-600">
              Connect with your favorite platforms and tools.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-apple-gray-50 rounded-xl p-4 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-3xl mb-3">{integration.logo}</div>
                <h4 className="font-semibold text-apple-gray-800 mb-2 text-sm">
                  {integration.name}
                </h4>
                <p className="text-xs text-apple-gray-600">
                  {integration.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-apple-gray-50">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-apple-gray-800 mb-6">
              See Our Tools in Action
            </h2>
            <p className="text-xl text-apple-gray-600 mb-8">
              Watch how easy it is to set up your store and start selling in minutes.
            </p>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-apple-blue to-blue-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Product Demo</h3>
                  <p className="text-lg opacity-90">See TooSale in action</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-apple px-6 py-3">
                    Watch Demo
                  </button>
                  <Link to="/signup" className="btn-apple-outline px-6 py-3">
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-apple-gray-800">
        <div className="section-padding text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your Business?
          </h2>
          <p className="text-xl text-apple-gray-300 mb-8 max-w-2xl mx-auto">
            Get access to all our powerful tools and start building your dropshipping empire today.
            No setup fees, no long-term contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-apple text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link to="/fees" className="btn-apple-outline text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-apple-gray-800">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tools;
