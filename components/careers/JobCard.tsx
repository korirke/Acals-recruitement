import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/careers/ui/card";
import { Badge } from "@/components/careers/ui/badge";
import { Button } from "@/components/careers/ui/button";
import {
  MapPin,
  Banknote,
  ArrowRight,
  Building2,
  Calendar,
} from "lucide-react";
import type { Job } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { normalizeImageUrl } from "@/lib/imageUtils";

export default function JobCard(job: Job) {
  const formatSalary = () => {
    switch (job.salaryType) {
      case "RANGE":
        return job.salaryMin && job.salaryMax
          ? `${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k`
          : "Competitive";
      case "SPECIFIC":
        return job.specificSalary
          ? `${(job.specificSalary / 1000).toFixed(0)}k`
          : "Competitive";
      case "NEGOTIABLE":
        return "Negotiable";
      case "NOT_DISCLOSED":
        return "Competitive";
      default:
        return "Competitive";
    }
  };

  const formatJobType = () => {
    return job.type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string): string => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Card className="group h-full hover:shadow-lg transition-all duration-300 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden hover:-translate-y-1">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-primary-500 to-orange-500" />

      <CardHeader className="pb-4 pt-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <Badge className="bg-primary-500 text-white hover:bg-primary-600">
              {job.category.name}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
            >
              {formatJobType()}
            </Badge>
          </div>

          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1.5 line-clamp-1 group-hover:text-primary-500 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center gap-2">
              {job.company.logo ? (
                <img
                  src={normalizeImageUrl(job.company.logo)}
                  alt={job.company.name}
                  className="w-8 h-8 rounded-lg object-cover border border-neutral-200 dark:border-neutral-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500/20 to-orange-500/20 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary-500" />
                </div>
              )}
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {job.company.name}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-5">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        <div className="grid grid-cols-1 gap-2.5">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <MapPin className="h-4 w-4 text-primary-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {job.location} {job.isRemote && "• Remote"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
            <Banknote className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                {formatSalary()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <Calendar className="h-3.5 w-3.5" />
          <span>Posted {formatDate(job.publishedAt || job.createdAt)}</span>
        </div>

        <Button
          asChild
          size="lg"
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-sm hover:shadow-md transition-all"
        >
          <Link
            href={`/careers-portal/jobs/job-detail?id=${job.id}`}
            className="flex items-center justify-center gap-2"
          >
            View Job Details
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
