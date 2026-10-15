'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Target,
    Rocket,
    Building2,
    Users,
    UsersRound,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Star,
    Info,
    ChevronRight,
    Heart,
    Shield,
    Map,
    Award
} from 'lucide-react';

interface PetShowcaseItem {
    id: string;
    label: string;
    tag: string;
    title: string;
    description: string;
    imageUrl: string;
    dogTip: string;
    breedHighlight: string;
    actionLabel: string;
    actionHref: string;
}

const petShowcaseData: PetShowcaseItem[] = [
    {
        id: 'active-play',
        label: '🐕 Playful Energy',
        tag: 'Daily Vitality',
        title: 'Active Companions & Playtime Wellness',
        description: 'High-energy dogs need structured exercise, interactive puzzle challenges, and lean protein nutrition to sustain high stamina and mental clarity.',
        imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
        dogTip: 'Pro Tip: 20 minutes of scent games or puzzle chews burns as much mental energy as a 45-minute sprint walk.',
        breedHighlight: 'Golden Retrievers & Working Breeds',
        actionLabel: 'Browse Play & Fitness Toys',
        actionHref: '/products?category=toys-play'
    },
    {
        id: 'health-preventive',
        label: '🩺 Preventive Care',
        tag: 'Vet-Inspected',
        title: 'Routine Health, Coat Shine & Joint Mobility',
        description: 'From natural omega-rich salmon oils to orthopedic memory foam resting spots, proactive daily care prevents chronic stiffness as your dogs grow.',
        imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80',
        dogTip: 'Pro Tip: Inspect dental hygiene twice a week. Clean teeth safeguard cardiovascular longevity.',
        breedHighlight: 'Beagles, Bulldogs & Senior Pups',
        actionLabel: 'View Health Supplements',
        actionHref: '/products?category=health-medicine'
    },
    {
        id: 'community-social',
        label: '🤝 Social Gatherings',
        tag: 'Community Life',
        title: 'Socialized Dogs in Friendly Communities',
        description: 'Well-socialized dogs adapt calmly to public cafes, dog park group runs, adoption fairs, and neighborhood gatherings without anxiety.',
        imageUrl: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1200&q=80',
        dogTip: 'Pro Tip: Reward calm eye contact around new dogs with gentle praise and healthy training rewards.',
        breedHighlight: 'Poodles, Mixed Rescues & Social Dogs',
        actionLabel: 'Plan a Pet Gathering',
        actionHref: '/contact'
    },
    {
        id: 'nutrition-fresh',
        label: '🌱 Wholesome Nutrition',
        tag: 'Ethically Sourced',
        title: 'Direct-From-Supplier Wholesome Diets',
        description: 'We connect verified pet nutrition manufacturers directly with families, guaranteeing no expired kibble or toxic preservatives.',
        imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
        dogTip: 'Pro Tip: Always introduce new dietary formulas slowly over 7 to 10 days to protect gut microbiome balance.',
        breedHighlight: 'All Dog Breeds & Life Stages',
        actionLabel: 'Explore Certified Food',
        actionHref: '/products?category=dog-food-treats'
    }
];

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<string>('active-play');
    const selectedShowcase = petShowcaseData.find((item) => item.id === activeTab) || petShowcaseData[0];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/60 text-slate-900">
            {/* 1. Hero Section */}
            <section className="relative overflow-hidden bg-emerald-50 text-slate-900 py-16 sm:py-24 border-b border-emerald-100/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-white border border-emerald-200 text-[#047857] text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-2xs mb-6">
                        <Sparkles className="w-4 h-4 text-[#047857]" />
                        <span>About PetCare Hub • Premium Care & Community Ecosystem</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto text-slate-900">
                        Devoted to Pets, <br />
                        <span className="text-[#047857]">
                            Empowering Everyone Who Cares.
                        </span>
                    </h1>

                    <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
                        PetCare Hub is a dedicated digital marketplace and community hub connecting passionate pet parents, certified suppliers, entrepreneurs, and social pet gatherings under one trusted standard.
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-5 text-center shadow-2xs">
                            <span className="block text-2xl sm:text-3xl font-black text-[#047857]">50K+</span>
                            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Happy Pets Served</span>
                        </div>
                        <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-5 text-center shadow-2xs">
                            <span className="block text-2xl sm:text-3xl font-black text-[#047857]">100%</span>
                            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Vet-Screened Safety</span>
                        </div>
                        <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-5 text-center shadow-2xs">
                            <span className="block text-2xl sm:text-3xl font-black text-[#047857]">400+</span>
                            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Verified Suppliers</span>
                        </div>
                        <div className="bg-white border border-emerald-100 rounded-2xl p-4 sm:p-5 text-center shadow-2xs">
                            <span className="block text-2xl sm:text-3xl font-black text-[#047857]">24/7</span>
                            <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Pet Parent Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Interactive Pet Experience Showcase */}
            <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            Interactive Dog & Pet Life
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                            Designed for How Pets Actually Live & Play
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-2">
                            Click through our pet life stages to explore how PetCare Hub adapts to your pet&apos;s daily lifestyle, energy, and comfort needs.
                        </p>
                    </div>

                    {/* Interactive Tab Switcher Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
                        {petShowcaseData.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveTab(item.id)}
                                    className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isActive
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                                        }`}
                                >
                                    <span>{item.label}</span>
                                    {isActive && (
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Interactive Showcase Card */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                            {/* Dog Image Section */}
                            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[420px] overflow-hidden bg-slate-900 group">
                                <img
                                    src={selectedShowcase.imageUrl}
                                    alt={selectedShowcase.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                    {selectedShowcase.tag}
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block">
                                        Focus Area
                                    </span>
                                    <p className="text-base sm:text-lg font-bold">{selectedShowcase.breedHighlight}</p>
                                </div>
                            </div>

                            {/* Informational Details */}
                            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-5">
                                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                                    <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
                                    <span>Tailored Pet Experience</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                                    {selectedShowcase.title}
                                </h3>

                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {selectedShowcase.description}
                                </p>

                                {/* Pro Care Tip Callout */}
                                <div className="bg-emerald-50/80 border border-emerald-200/70 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-emerald-900">
                                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">{selectedShowcase.dogTip}</span>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href={selectedShowcase.actionHref}
                                        className="inline-flex items-center gap-2 bg-[#047857] hover:bg-[#065f46] active:bg-[#064e3b] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                                    >
                                        <span>{selectedShowcase.actionLabel}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Our Vision & Our Mission */}
            <section className="py-16 sm:py-20 bg-slate-50/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase bg-emerald-100/60 px-3 py-1 rounded-full">
                            Foundational Purpose
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                            Our Vision & Our Mission
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-2">
                            Guided by genuine animal welfare and ethical commerce, we set the standard for pet nutrition and responsible ownership.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Vision Card */}
                        <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xs hover:border-emerald-300 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 border border-emerald-200 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                    <Target className="w-7 h-7" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Long-Term Horizon</span>
                                <h3 className="text-2xl font-black text-slate-900 mt-1 mb-4">Our Vision</h3>
                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                                    To create a world where every companion pet thrives in optimum health, joy, and safety—supported by transparent product sourcing, vet-inspected standards, and a connected community of pet caregivers.
                                </p>
                            </div>
                            <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Universal transparency in all pet ingredients and manufacturing</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Accessible healthcare essentials for families of all backgrounds</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>Flourishing neighborhood pet gathering ecosystems</span>
                                </li>
                            </ul>
                        </div>

                        {/* Mission Card */}
                        <div className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-xs hover:border-teal-300 transition-all group flex flex-col justify-between">
                            <div>
                                <div className="w-14 h-14 rounded-2xl bg-teal-100/80 border border-teal-200 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                                    <Rocket className="w-7 h-7" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Daily Execution</span>
                                <h3 className="text-2xl font-black text-slate-900 mt-1 mb-4">Our Mission</h3>
                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                                    To empower pet owners, verified suppliers, and local pet entrepreneurs through a seamless, reliable platform delivering fresh food, medical essentials, and friendly local gathering initiatives.
                                </p>
                            </div>
                            <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                                    <span>Direct connection between verified suppliers and pet owners</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                                    <span>Zero tolerance for counterfeit, hazardous, or unvetted goods</span>
                                </li>
                                <li className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                                    <span>Comprehensive tools and support for growing pet entrepreneurs</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Our Values Section */}
            <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Our Values
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-2xl mx-auto leading-relaxed">
                            These core principles guide everything we do at PetCareLanka, from how we build our platform to how we interact with our community.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {/* 1. Pet Welfare First */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-start">
                            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#047857] border border-emerald-100 flex items-center justify-center mb-5 shrink-0">
                                <Heart className="w-5 h-5 text-[#047857]" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Pet Welfare First
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We believe in putting the health and happiness of pets at the center of everything we do.
                            </p>
                        </div>

                        {/* 2. Trust & Reliability */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-start">
                            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#047857] border border-emerald-100 flex items-center justify-center mb-5 shrink-0">
                                <Shield className="w-5 h-5 text-[#047857]" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Trust & Reliability
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We work to ensure our platform provides accurate, verified information you can depend on.
                            </p>
                        </div>

                        {/* 3. Local Focus */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-start">
                            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#047857] border border-emerald-100 flex items-center justify-center mb-5 shrink-0">
                                <Map className="w-5 h-5 text-[#047857]" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Local Focus
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We're committed to understanding and serving the unique needs of pet owners in Sri Lanka.
                            </p>
                        </div>

                        {/* 4. Community Building */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-start">
                            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#047857] border border-emerald-100 flex items-center justify-center mb-5 shrink-0">
                                <Users className="w-5 h-5 text-[#047857]" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Community Building
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We believe in fostering connections between pet owners, care providers, and enthusiasts.
                            </p>
                        </div>

                        {/* 5. Quality Standards */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-start">
                            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#047857] border border-emerald-100 flex items-center justify-center mb-5 shrink-0">
                                <Award className="w-5 h-5 text-[#047857]" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Quality Standards
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We promote excellence in pet care through rigorous listing standards and reviews.
                            </p>
                        </div>

                        {/* 6. Accessibility */}
                        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-start">
                            <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#047857] border border-emerald-100 flex items-center justify-center mb-5 shrink-0">
                                <Heart className="w-5 h-5 text-[#047857]" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">
                                Accessibility
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We strive to make quality pet care information accessible to everyone across the island.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
