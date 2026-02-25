/**
 * 📊 Stats Card Component
 */

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: number;
  format?: 'number' | 'currency' | 'percentage';
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  format = 'number',
  color = 'blue',
}: StatsCardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `$${formatNumber(val)}`;
      case 'percentage':
        return `${val}%`;
      default:
        return formatNumber(val);
    }
  };

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-700 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">
            {formatValue(value)}
          </p>
          
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {trend >= 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold text-green-500">
                    +{trend}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-red-500">
                    {trend}%
                  </span>
                </>
              )}
              <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>

        <div className={cn('p-3 rounded-lg', colors[color])}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
