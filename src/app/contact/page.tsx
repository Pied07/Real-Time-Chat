"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      alert("Thank you! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            Get in touch with us
          </h1>
          <p className="text-2xl text-gray-400 max-w-2xl mx-auto">
            Have questions? Want to chat? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-4xl font-bold mb-8">Send us a message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-violet-500 transition-colors"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full bg-zinc-900 border border-white/10 rounded-3xl px-6 py-5 outline-none focus:border-violet-500 transition-colors resize-y"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-5 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-70"
              >
                {submitted ? "Sending..." : "Send Message"}
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold mb-8">Let's connect</h2>
              <p className="text-gray-400 text-lg">
                Our team is here to help. Reach out and we'll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <a href="mailto:hello@pulse.chat" className="text-gray-400 hover:text-white transition">hello@pulse.chat</a>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <a href="tel:+919876543210" className="text-gray-400 hover:text-white transition">+91 98765 43210</a>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">Visit Us</p>
                  <p className="text-gray-400">Kolkata, West Bengal, India</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-gray-500">
                Prefer a live demo? <br />
                <Link href="/register" className="text-violet-400 hover:text-violet-300">
                  Start a free workspace →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">Ready to transform your communication?</h2>
          <Link 
            href="/register"
            className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-2xl text-xl font-semibold hover:scale-105 transition-all"
          >
            Create Your Workspace Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  );
}