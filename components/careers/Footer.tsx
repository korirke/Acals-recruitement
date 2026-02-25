import Link from "next/link";
import { Briefcase, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/careers-portal" className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary-500" />
              <span className="text-xl font-bold text-primary-500">CareerHub ACAL</span>
            </Link>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Connecting talented professionals with leading companies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/careers-portal/jobs"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/careers-portal/about-us"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers-portal/contact-us"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/register"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Mail className="h-4 w-4 text-primary-500" />
                support@fortunekenya.com
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Phone className="h-4 w-4 text-primary-500" />
                +254 722 769 149
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-4 w-4 text-primary-500" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-10 pt-6 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            © {new Date().getFullYear()} CareerHub. All rights reserved.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Powered by Fortune Technologies
          </p>
        </div>
      </div>
    </footer>
  );
}