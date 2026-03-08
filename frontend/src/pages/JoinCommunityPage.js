import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function JoinCommunityPage() {
  const whatsappGroups = [
    {
      title: "Wedding Designs Community",
      description:
        "Connect with designers and get exclusive wedding design templates",
      link: "https://chat.whatsapp.com/your-wedding-group-link",
      icon: "💒",
    },
    {
      title: "Banner Designers Hub",
      description: "Share and discuss banner designs, tips and tricks",
      link: "https://chat.whatsapp.com/your-banner-group-link",
      icon: "🎨",
    },
    {
      title: "Business Card Creators",
      description: "Network with professionals and share business card designs",
      link: "https://chat.whatsapp.com/your-business-card-group-link",
      icon: "💼",
    },
    {
      title: "General Design Community",
      description: "All-purpose design group for creative discussions",
      link: "https://chat.whatsapp.com/your-general-group-link",
      icon: "✨",
    },
  ];

  const socialMedia = [
    {
      name: "Instagram",
      handle: "@pixeladda",
      link: "https://instagram.com/pixeladda",
      icon: Instagram,
      color: "hover:text-pink-600",
    },
    {
      name: "Facebook",
      handle: "PixelAdda",
      link: "https://facebook.com/pixeladda",
      icon: Facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "YouTube",
      handle: "PixelAdda Tutorials",
      link: "https://youtube.com/@pixeladda",
      icon: Youtube,
      color: "hover:text-red-600",
    },
    {
      name: "Twitter",
      handle: "@pixeladda",
      link: "https://twitter.com/pixeladda",
      icon: Twitter,
      color: "hover:text-blue-400",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative h-[30vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1611746872915-64382b5c76da?crop=entropy&cs=srgb&fm=jpg&q=85')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-none mb-4">
            Join Our Creative Community
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Connect with fellow designers, share ideas, and stay updated
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* WhatsApp Groups Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h2 className="text-3xl font-semibold mb-2">
              WhatsApp Communities
            </h2>
            <p className="text-muted-foreground">
              Join our active designer groups and collaborate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatsappGroups.map((group, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{group.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {group.title}
                      </CardTitle>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join WhatsApp Group
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Social Media Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold mb-2">
              Follow Us on Social Media
            </h2>
            <p className="text-muted-foreground">
              Stay connected and get the latest updates
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialMedia.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="pt-6 text-center">
                      <Icon
                        className={`h-12 w-12 mx-auto mb-4 transition-colors ${social.color}`}
                      />
                      <h3 className="font-semibold text-lg mb-1">
                        {social.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {social.handle}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mt-16 bg-muted/20 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Why Join Our Community?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="font-semibold mb-2">Exclusive Resources</h3>
              <p className="text-sm text-muted-foreground">
                Get early access to new templates and free design resources
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold mb-2">Network & Collaborate</h3>
              <p className="text-sm text-muted-foreground">
                Connect with fellow designers and grow your professional network
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold mb-2">Learn & Grow</h3>
              <p className="text-sm text-muted-foreground">
                Access tutorials, tips, and industry insights from experts
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 mt-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Pixeladda</h3>
              <p className="text-sm text-muted-foreground">
                Premium design templates for creative professionals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-muted-foreground hover:text-primary"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Phone: +91 98203 29571</li>
                <li>Email: support@pixeladda.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Pixeladda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
