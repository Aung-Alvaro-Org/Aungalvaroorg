import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "figma:asset/356b8400c00a176f9ef86a3a1186784544151aeb.png";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button onClick={scrollToTop} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img src={logo} alt="Bath Confessions" className="h-10 w-10 rounded-full" />
              </button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <button onClick={scrollToTop} className="text-gray-400 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg transition-all">
                Home
              </button>
              <a href="#confessions" className="text-gray-400 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg transition-all">
                Confessions
              </a>
              <a href="#guidelines" className="text-gray-400 hover:text-white hover:bg-gray-800/50 px-4 py-2 rounded-lg transition-all">
                Guidelines
              </a>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Button onClick={scrollToTop} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
              Submit Confession
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800/50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#0a0a0f]">
            <button onClick={scrollToTop} className="block w-full text-left px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg">
              Home
            </button>
            <a href="#confessions" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg">
              Confessions
            </a>
            <a href="#guidelines" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg">
              Guidelines
            </a>
            <div className="px-3 py-2">
              <Button onClick={scrollToTop} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                Submit Confession
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}