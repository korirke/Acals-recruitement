import { Button } from "@/components/careers/ui/button";
import Link from "next/link";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";
import { ArrowRight, Briefcase, Users, TrendingUp, Search } from "lucide-react";
import heroImage from "@/public/careers/hero-image.jpg";

export default function Home() {
  const stats = [
    { icon: Briefcase, value: "500+", label: "Active Jobs" },
    { icon: Users, value: "10K+", label: "Candidates" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 transition-colors">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-r from-primary-700 to-orange-500 py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Find Your Dream Job Today
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Connect with top companies and discover opportunities that match your skills and ambitions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg">
                    <Link href="/careers-portal/jobs" className="group">
                      View Openings
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white hover:border-white/50 backdrop-blur-sm"
                  >
                    <Link href="/recruitment-portal/jobs/new">Post a Job</Link>
                  </Button>
                </div>
              </div>
              <div className="relative animate-fade-in hidden md:block">
                <img 
                  src={heroImage.src} 
                  alt="Professional team collaboration" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-neutral-950 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-primary-500 to-orange-500 mb-4 shadow-md">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">{stat.value}</div>
                  <div className="text-neutral-600 dark:text-neutral-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-neutral-50 dark:bg-neutral-900 transition-colors">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
                Why Choose CareerHub?
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                We connect talented professionals with leading companies across industries.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in">
                <div className="w-12 h-12 rounded-lg bg-linear-to-r from-primary-500 to-orange-500 flex items-center justify-center mb-4 shadow-md">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">Easy Job Search</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Filter by location, department, and job type to find the perfect match for your skills.
                </p>
              </div>
              <div
                className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center mb-4 shadow-md">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">Top Companies</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Work with industry leaders who value talent, innovation, and professional growth.
                </p>
              </div>
              <div
                className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                <div className="w-12 h-12 rounded-lg bg-linear-to-r from-primary-500 to-orange-500 flex items-center justify-center mb-4 shadow-md">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-900 dark:text-white">Career Growth</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Find opportunities that align with your career goals and help you reach new heights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-linear-to-r from-primary-500 to-orange-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
              Ready to Take the Next Step?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
              Browse our latest job openings and find the perfect role for you.
            </p>
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white animate-fade-in shadow-lg">
              <Link href="/careers-portal/jobs" className="group">
                Explore Opportunities
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
