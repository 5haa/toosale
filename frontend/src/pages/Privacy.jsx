import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-apple-gray-50 py-16">
        <div className="section-padding">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-apple-gray-600 max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Information We Collect
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  make a purchase, sign up for our newsletter, or contact us for support.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Payment information (credit card details, billing address)</li>
                  <li>Account information (username, password, preferences)</li>
                  <li>Communication records (support tickets, feedback)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>Process transactions and send you order confirmations</li>
                  <li>Provide customer service and support</li>
                  <li>Send you technical notices and security alerts</li>
                  <li>Communicate about products, services, and promotional offers</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Information Sharing
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>Service providers who assist us in operating our website and conducting business</li>
                  <li>Payment processors for transaction processing</li>
                  <li>Legal authorities when required by law or to protect our rights</li>
                  <li>Business transfers in case of merger, acquisition, or asset sale</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Data Security
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. These include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure data storage with access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Employee training on data protection</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Your Rights
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request data portability</li>
                  <li>File a complaint with regulatory authorities</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Cookies and Tracking
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience, 
                  analyze website traffic, and understand where our visitors are coming from. You can 
                  control cookie settings through your browser preferences.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Children's Privacy
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  Our services are not intended for children under 13 years of age. We do not knowingly 
                  collect personal information from children under 13. If you become aware that a child 
                  has provided us with personal information, please contact us immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                  We encourage you to review this Privacy Policy periodically.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Contact Us
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-apple-gray-50 p-6 rounded-xl">
                  <ul className="space-y-2 text-apple-gray-600">
                    <li><strong>Email:</strong> privacy@toosale.com</li>
                    <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                    <li><strong>Address:</strong> 123 Business Ave, Suite 100, City, State 12345</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12 pt-8 border-t border-apple-gray-200 text-center">
              <Link 
                to="/" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-apple-blue hover:bg-blue-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
