/**
 * AttendanceRing Component
 * 
 * Visual ring showing attendance percentage.
 */

import { cn } from "@/lib/utils";

interface AttendanceRingProps {
    percentage: number;
    size?: number;
    className?: string;
}

export function AttendanceRing({ percentage, size = 60, className }: AttendanceRingProps) {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 90) return "text-green-500";
        if (percentage >= 75) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={cn("transition-all duration-500 ease-out", getColor())}
                />
            </svg>
            <span className="absolute text-sm font-bold text-gray-800">
                {percentage}%
            </span>
        </div>
    );
}
