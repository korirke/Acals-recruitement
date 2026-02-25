import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";
import { Card, CardContent } from "@/components/careers/ui/card";
import { Target, Heart, Users, Award } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To connect talented professionals with opportunities that align with their passions and help companies build exceptional teams.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description:
        "We believe in transparency, integrity, and fostering meaningful connections between employers and job seekers.",
    },
    {
      icon: Users,
      title: "Our Community",
      description:
        "A diverse network of professionals and industry-leading companies working together to shape the future of work.",
    },
    {
      icon: Award,
      title: "Our Commitment",
      description:
        "Dedicated to providing exceptional service and support throughout your entire career journey.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "15+ years in talent acquisition and recruitment",
    },
    {
      name: "Michael Chen",
      role: "Head of Technology",
      bio: "Former engineering leader at Fortune 500 companies",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      bio: "Expert in scaling recruitment operations",
    },
    {
      name: "David Thompson",
      role: "Head of Partnerships",
      bio: "Building relationships with industry leaders",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-primary-500 to-orange-500 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              About CareerHub
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto animate-fade-in">
              We're on a mission to transform how people find meaningful work and how companies discover exceptional talent.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white dark:bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white animate-fade-in">Our Story</h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 animate-fade-in">
                Founded in 2002, CareerHub was born from a simple belief: finding the right job shouldn't be complicated.
                We started with a vision to create a platform that truly understands both sides of the hiring equation —
                the aspirations of job seekers and the needs of employers.
              </p>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 animate-fade-in">
                Today, we've helped thousands of professionals find their dream jobs and enabled hundreds of companies
                to build world-class teams. Our platform combines cutting-edge technology with a human touch to create
                meaningful connections that drive careers forward.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-900 dark:text-white animate-fade-in">
              What We Stand For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in bg-white dark:bg-neutral-900"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-r from-primary-500 to-orange-500 shrink-0">
                        <value.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">{value.title}</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        {/* <section className="py-20 bg-white dark:bg-neutral-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white animate-fade-in">Meet Our Team</h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto animate-fade-in">
                Passionate professionals dedicated to revolutionizing the job search experience
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="text-center border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in bg-white dark:bg-neutral-900"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="w-20 h-20 rounded-full bg-linear-to-r from-primary-500 to-orange-500 mx-auto flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-primary-500 mb-2">{member.role}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{member.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}

        {/* Stats Section */}
        <section className="py-20 bg-linear-to-r from-primary-500 to-orange-500">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="animate-fade-in">
                <div className="text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80">Active Job Listings</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <div className="text-5xl font-bold text-white mb-2">10,000+</div>
                <div className="text-white/80">Registered Candidates</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="text-5xl font-bold text-white mb-2">95%</div>
                <div className="text-white/80">Success Rate</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}