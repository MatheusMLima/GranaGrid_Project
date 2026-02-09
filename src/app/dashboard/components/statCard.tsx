import { ReactNode } from "react";

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  badge?: string
  gradient: string
}

export function StatCard({ title, value, icon, badge, gradient }: StatCardProps ) {
  return (
    <div className={`relative rounded-2xl p-6 text-white shadow-lg ${gradient}`} >
      
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
        {icon}
      </div>

      {badge && (
        <span className="absolute right-4 top-7 rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
          {badge}
        </span>
      )}

      <p className="text-sm opacity-90">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
