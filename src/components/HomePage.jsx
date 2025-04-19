import { useNavigate } from 'react-router-dom';
import { Map, MessageSquare, Shield, ShieldCheck } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Transform Your</span>
                  <span className="block text-yellow-600">Supply Chain Management</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Streamline your operations, enhance collaboration, and optimize delivery routes with our comprehensive blockchain solution.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => navigate('/admin/signup')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 md:py-4 md:text-lg md:px-10"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        {/* Dashboard Visualization */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10"></div>
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative w-full max-w-md aspect-[4/3] overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl group hover:border-yellow-500/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 group-hover:from-yellow-500/20 group-hover:to-yellow-600/20 transition-all duration-300"></div>
                
                {/* Dashboard Content */}
                <div className="absolute inset-0 flex flex-col p-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                      <span className="text-xs text-gray-400">Live Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                      <span className="text-xs text-gray-400">Connected</span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    {/* Left Column */}
                    <div className="space-y-4">
                      {/* Stats Card */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-400">Active Shipments</span>
                          <span className="text-xs text-yellow-400">+24%</span>
                        </div>
                        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full animate-pulse" style={{ width: "70%" }}></div>
                        </div>
                      </div>

                      {/* Map Preview */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Map className="h-4 w-4 text-yellow-400" />
                          <span className="text-xs text-gray-400">Global Coverage</span>
                        </div>
                        <div className="relative h-24 bg-gray-900/50 rounded overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-yellow-500/30 animate-ping"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-400"></div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {/* Activity Feed */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-yellow-400" />
                          <span className="text-xs text-gray-400">Recent Activity</span>
                        </div>
                        <div className="space-y-2">
                          {[
                            { text: "New shipment created", time: "2m ago" },
                            { text: "Route optimized", time: "5m ago" },
                            { text: "Product verified", time: "10m ago" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300">{item.text}</span>
                              <span className="text-gray-500">{item.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Blockchain Status */}
                      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-yellow-400" />
                          <span className="text-xs text-gray-400">Blockchain Status</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                          <span className="text-xs text-gray-300">Verified & Secure</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <span>Last updated: Just now</span>
                    <span>v1.0.0</span>
                  </div>
                </div>

                {/* Floating UI elements */}
                <div className="absolute top-4 right-4 bg-gray-800/80 backdrop-blur-sm rounded-lg p-2 border border-gray-700/50 animate-pulse">
                  <ShieldCheck className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="absolute bottom-4 left-4 bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-gray-700/50 text-sm text-gray-300">
                  Blockchain Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Better Supply Chain Management
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to manage your supply chain operations with blockchain technology.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Blockchain Integration */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Blockchain Integration</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Secure and transparent tracking of products with blockchain verification and smart contracts.
                </p>
              </div>

              {/* Real-time Tracking */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Tracking</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Track shipments in real-time with instant status updates and location monitoring.
                </p>
              </div>

              {/* Route Optimization */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Route Optimization</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  AI-powered route optimization to reduce delivery times and transportation costs.
                </p>
              </div>

              {/* Role-based Dashboards */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Role-based Access</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Specialized dashboards for manufacturers, suppliers, distributors, and retailers.
                </p>
              </div>

              {/* Inventory Management */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Inventory Management</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Automated inventory tracking, reordering, and warehouse management system.
                </p>
              </div>

              {/* Real-time Communication */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Real-time Chat</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Integrated chat system for seamless communication between all stakeholders.
                </p>
              </div>

              {/* Smart Contracts */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Smart Contracts</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Automated contract execution and verification using blockchain technology.
                </p>
              </div>

              {/* Analytics Dashboard */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Analytics & Reports</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Comprehensive analytics and reporting tools for data-driven decisions.
                </p>
              </div>

              {/* Product Verification */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-yellow-500 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Product Verification</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Verify product authenticity and track complete chain of custody.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-yellow-600">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple and Efficient Process
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our blockchain-powered platform simplifies supply chain management in just a few steps
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600">
                  <span className="text-lg font-semibold text-white">1</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Register & Connect</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Create your account and connect with your supply chain partners through our secure platform.
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="relative">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600">
                  <span className="text-lg font-semibold text-white">2</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Track & Monitor</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Monitor shipments, inventory, and transactions in real-time with blockchain verification.
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="relative">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600">
                  <span className="text-lg font-semibold text-white">3</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg font-semibold text-gray-900">Optimize & Scale</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Use AI-powered insights to optimize routes and scale your operations efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-yellow-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Stay updated with supply chain insights
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Subscribe to our newsletter for the latest updates, industry trends, and expert tips.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <div className="min-w-0 flex-auto">
                <input
                  type="email"
                  className="block w-full rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="rounded-md bg-yellow-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-yellow-600">Join Nexus Chain today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Get started
              </button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <button
                onClick={() => navigate('/chat')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-yellow-600 bg-white hover:bg-yellow-50"
              >
                Chat Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 