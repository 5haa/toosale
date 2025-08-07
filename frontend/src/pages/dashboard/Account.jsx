import React, { useState } from 'react';

const Account = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'TooSale Store',
    website: 'https://johndoe.toosale.com',
    bio: 'Passionate seller focused on quality products and excellent customer service.',
    avatar: null
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    weeklyReports: true,
    productAlerts: false,
    currency: 'USD',
    timezone: 'EST',
    language: 'English'
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to the backend
    console.log('Updating profile:', profile);
  };

  const handlePreferencesUpdate = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    // In a real app, this would automatically save to backend
    console.log('Updated preference:', key, value);
  };

  const handleSecurityUpdate = (key, value) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
    console.log('Updated security setting:', key, value);
  };

  const sessions = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: '2024-01-15 10:30 AM',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'New York, NY',
      lastActive: '2024-01-14 8:45 PM',
      current: false
    },
    {
      id: 3,
      device: 'Chrome on MacBook',
      location: 'Brooklyn, NY',
      lastActive: '2024-01-12 2:15 PM',
      current: false
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-apple-gray-900">Account Settings</h1>
        <p className="text-apple-gray-600 mt-2">Manage your account preferences and security settings</p>
      </div>

      {/* Profile Summary Card */}
      <div className="card-apple p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-20 h-20 bg-apple-blue rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {profile.firstName[0]}{profile.lastName[0]}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full border-2 border-apple-gray-300 flex items-center justify-center hover:bg-apple-gray-50">
              <svg className="w-3 h-3 text-apple-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-apple-gray-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-apple-gray-600">{profile.email}</p>
            <p className="text-apple-gray-600">{profile.company}</p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                Active
              </span>
              <span className="text-sm text-apple-gray-500">Member since Jan 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-apple mb-6">
        <div className="border-b border-apple-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 py-4">
            {[
              { id: 'profile', label: 'Profile' },
              { id: 'preferences', label: 'Preferences' },
              { id: 'security', label: 'Security' },
              { id: 'billing', label: 'Billing' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-apple-blue text-apple-blue'
                    : 'border-transparent text-apple-gray-500 hover:text-apple-gray-700 hover:border-apple-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Basic Information</h3>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                      className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      value={profile.website}
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                      className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">Bio</label>
                  <textarea
                    rows="4"
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                    placeholder="Tell us about yourself and your business..."
                  />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn-apple">
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Email Change Section */}
            <div className="border-t border-apple-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Email Address</h3>
              <div className="bg-apple-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-apple-gray-900">Current Email</p>
                    <p className="text-apple-gray-600">{profile.email}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">New Email Address</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                      placeholder="Enter new email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-apple-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                      placeholder="Enter current password to confirm"
                    />
                  </div>
                  <button type="submit" className="btn-apple">
                    Update Email Address
                  </button>
                  <p className="text-sm text-apple-gray-600">
                    A verification email will be sent to your new email address.
                  </p>
                </form>
              </div>
            </div>

            {/* Language Settings */}
            <div className="border-t border-apple-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Language & Region</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferencesUpdate('language', e.target.value)}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                    <option value="Italian">Italiano</option>
                    <option value="Portuguese">Português</option>
                    <option value="Dutch">Nederlands</option>
                    <option value="Japanese">日本語</option>
                    <option value="Korean">한국어</option>
                    <option value="Chinese">中文</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => handlePreferencesUpdate('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="CAD">CAD ($) - Canadian Dollar</option>
                    <option value="AUD">AUD ($) - Australian Dollar</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                    <option value="CHF">CHF - Swiss Franc</option>
                    <option value="CNY">CNY (¥) - Chinese Yuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => handlePreferencesUpdate('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                  >
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="CST">Central Time (CST)</option>
                    <option value="MST">Mountain Time (MST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                    <option value="CET">Central European Time (CET)</option>
                    <option value="JST">Japan Standard Time (JST)</option>
                    <option value="AEST">Australian Eastern Time (AEST)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="p-6 space-y-8">
            {/* Notifications */}
            <div>
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                  { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional emails and updates' },
                  { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about order status changes' },
                  { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly performance reports' },
                  { key: 'productAlerts', label: 'Product Alerts', description: 'Get alerts for product updates and issues' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-apple-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-apple-gray-900">{item.label}</p>
                      <p className="text-sm text-apple-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences[item.key]}
                        onChange={(e) => handlePreferencesUpdate(item.key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-apple-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apple-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apple-blue"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Display Settings */}
            <div>
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Display Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">Currency</label>
                  <select
                    value={preferences.currency}
                    onChange={(e) => handlePreferencesUpdate('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => handlePreferencesUpdate('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                  >
                    <option value="EST">Eastern (EST)</option>
                    <option value="CST">Central (CST)</option>
                    <option value="MST">Mountain (MST)</option>
                    <option value="PST">Pacific (PST)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-gray-700 mb-1">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferencesUpdate('language', e.target.value)}
                    className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-8">
            {/* Password */}
            <div>
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Password & Security</h3>
              <div className="bg-apple-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-medium text-apple-gray-900">Password</p>
                    <p className="text-sm text-apple-gray-600">Last changed 3 months ago</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="btn-apple bg-apple-gray-100 text-apple-gray-700 hover:bg-apple-gray-200"
                  >
                    Change Password
                  </button>
                </div>
                {showPasswordForm && (
                  <div className="mt-4 pt-4 border-t border-apple-gray-200">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                          placeholder="Enter your current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                          placeholder="Enter new password"
                        />
                        <p className="text-xs text-apple-gray-500 mt-1">
                          Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-apple-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-apple-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button type="submit" className="btn-apple">
                          Update Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPasswordForm(false)}
                          className="px-4 py-2 border border-apple-gray-300 rounded-lg text-apple-gray-700 hover:bg-apple-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div>
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="bg-apple-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-apple-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-apple-gray-600">
                      {security.twoFactorEnabled ? 'Enabled - Your account is protected' : 'Add an extra layer of security to your account'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={security.twoFactorEnabled}
                      onChange={(e) => handleSecurityUpdate('twoFactorEnabled', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-apple-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-apple-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-apple-blue"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div>
              <h3 className="text-lg font-semibold text-apple-gray-900 mb-4">Active Sessions</h3>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-apple-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-apple-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-apple-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-apple-gray-900">{session.device}</p>
                        <p className="text-sm text-apple-gray-600">{session.location} • {session.lastActive}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {session.current ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current Session
                        </span>
                      ) : (
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="p-6">
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-apple-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-medium text-apple-gray-900 mb-2">No Billing Information</h3>
              <p className="text-apple-gray-600 mb-6">You're currently on our free plan. Upgrade to access premium features.</p>
              <button className="btn-apple">
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
