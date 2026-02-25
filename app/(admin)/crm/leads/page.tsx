"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import Footer  from "@/components/layout/Footer";
import {
  ChevronRight,
  CheckCircle,
  MessageSquare,
  Users,
  Calendar,
  BarChart,
  Briefcase,
  CreditCard,
  Monitor,
  Search,
  Settings,
  TrendingUp,
  UserPlus,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    inquiry: "I have a general question",
    fullName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const helpTopics = [
    {
      title: "Billing & subscriptions",
      icon: <CreditCard className="w-8 h-8 text-orange-500" />,
      href: "/help/billing",
    },
    {
      title: "Integrations & API",
      icon: <Settings className="w-8 h-8 text-orange-500" />,
      href: "/help/integrations",
    },
    {
      title: "Employee data management",
      icon: <Users className="w-8 h-8 text-orange-500" />,
      href: "/help/employee-data",
    },
    {
      title: "Time off tracking",
      icon: <Calendar className="w-8 h-8 text-orange-500" />,
      href: "/help/time-off",
    },
    {
      title: "People analytics",
      icon: <BarChart className="w-8 h-8 text-orange-500" />,
      href: "/help/analytics",
    },
    {
      title: "Applicant tracking",
      icon: <Briefcase className="w-8 h-8 text-orange-500" />,
      href: "/help/applicant-tracking",
    },
    {
      title: "Employee onboarding",
      icon: <UserPlus className="w-8 h-8 text-orange-500" />,
      href: "/help/onboarding",
    },
    {
      title: "Asset management",
      icon: <Monitor className="w-8 h-8 text-orange-500" />,
      href: "/help/asset-management",
    },
    {
      title: "Performance management",
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      href: "/help/performance",
    },
    {
      title: "All topics",
      icon: <Search className="w-8 h-8 text-orange-500" />,
      href: "/help",
    },
  ];

  const quickActions = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start chat",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Book a Demo",
      description: "Schedule a personalized demo",
      action: "Book now",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Sales Team",
      description: "Speak with our sales experts",
      action: "Contact sales",
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <Navigation />

        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-12 shadow-lg">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Thank You!
            </h1>
            <p className="text-gray-600 dark:text-neutral-300 mb-8">
              Your message has been sent successfully. We&apos;ll get back to you
              within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    inquiry: "I have a general question",
                    fullName: "",
                    lastName: "",
                    email: "",
                    message: "",
                  });
                }}
                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-neutral-50 dark:bg-neutral-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              href="/"
              className="text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-900 dark:text-white font-medium">
              Contact Us
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-100 to-white dark:from-neutral-900 dark:to-neutral-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">
            Get in <span className="text-orange-400">Touch</span>
          </h1>
           <p className="text-lg mb-8 text-gray-500 dark:text-white">
            Ready to transform your HR operations? We&apos;re here to help you get
            started. Reach out to our team for personalized assistance.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md border border-gray-100 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-300 mb-4">
                  {action.description}
                </p>
                <button className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline">
                  {action.action} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Side - Contact Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h1>

              {/* Contact Information */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-neutral-300">
                      +254 722 769 149
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-neutral-300">
                      support@fortunekenya.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Office
                    </h3>
                    <p className="text-gray-600 dark:text-neutral-300">
                      Nairobi, Kenya
                      <br />
                      SouthGate Centre, 1st Floor Mukoma Road, South B
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-neutral-300">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* How can we help dropdown */}
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-neutral-400 mb-2">
                      How can we help?
                    </label>
                    <select
                      name="inquiry"
                      value={formData.inquiry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white bg-gray-50 dark:bg-neutral-700"
                    >
                      <option>I have a general question</option>
                      <option>I need a demo</option>
                      <option>I need technical support</option>
                      <option>I want to discuss pricing</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <textarea
                      name="message"
                      placeholder="Message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-neutral-800 dark:text-white placeholder-gray-500 dark:placeholder-neutral-400 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Help Topics */}
      <section className="py-16 bg-gray-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Browse help topics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {helpTopics.map((topic, index) => (
              <Link
                key={index}
                href={topic.href}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-neutral-700 group hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform">
                  {topic.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  {topic.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-neutral-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-neutral-300 mb-8">
            Can&apos;t find what you&apos;re looking for? Check out our comprehensive FAQ
            section.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            View FAQ
            <ChevronRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}