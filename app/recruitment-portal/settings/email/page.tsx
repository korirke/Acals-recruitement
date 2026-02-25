"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import { Textarea } from "@/components/careers/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";
import { Switch } from "@/components/careers/ui/switch";
import { ArrowLeft, Save, Mail, TestTube } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/careers/ui/use-toast";

export default function EmailSettings() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Email Settings Saved",
      description: "Your email configuration has been updated.",
    });
  };

  const handleTest = () => {
    toast({
      title: "Test Email Sent",
      description: "Check your inbox for the test email.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <Button asChild variant="ghost" size="sm" className="mb-2">
          <Link href="/recruitment-portal/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
          Email Configuration
        </h1>
        <p className="text-muted-foreground">
          Configure email settings and templates
        </p>
      </div>

      <Tabs defaultValue="smtp" className="space-y-6">
        <TabsList>
          <TabsTrigger value="smtp">SMTP Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>
                Configure your email server settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" type="number" placeholder="587" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">Username</Label>
                  <Input id="smtpUser" placeholder="user@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  placeholder="noreply@careerhub.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input id="fromName" placeholder="CareerHub" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} className="gradient-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button onClick={handleTest} variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Control which emails are sent automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Welcome Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Send welcome email to new users
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Application Confirmation</h4>
                  <p className="text-sm text-muted-foreground">
                    Confirm when candidate applies to a job
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Job Approved</h4>
                  <p className="text-sm text-muted-foreground">
                    Notify employers when job is approved
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">New Application Alert</h4>
                  <p className="text-sm text-muted-foreground">
                    Alert employers of new applications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Weekly Digest</h4>
                  <p className="text-sm text-muted-foreground">
                    Send weekly activity summary
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Marketing Emails</h4>
                  <p className="text-sm text-muted-foreground">
                    Send promotional and marketing emails
                  </p>
                </div>
                <Switch />
              </div>
              <Button onClick={handleSave} className="gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Email Template Editor</CardTitle>
              <CardDescription>Customize your email templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="templateSubject">Email Subject</Label>
                <Input
                  id="templateSubject"
                  placeholder="Welcome to {{site_name}}!"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templateContent">Email Content</Label>
                <Textarea
                  id="templateContent"
                  placeholder="Hi {{first_name}},&#10;&#10;Welcome to our platform!&#10;&#10;Available variables: {{site_name}}, {{first_name}}, {{last_name}}, {{email}}"
                  className="min-h-[300px] font-mono"
                />
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">
                  Available Variables
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-800 dark:text-blue-200">
                  <code>{"{{site_name}}"}</code>
                  <code>{"{{first_name}}"}</code>
                  <code>{"{{last_name}}"}</code>
                  <code>{"{{email}}"}</code>
                  <code>{"{{job_title}}"}</code>
                  <code>{"{{company_name}}"}</code>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} className="gradient-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
