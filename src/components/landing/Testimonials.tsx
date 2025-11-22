'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'

const testimonials = [
    {
        content: "BuildWise has completely transformed how we handle contracts. What used to take days now takes minutes, and the risk analysis is a lifesaver.",
        author: "Sarah Jenkins",
        role: "Project Manager",
        company: "Apex Construction",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        content: "The AI-generated variations are incredibly accurate. It's like having a legal team on standby 24/7. Highly recommended for any contractor.",
        author: "Michael Chen",
        role: "Director",
        company: "Urban Build Co.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
        content: "Finally, a tool that understands Australian construction law. The compliance checks give me peace of mind on every project.",
        author: "David Smith",
        role: "Owner",
        company: "Smith & Sons Renovations",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
]

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
            <div className="section-container">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Trusted by Builders
                    </h2>
                    <p className="text-lg text-slate-600">
                        Join hundreds of construction professionals who build smarter with BuildWise.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="flex space-x-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-slate-600 mb-6 flex-1">
                                &quot;{testimonial.content}&quot;
                            </p>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.author}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">{testimonial.author}</div>
                                    <div className="text-sm text-slate-500">
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
