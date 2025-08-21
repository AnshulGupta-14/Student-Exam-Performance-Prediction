"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-[#161b22] border-b border-[#30363d] shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-gray-100 hover:text-blue-400 transition-colors"
            >
              🎓 Student Performance Predictor
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/dashboard", label: "Dashboard" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                  isActive(link.href)
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-gray-300 hover:text-blue-400 hover:bg-[#21262d]"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
