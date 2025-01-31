import React, { useState } from 'react';
import { 
  Mail, 
  Shield, 
  Users, 
  Send, 
  Moon, 
  Sun, 
  ChevronRight,
  Terminal
} from 'lucide-react';
import { WavyBackground } from "@/components/ui/wavy-background";

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [email, setEmail] = useState('');
  const [template, setTemplate] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ type: '', message: '' });

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setResult({ type: 'error', message: '❌ Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setResult({ type: 'loading', message: 'Sending email...' });

    try {
      const response = await fetch('http://37.27.51.34:45701/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          template: template,
          templateData: {
            name: 'User'
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setResult({ type: 'success', message: '✅ Email sent successfully!' });
    } catch (error) {
      setResult({ type: 'error', message: '❌ ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navbar */}
      <nav className="fixed w-full backdrop-blur-lg bg-white/75 dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                <a href="https://github.com/souptik-samanta/Mail">EasyMailer</a>
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Security', 'Demo'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    activeTab === item.toLowerCase()
                      ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {item}
                </button>
              ))}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Wavy Background */}
      <WavyBackground className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto text-center px-4">
          <div className="animate-fade-in space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Automated Email Magic
              <span className="block mt-2">Simplified</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Enterprise-grade email automation with Node.js. Send templated emails, manage attachments,
              and handle bulk operations effortlessly.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-xl transform hover:scale-105 transition-transform border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <Terminal className="w-5 h-5 text-white" />
                <span className="text-white font-mono">Quick Start</span>
              </div>
              <pre className="text-gray-300 font-mono text-sm">
                <code>{`const mailer = new EasyMailer(
  process.env.EMAIL,
  process.env.PASSWORD
);`}</code>
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Mail className="w-5 h-5" />, text: 'Bulk Sending' },
                { icon: <Shield className="w-5 h-5" />, text: 'OAuth2 Ready' },
                { icon: <Users className="w-5 h-5" />, text: 'Templates' },
                { icon: <Send className="w-5 h-5" />, text: 'Analytics' },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center space-y-2 shadow-lg hover:shadow-xl transition-shadow border border-white/10"
                >
                  <div className="text-white">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </WavyBackground>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Try It Now
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Template
                  </label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="welcome">Welcome Email</option>
                    <option value="reset">Password Reset</option>
                    <option value="promo">Promotional</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                >
                  <span>{loading ? '🔄 Sending...' : '🚀 Send Test Email'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                {result.message && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    result.type === 'success' 
                      ? 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200' 
                      : result.type === 'error'
                      ? 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                      : 'bg-gray-50 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                  }`}>
                    {result.message}
                  </div>
                )}
              </form>
              <div className="bg-gray-900 rounded-xl p-6">
                <pre className="text-gray-300 font-mono text-sm overflow-x-auto">
                  <code>{`// Preview
const mailer = new EasyMailer(
  process.env.EMAIL,
  process.env.PASSWORD
);

// Prepare email data
const emailData = {
  to: '${email || 'user@example.com'}',
  templateName: '${template}',
  templateData: {
    name: 'User',
    company: 'EasyMailer'
  }
};

// Send email
try {
  const result = await mailer.sendEmail(emailData);
  console.log('Email sent:', result);
} catch (error) {
  console.error('Error:', error);
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}