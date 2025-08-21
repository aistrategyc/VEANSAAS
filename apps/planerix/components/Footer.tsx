import React from 'react';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 mt-20">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-300 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gray-900" />
              </div>
              <span className="text-xl font-bold text-white">Liderix</span>
            </div>
            <p className="text-sm">The operating system for modern business. Manage smarter.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/modules" className="hover:text-white transition-colors">Modules</Link></li>
              <li><Link href="/platform" className="hover:text-white transition-colors">Platform</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">For SMBs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For enterprises</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For startups</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Knowledge base</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Custom pricing</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">© 2025 Liderix. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}