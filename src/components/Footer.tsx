import { Twitter, Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              Bath Confessions
            </h3>
            <p className="text-gray-500 mb-4 text-sm">
              A safe space for University of Bath students to share their thoughts, stories, and experiences anonymously.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><a href="#home" className="hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#confessions" className="hover:text-blue-400 transition-colors">Confessions</a></li>
              <li><a href="#guidelines" className="hover:text-blue-400 transition-colors">Guidelines</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white mb-4 text-sm">Community</h4>
            <ul className="space-y-2 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Submit Confession</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Report Content</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white mb-4 text-sm">Stay Safe</h4>
            <div className="space-y-2 text-gray-500 text-sm">
              <p>🔒 Your identity is protected</p>
              <p>🎓 By Bath students, for Bath students</p>
              <p>💙 Building community through honesty</p>
              <p>⚠️ Report inappropriate content</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800/50 pt-8 text-center text-gray-600 text-sm">
          <p>&copy; 2025 Bath Confessions. All rights reserved. Not affiliated with University of Bath.</p>
        </div>
      </div>
    </footer>
  );
}
