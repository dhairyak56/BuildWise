import { TrendingUp, Users, Clock, Award } from 'lucide-react'

const stats = [
    {
        icon: Users,
        value: '500+',
        label: 'Active Builders',
        description: 'Trust BuildWise daily',
    },
    {
        icon: Clock,
        value: '15k+',
        label: 'Hours Saved',
        description: 'By our customers',
    },
    {
        icon: TrendingUp,
        value: '40%',
        label: 'Growth Rate',
        description: 'Average capacity increase',
    },
    {
        icon: Award,
        value: '99.8%',
        label: 'Satisfaction',
        description: 'Customer approval rating',
    },
]

export default function Stats() {
    return (
        <section className="py-16 bg-slate-900 border-y border-slate-800">
            <div className="section-container">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div key={index} className="flex flex-col items-center text-center group">
                                <div className="mb-4 p-3 rounded-full bg-slate-800/50 text-blue-400 group-hover:bg-blue-500/10 group-hover:text-blue-300 transition-colors duration-300">
                                    <Icon size={24} strokeWidth={2} />
                                </div>
                                <div className="text-4xl font-bold text-white mb-1 tracking-tight">{stat.value}</div>
                                <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
