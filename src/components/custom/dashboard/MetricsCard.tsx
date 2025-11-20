'use client';

import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
}

const colorClasses = {
  blue: 'from-blue-500 to-cyan-600',
  green: 'from-emerald-500 to-teal-600',
  orange: 'from-orange-500 to-amber-600',
  red: 'from-red-500 to-rose-600',
  purple: 'from-purple-500 to-indigo-600'
};

const iconBgClasses = {
  blue: 'bg-blue-500/10',
  green: 'bg-emerald-500/10',
  orange: 'bg-orange-500/10',
  red: 'bg-red-500/10',
  purple: 'bg-purple-500/10'
};

export function MetricsCard({ title, value, icon: Icon, trend, color }: MetricsCardProps) {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span className={trend.isPositive ? 'text-emerald-600' : 'text-red-600'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 ml-1">vs. ontem</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
          <Icon className={`w-6 h-6 bg-gradient-to-br ${colorClasses[color]} bg-clip-text text-transparent`} />
        </div>
      </div>
    </Card>
  );
}
