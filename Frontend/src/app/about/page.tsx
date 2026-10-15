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



export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<string>('active-play');


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
                    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
                        <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            Interactive Dog & Pet Life
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                            About PetCareHub
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-2">
                            Connecting pet owners with quality care providers worldwide since 2026.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                        {/* Our Story Column */}
                        <div className="lg:col-span-6 space-y-5">


                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Our Story
                            </h3>

                            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                                <p>
                                    PetCareHub was born from a simple yet powerful idea: to create a centralized platform where pet owners across the world could easily find and connect with quality pet care providers.
                                </p>
                                <p>
                                    Founded by a team of pet enthusiasts and tech professionals, we recognized the challenges many people faced when searching for veterinary clinics, groomers, or pet services in their area. Information was scattered, unreliable, or outdated.
                                </p>
                                <p>
                                    Starting in 2026, we began building a comprehensive directory that would bridge this gap, combining detailed listings with user reviews to help pet owners make informed decisions about their pets' care.
                                </p>
                            </div>
                        </div>

                        {/* Two Images Grid Column */}
                        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                            <div className="group rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-2xs hover:shadow-md transition-all">
                                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src="/cats-and-dogs.webp"
                                        alt="Cats and Dogs Companions"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-3.5 sm:p-4 bg-white border-t border-slate-100">
                                    <p className="text-xs sm:text-sm font-bold text-slate-900">Dedicated Companionship</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Empowering dog and cat care across Sri Lanka</p>
                                </div>
                            </div>

                            <div className="group rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-2xs hover:shadow-md transition-all">
                                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                                    <img
                                        src="/Pembroke-welsh-corgi-dog.webp"
                                        alt="Pembroke Welsh Corgi Dog"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-3.5 sm:p-4 bg-white border-t border-slate-100">
                                    <p className="text-xs sm:text-sm font-bold text-slate-900">Loving Pet Care</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Verified clinics, groomers, and trusted sitters</p>
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
