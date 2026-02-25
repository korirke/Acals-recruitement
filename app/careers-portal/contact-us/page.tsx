"use client";

import { useState } from "react";
import Navbar from "@/components/careers/Navbar";
import Footer from "@/components/careers/Footer";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Textarea } from "@/components/careers/ui/textarea";
import { Label } from "@/components/careers/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useToast } from "@/components/careers/ui/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon.",
        duration: 5000,
      });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      detail: "support@fortunekenya.com",
      link: "mailto:support@fortunekenya.com",
    },
    {
      icon: Phone,
      title: "Phone",
      detail: "+254 722 769 149",
      link: "tel:+254722769149",
    },
    {
      icon: MapPin,
      title: "Address",
      detail: "SouthGate Centre, Mukoma Road, South B, Nairobi",
      link: "https://maps.google.com/?q=SouthGate+Centre+Mukoma+Road+South+B+Nairobi",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-primary-500 to-orange-500 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Get in Touch
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto animate-fade-in">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-neutral-50 dark:bg-neutral-950">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Contact Information</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                    Reach out to us through any of these channels, and we'll be happy to assist you.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card 
                      key={index} 
                      className="border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-300 animate-fade-in bg-white dark:bg-neutral-900"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-r from-primary-500 to-orange-500 shrink-0">
                            <info.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1 text-neutral-900 dark:text-white">{info.title}</h3>
                            {info.link !== "#" ? (
                              <a 
                                href={info.link} 
                                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                              >
                                {info.detail}
                              </a>
                            ) : (
                              <p className="text-sm text-neutral-600 dark:text-neutral-400">{info.detail}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="border-neutral-200 dark:border-neutral-800 bg-orange-50 dark:bg-orange-900/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-neutral-900 dark:text-white">Office Hours</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Monday - Friday: 8:00 AM - 6:00 PM EAT
                      <br />
                      Saturday 9:00 AM - 2:00 PM EAT
                      <br />
                      Sunday: Closed
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="animate-fade-in border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" style={{ animationDelay: '400ms' }}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-r from-primary-500 to-orange-500">
                        <Send className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-neutral-900 dark:text-white">Send us a Message</CardTitle>
                        <CardDescription className="text-neutral-600 dark:text-neutral-400">Fill out the form and we'll get back to you within 24 hours</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactFirstName" className="text-neutral-900 dark:text-white">First Name *</Label>
                          <Input id="contactFirstName" required placeholder="John" className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactLastName" className="text-neutral-900 dark:text-white">Last Name *</Label>
                          <Input id="contactLastName" required placeholder="Doe" className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="text-neutral-900 dark:text-white">Email *</Label>
                        <Input id="contactEmail" type="email" required placeholder="john.doe@example.com" className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="text-neutral-900 dark:text-white">Phone Number</Label>
                        <Input id="contactPhone" type="tel" placeholder="+1 (555) 123-4567" className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-neutral-900 dark:text-white">Subject *</Label>
                        <Input id="subject" required placeholder="How can we help?" className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-neutral-900 dark:text-white">Message *</Label>
                        <Textarea 
                          id="message" 
                          required 
                          placeholder="Tell us more about your inquiry..."
                          className="min-h-[150px] border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                        size="lg" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}