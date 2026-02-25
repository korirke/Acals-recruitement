"use client";

import React from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
} from "lucide-react";
import { useFooter } from "@/hooks/useFooter";
import { useNavigation } from "@/hooks/useNavigation";

const iconMap: Record<string, React.ElementType> = {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
};

const getIconComponent = (iconName: string): React.ElementType | null => {
  return iconMap[iconName] || null;
};

export default function Footer() {
  const { sections, contactInfo, socialLinks, loading } = useFooter();
  const { themeConfig } = useNavigation();

  if (loading) {
    return (
      <footer className="bg-neutral-900 dark:bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
              <div className="md:col-span-2">
                <div className="h-12 bg-neutral-800 rounded mb-4"></div>
                <div className="h-20 bg-neutral-800 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-800 rounded"></div>
                  <div className="h-4 bg-neutral-800 rounded"></div>
                  <div className="h-4 bg-neutral-800 rounded"></div>
                </div>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-6 bg-neutral-800 rounded"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-4 bg-neutral-800 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2 space-y-6">
            {/* Logo */}
            <Link href="/">
              <img
                src={themeConfig?.logoUrl || "/logo.png"}
                alt={themeConfig?.companyName || "Fortune Technologies"}
                className="h-12 w-auto hover:opacity-80 transition-opacity"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/logo.png";
                }}
              />
            </Link>

            <p className="text-neutral-300 text-base leading-relaxed">
              Empowering businesses across Kenya with intelligent HR solutions,
              cutting-edge technology, and comprehensive security systems that
              drive growth and digital transformation.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              {contactInfo.map((contact) => {
                const IconComponent = contact.icon
                  ? getIconComponent(contact.icon)
                  : null;
                const isClickable =
                  contact.type === "email" || contact.type === "phone";
                const href =
                  contact.type === "email"
                    ? `mailto:${contact.value}`
                    : contact.type === "phone"
                      ? `tel:${contact.value}`
                      : undefined;

                const content = (
                  <div className="flex items-center text-neutral-400 hover:text-orange-400 transition-colors duration-200">
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 mr-2 shrink-0" />
                    )}
                    {contact.value}
                  </div>
                );

                return isClickable && href ? (
                  <Link key={contact.id} href={href}>
                    {content}
                  </Link>
                ) : (
                  <div key={contact.id}>{content}</div>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {sections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="text-neutral-300 hover:text-orange-400 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-neutral-400 text-sm">
            © 2026 {themeConfig?.companyName || "Fortune Technologies"}. All
            rights reserved.
          </div>

          <div className="flex space-x-6 text-sm text-neutral-400">
            <Link
              href="/privacy"
              className="hover:text-orange-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-orange-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/security"
              className="hover:text-orange-400 transition-colors"
            >
              Security
            </Link>
            <Link
              href="/cookies"
              className="hover:text-orange-400 transition-colors"
            >
              Cookies
            </Link>
          </div>

          <div className="flex space-x-4">
            {socialLinks.map((social) => {
              const IconComponent = getIconComponent(social.icon);
              return IconComponent ? (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-neutral-400 hover:text-orange-400 transition-colors"
                >
                  <IconComponent className="w-5 h-5" />
                </a>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
