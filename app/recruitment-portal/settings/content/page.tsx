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
import { ArrowLeft, Save, Plus, Edit2, Eye, Badge } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/careers/ui/use-toast";

export default function ContentSettings() {
  const { toast } = useToast();

  const pages = [
    { id: "1", title: "About Us", slug: "about", lastModified: "2 days ago" },
    {
      id: "2",
      title: "Privacy Policy",
      slug: "privacy",
      lastModified: "1 week ago",
    },
    {
      id: "3",
      title: "Terms of Service",
      slug: "terms",
      lastModified: "1 week ago",
    },
    {
      id: "4",
      title: "Contact Us",
      slug: "contact",
      lastModified: "3 days ago",
    },
  ];

  const blogPosts = [
    {
      id: "1",
      title: "10 Tips for Job Seekers in 2024",
      status: "published",
      date: "Mar 15, 2024",
    },
    {
      id: "2",
      title: "How to Write a Winning Resume",
      status: "published",
      date: "Mar 10, 2024",
    },
    {
      id: "3",
      title: "Interview Preparation Guide",
      status: "draft",
      date: "Mar 18, 2024",
    },
  ];

  const handleSave = () => {
    toast({
      title: "Content Saved",
      description: "Your changes have been published successfully.",
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
          Content Management
        </h1>
        <p className="text-muted-foreground">
          Manage static pages and blog content
        </p>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pages">Static Pages</TabsTrigger>
          <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          <TabsTrigger value="editor">Page Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Page
            </Button>
          </div>

          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page.id} className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {page.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        /{page.slug}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last modified {page.lastModified}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </div>

          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <Card key={post.id} className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <Badge
                          className={
                            post.status === "published"
                              ? "bg-green-600"
                              : "bg-yellow-600"
                          }
                        >
                          {post.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {post.date}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Edit Page Content</CardTitle>
              <CardDescription>Create or modify page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pageTitle">Page Title</Label>
                <Input id="pageTitle" placeholder="Enter page title..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageSlug">Page Slug</Label>
                <Input id="pageSlug" placeholder="page-url-slug" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageContent">Page Content</Label>
                <Textarea
                  id="pageContent"
                  placeholder="Write your content here..."
                  className="min-h-[400px] font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Supports Markdown and HTML
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} className="gradient-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Publish
                </Button>
                <Button variant="outline">Save Draft</Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
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
