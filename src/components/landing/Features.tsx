import { FileText, Shield, Zap, Clock, CheckCircle, TrendingUp, BarChart3, Users, Sparkles } from 'lucide-react'

const features = [
    {
        icon: Zap,
        title: 'AI Contract Generation',
        description: 'Create professional construction contracts in under 2 minutes with our advanced AI that understands Australian law.',
        color: 'text-amber-500',
        bg: 'bg-amber-50',
    },
    {
        icon: Shield,
        title: 'Smart Risk Analysis',
        description: 'AI-powered clause scanning identifies risks, missing terms, and compliance issues before you sign.',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        icon: FileText,
        title: 'Instant Variations',
        description: 'Generate professional variation orders on the fly when project scope changes—keep clients informed.',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        icon: Clock,
        title: 'Save 15+ Hours Weekly',
        description: 'Automate documentation that used to take 8 hours. Focus on building, not paperwork.',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
    },
    {
        icon: CheckCircle,
        title: 'Australian Compliance',
        description: 'Built-in templates comply with Australian construction law across all trades and states.',
        color: 'text-rose-600',
        bg: 'bg-rose-50',
    },
    {
        icon: TrendingUp,
        title: 'Scale Profitably',
        description: 'Take on 40% more projects without hiring additional staff. Grow without overhead.',
        color: 'text-indigo-600',
        bg: 'bg-indigo-50',
    },
    {
        icon: BarChart3,
        title: 'Analytics Dashboard',
        description: 'Track contract performance, identify bottlenecks, and optimize your documentation workflow.',
        color: 'text-cyan-600',
        bg: 'bg-cyan-50',
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Share contracts with your team, assign reviews, and maintain version control effortlessly.',
        color: 'text-pink-600',
        bg: 'bg-pink-50',
    },
]

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

            <div className="section-container">
                {/* Section Header */}
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-semibold text-xs mb-6 uppercase tracking-wide animate-fade-in-up">
                        <Sparkles size={14} />
                        Powerful Features
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight animate-fade-in-up delay-100">
                        Everything You Need to
                        <br />
                        <span className="text-blue-600">
                            Manage Contracts
                        </span>
                    </h2>
                    <p className="text-xl text-slate-600 leading-relaxed animate-fade-in-up delay-200">
                        Stop wasting time on paperwork. BuildWise handles the documentation so you can focus on what you do best—building.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                                style={{ animationDelay: `${300 + (index * 50)}ms` }}
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={24} strokeWidth={2} />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{feature.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
