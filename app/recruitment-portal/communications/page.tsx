"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Textarea } from "@/components/careers/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/careers/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { Mail, Send, FileText, History, Eye, ChevronDown } from "lucide-react";
import { useToast } from "@/components/careers/ui/use-toast";

export default function Communications() {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const emailTemplates = [
    {
      id: "1",
      name: "Welcome Email",
      subject: "Welcome to CareerHub!",
      description: "Sent to new users upon registration",
      lastModified: "2 days ago",
    },
    {
      id: "2",
      name: "Job Application Received",
      subject: "We've received your application",
      description: "Sent when candidate applies to a job",
      lastModified: "1 week ago",
    },
    {
      id: "3",
      name: "Job Approved",
      subject: "Your job posting is now live",
      description: "Sent when employer's job is approved",
      lastModified: "3 days ago",
    },
    {
      id: "4",
      name: "Monthly Newsletter",
      subject: "Your monthly job market update",
      description: "Monthly newsletter template",
      lastModified: "1 day ago",
    },
  ];

  const emailHistory = [
    {
      id: "1",
      subject: "March Newsletter - Top Tech Jobs",
      recipients: "All Candidates (2,145)",
      sentDate: "Mar 15, 2024",
      opens: 1432,
      clicks: 234,
    },
    {
      id: "2",
      subject: "New Feature Announcement",
      recipients: "All Users (3,429)",
      sentDate: "Mar 10, 2024",
      opens: 2156,
      clicks: 456,
    },
    {
      id: "3",
      subject: "Premium Plan Benefits",
      recipients: "All Employers (156)",
      sentDate: "Mar 5, 2024",
      opens: 98,
      clicks: 23,
    },
  ];

  const handleSendNewsletter = () => {
    toast({
      title: "Newsletter Sent!",
      description: "Your newsletter has been sent successfully.",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
          Communications
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Send emails and manage communication templates
        </p>
      </div>

      <Tabs defaultValue="send" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send" className="text-xs sm:text-sm">
            Send
          </TabsTrigger>
          <TabsTrigger value="templates" className="text-xs sm:text-sm">
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4 sm:space-y-6">
          <Card className="shadow-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                Compose Newsletter
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Recipients</Label>
                  <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users (3,429)</SelectItem>
                      <SelectItem value="candidates">All Candidates (2,145)</SelectItem>
                      <SelectItem value="employers">All Employers (156)</SelectItem>
                      <SelectItem value="active">Active Users Only (2,876)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm">Template (Optional)</Label>
                  <Select>
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Subject Line</Label>
                <Input placeholder="Enter email subject..." className="text-xs sm:text-sm" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Email Content</Label>
                <Textarea
                  placeholder="Write your message here..."
                  className="min-h-[200px] sm:min-h-[300px] text-xs sm:text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={handleSendNewsletter}
                  size="sm"
                  className="w-full sm:w-auto gradient-primary"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Send Newsletter
                </Button>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" className="gradient-primary">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="hidden sm:inline">Create New Template</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {emailTemplates.map((template, index) => (
              <Card
                key={template.id}
                className="shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg mb-1 truncate">
                        {template.name}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 truncate">
                        {template.subject}
                      </p>
                    </div>
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-3 sm:mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      Modified {template.lastModified}
                    </span>
                    <div className="flex gap-1 sm:gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Preview</span>
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <History className="h-4 w-4 sm:h-5 sm:w-5" />
                Email History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                {emailHistory.map((email) => (
                  <div
                    key={email.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-white truncate">
                        {email.subject}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 truncate">
                        {email.recipients}
                      </p>
                      <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Sent on {email.sentDate}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {email.opens}
                          </span>{" "}
                          <span className="text-neutral-500 dark:text-neutral-400">opens</span>
                        </div>
                        <div>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {email.clicks}
                          </span>{" "}
                          <span className="text-neutral-500 dark:text-neutral-400">clicks</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
