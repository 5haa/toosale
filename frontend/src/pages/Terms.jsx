import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-apple-gray-50 py-16">
        <div className="section-padding">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-apple-gray-800 mb-4">
              Terms of Service
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
                  Acceptance of Terms
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  By accessing and using TooSale's website and services, you accept and agree to be bound 
                  by the terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Use License
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  Permission is granted to temporarily download one copy of TooSale's materials for 
                  personal, non-commercial transitory viewing only. This is the grant of a license, 
                  not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  User Accounts
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  When you create an account with us, you must provide information that is accurate, 
                  complete, and current at all times. You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>Safeguarding your password and account information</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account information remains up to date</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Purchases and Payments
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  All purchases made through our platform are subject to the following terms:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>Prices are subject to change without notice</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Payment must be received before order processing</li>
                  <li>All sales are final unless otherwise stated</li>
                  <li>Shipping and handling charges are non-refundable</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Returns and Refunds
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  We want you to be satisfied with your purchase. Our return policy includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>30-day return window for most items</li>
                  <li>Items must be in original condition and packaging</li>
                  <li>Original receipt or proof of purchase required</li>
                  <li>Some items may be non-returnable (as specified at purchase)</li>
                  <li>Refunds processed within 5-7 business days of return receipt</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Prohibited Uses
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  You may not use our service:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-apple-gray-600">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Content and Intellectual Property
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  Our service and its original content, features, and functionality are and will remain 
                  the exclusive property of TooSale and its licensors. The service is protected by 
                  copyright, trademark, and other laws. Our trademarks and trade dress may not be used 
                  in connection with any product or service without our prior written consent.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Disclaimer
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  The information on this website is provided on an "as is" basis. To the fullest extent 
                  permitted by law, this company excludes all representations, warranties, conditions and 
                  terms whether express or implied, statutory or otherwise.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Limitations
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  In no event shall TooSale or its suppliers be liable for any damages (including, without 
                  limitation, damages for loss of data or profit, or due to business interruption) arising 
                  out of the use or inability to use TooSale's materials, even if TooSale or an authorized 
                  representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Governing Law
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  These terms and conditions are governed by and construed in accordance with the laws 
                  of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the 
                  courts in that state or location.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Changes to Terms
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any 
                  time. If a revision is material, we will try to provide at least 30 days notice prior 
                  to any new terms taking effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-apple-gray-800 mb-4">
                  Contact Information
                </h2>
                <p className="text-apple-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-apple-gray-50 p-6 rounded-xl">
                  <ul className="space-y-2 text-apple-gray-600">
                    <li><strong>Email:</strong> legal@toosale.com</li>
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

export default Terms;
