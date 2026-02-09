/**
 * Landing Page - Public facing page for Integrity AI
 */
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Code2, Users, Brain, Shield } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Code2 className="w-12 h-12 text-purple-400 mr-3" />
            <h1 className="text-5xl font-bold text-white">Integrity AI</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered technical interview platform that provides comprehensive candidate evaluation 
            with real-time coding challenges and intelligent assessment.
          </p>
        </header>

        {/* CTA Section */}
        <section className="text-center mb-20">
          <div className="space-y-4">
            <div className="space-x-4">
              <Link to="/register">
                <Button size="lg" variant="primary" className="px-8 py-3">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-gray-400">
              Join thousands of companies conducting better technical interviews
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Code2 className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Real-time Coding</h3>
            <p className="text-gray-400">
              Live code editor with 50+ programming languages and instant execution
            </p>
          </div>

          <div className="text-center">
            <div className="bg-blue-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI Evaluation</h3>
            <p className="text-gray-400">
              Advanced AI agents analyze coding skills, communication, and problem-solving
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Video Interviews</h3>
            <p className="text-gray-400">
              HD video streaming with real-time collaboration and screen sharing
            </p>
          </div>

          <div className="text-center">
            <div className="bg-red-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
            <p className="text-gray-400">
              Enterprise-grade security with encrypted sessions and data protection
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="text-center mb-20">
          <h2 className="text-3xl font-bold text-white mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="bg-purple-500/20 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                <span className="text-purple-400 font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Create Session</h3>
              <p className="text-gray-400">
                Set up interview parameters and invite candidates with a unique session code
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-500/20 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                <span className="text-purple-400 font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Conduct Interview</h3>
              <p className="text-gray-400">
                Real-time coding challenges with video communication and AI assistance
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-500/20 rounded-full w-12 h-12 mx-auto flex items-center justify-center">
                <span className="text-purple-400 font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Get Results</h3>
              <p className="text-gray-400">
                Comprehensive evaluation reports with detailed insights and recommendations
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 pt-8 border-t border-gray-700">
          <p>&copy; 2024 Integrity AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
