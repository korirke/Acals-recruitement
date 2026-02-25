"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiClient";
import { getFileUrl } from "@/lib/configuration";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Badge } from "@/components/careers/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/careers/ui/tabs";
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Globe,
  Linkedin,
  Github,
  User,
} from "lucide-react";

export default function AdminCandidateDetailClient() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("id");

  const [candidate, setCandidate] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!["SUPER_ADMIN", "HR_MANAGER", "EMPLOYER", "MODERATOR"].includes(user.role)) {
      router.push("/");
      return;
    }

    if (!candidateId) {
      router.push("/recruitment-portal/candidates");
      return;
    }

    fetchCandidateDetails();
    fetchApplications();
  }, [user, candidateId, router]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/candidates/${candidateId}`);
      if (response.success) {
        setCandidate(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch candidate:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get(`/admin/candidates/${candidateId}/applications`);
      if (response.success) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const displayPhone = candidate?.phone || candidate?.user?.phone;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="space-y-8">
        <Button asChild variant="ghost">
          <Link href="/recruitment-portal/candidates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Candidates
          </Link>
        </Button>
        <Card>
          <CardContent className="py-16 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Candidate Not Found
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-4">
              The candidate profile you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/recruitment-portal/candidates">Back to Candidates</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" className="animate-fade-in">
        <Link href="/recruitment-portal/candidates">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </Link>
      </Button>

      <Card className="animate-fade-in border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900" style={{ animationDelay: "50ms" }}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              {candidate.user.avatar ? (
                <img
                  src={candidate.user.avatar}
                  alt={`${candidate.user.firstName} ${candidate.user.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-linear-to-r from-primary-500 to-orange-500 flex items-center justify-center text-white font-bold text-3xl">
                  {candidate.user.firstName[0]}
                  {candidate.user.lastName[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {candidate.user.firstName} {candidate.user.lastName}
                </h1>
                {candidate.openToWork && (
                  <Badge className="bg-green-500 text-white">Open to Work</Badge>
                )}
                {candidate.resumeUrl && (
                  <Badge
                    variant="outline"
                    className="border-blue-500 text-blue-600 dark:text-blue-400"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    Resume
                  </Badge>
                )}
              </div>
              {candidate.title && (
                <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-3">
                  {candidate.title}
                </p>
              )}
              <div className="grid md:grid-cols-2 gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{candidate.user.email}</span>
                </div>
                {displayPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{displayPhone}</span>
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{candidate.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(candidate.user.createdAt)}</span>
                </div>
              </div>
            </div>
            {candidate.resumeUrl && (
              <Button asChild className="bg-primary-500 hover:bg-primary-600 text-white">
                <a
                  href={getFileUrl(candidate.resumeUrl) || "#"}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Download CV
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {candidate.bio && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-500" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                  {candidate.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {candidate.skills && candidate.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary-500" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((cs: any) => (
                    <Badge key={cs.id} variant="outline" className="text-sm">
                      {cs.skill.name}
                      {cs.level && ` - ${cs.level}`}
                      {cs.yearsOfExp && ` (${cs.yearsOfExp} yrs)`}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {candidate.domains && candidate.domains.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Expertise Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {candidate.domains.map((cd: any) => (
                    <Badge
                      key={cd.id}
                      className={cd.isPrimary ? "bg-primary-500 text-white" : ""}
                    >
                      {cd.domain.name}
                      {cd.isPrimary && " (Primary)"}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Links & Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {displayPhone && (
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                    <Phone className="h-4 w-4 text-primary-500" />
                    <span>{displayPhone}</span>
                  </div>
                )}
                {candidate.websiteUrl && (
                  <a
                    href={candidate.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    {candidate.websiteUrl}
                  </a>
                )}
                {candidate.linkedinUrl && (
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn Profile
                  </a>
                )}
                {candidate.githubUrl && (
                  <a
                    href={candidate.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Github className="h-4 w-4" />
                    GitHub Profile
                  </a>
                )}
                {candidate.portfolioUrl && (
                  <a
                    href={candidate.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Portfolio
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-500" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.experiences && candidate.experiences.length > 0 ? (
                <div className="space-y-4">
                  {candidate.experiences.map((exp: any) => (
                    <div key={exp.id} className="border-l-2 border-primary-500 pl-4">
                      <h4 className="font-bold text-lg text-neutral-900 dark:text-white">
                        {exp.title}
                      </h4>
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        {exp.company}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(exp.startDate)} -{" "}
                        {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                  No work experience added
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary-500" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              {candidate.educations && candidate.educations.length > 0 ? (
                <div className="space-y-4">
                  {candidate.educations.map((edu: any) => (
                    <div key={edu.id} className="border-l-2 border-primary-500 pl-4">
                      <h4 className="font-bold text-lg text-neutral-900 dark:text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        {edu.fieldOfStudy}
                      </p>
                      <p className="text-neutral-700 dark:text-neutral-300 font-medium">
                        {edu.institution}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(edu.startDate)} -{" "}
                        {edu.isCurrent ? "Present" : formatDate(edu.endDate)}
                      </div>
                      {edu.grade && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Grade: {edu.grade}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                  No education added
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>All applications submitted by this candidate</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app: any) => (
                    <div
                      key={app.id}
                      className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">
                            {app.job.title}
                          </h4>
                          <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                            {app.job.company.name}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                            <span>Applied: {formatDate(app.appliedAt)}</span>
                            <Badge>{app.status}</Badge>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/recruitment-portal/applications/detail?id=${app.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">
                  No applications yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
