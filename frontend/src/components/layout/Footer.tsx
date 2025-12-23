"use client";

import Link from "next/link";
import { Scissors, MapPin, Phone, Clock } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Contact", href: "#contact" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="border-t bg-brand-muted-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-lg font-bold text-foreground hover:text-brand-accent transition-colors"
            >
              <div className="h-8 w-8 rounded-lg bg-foreground flex items-center justify-center">
                <Scissors className="h-4 w-4 text-background" />
              </div>
              <span>Trimly</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Professional barber shop services. Book your appointment online
              and experience premium grooming at our shop.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-foreground">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => {
                      if (link.href.startsWith("#")) {
                        e.preventDefault();
                        const element = document.querySelector(link.href);
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth" });
                        }
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-foreground">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-4 text-foreground">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  3696 Lynden Road
                  <br />
                  Lefroy, Ontario, Canada
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  +1 (123) 456-7890
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Mon-Sat: 8AM-8PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Trimly. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with precision for your grooming needs.
          </p>
        </div>
      </div>
    </footer>
  );
}
