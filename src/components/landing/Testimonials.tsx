'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
    {
        content: "BuildWise has completely transformed how we handle contracts. What used to take days now takes minutes, and the risk analysis is a lifesaver.",
        author: "Sarah Jenkins",
        role: "Project Manager",
        company: "Apex Construction",
        initials: "SJ",
        color: "bg-[#4A90E2]",
    },
    {
        content: "The AI-generated variations are incredibly accurate. It's like having a legal team on standby 24/7. Highly recommended for any contractor.",
        author: "Michael Chen",
        role: "Director",
        company: "Urban Build Co.",
        initials: "MC",
        color: "bg-[#4A90E2]",
    },
    {
        content: "Finally, a tool that understands Australian construction law. The compliance checks give me peace of mind on every project.",
        author: "David Smith",
        role: "Owner",
        company: "Smith & Sons Renovations",
        initials: "DS",
        color: "bg-[#4A90E2]",
    },
]

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-white relative overflow-hidden font-poppins">
            <div className="section-container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        What Our{' '}
                        <span className="text-[#4A90E2]">Clients</span>
                        {' '}Are Saying
                    </h2>
                    <p className="text-xl text-gray-600">
                        Join hundreds of construction professionals who build smarter with BuildWise
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="relative bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10">
                                <Quote className="h-12 w-12 text-[#4A90E2]" />
                            </div>

                            {/* Stars */}
                            <div className="flex space-x-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                                {testimonial.content}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                                    <div className="text-sm text-gray-500">
                                        {testimonial.role}, {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
