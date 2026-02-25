"use client";

import { useState } from "react";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/careers/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";
import { Badge } from "@/components/careers/ui/badge";
import { Save, Plus, X, Settings2 } from "lucide-react";
import { useToast } from "@/components/careers/ui/use-toast";
import { jobConfiguration } from "@/lib/jobConfig";

export default function AdminSettings() {
  const { toast } = useToast();
  const [categories, setCategories] = useState(jobConfiguration.categories);
  const [jobTypes, setJobTypes] = useState(jobConfiguration.jobTypes);
  const [experienceLevels, setExperienceLevels] = useState(
    jobConfiguration.experienceLevels,
  );
  const [locations, setLocations] = useState(jobConfiguration.locations);
  const [newItem, setNewItem] = useState("");

  const handleAdd = (list: string[], setList: (items: string[]) => void) => {
    if (newItem.trim() && !list.includes(newItem.trim())) {
      setList([...list, newItem.trim()]);
      setNewItem("");
      toast({
        title: "Added successfully",
        description: "The new item has been added to the list.",
      });
    }
  };

  const handleRemove = (
    item: string,
    list: string[],
    setList: (items: string[]) => void,
  ) => {
    setList(list.filter((i) => i !== item));
    toast({
      title: "Removed",
      description: "The item has been removed from the list.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved!",
      description: "Your configuration has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-primary-500 to-orange-500 bg-clip-text text-transparent">
            <Settings2 className="h-6 w-6" />
            Job Configuration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage categories, types, and other job listing options
          </p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="types">Job Types</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Categories</CardTitle>
              <CardDescription>
                Manage the categories used to classify job listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add new category..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAdd(categories, setCategories)
                  }
                />
                <Button onClick={() => handleAdd(categories, setCategories)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="text-sm py-2 px-3"
                  >
                    {category}
                    <button
                      onClick={() =>
                        handleRemove(category, categories, setCategories)
                      }
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Types Tab */}
        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employment Types</CardTitle>
              <CardDescription>
                Manage the employment types available for job listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add new job type..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAdd(jobTypes, setJobTypes)
                  }
                />
                <Button onClick={() => handleAdd(jobTypes, setJobTypes)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="text-sm py-2 px-3"
                  >
                    {type}
                    <button
                      onClick={() => handleRemove(type, jobTypes, setJobTypes)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Levels Tab */}
        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Experience Levels</CardTitle>
              <CardDescription>
                Manage the experience levels used in job requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add new experience level..."
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    handleAdd(experienceLevels, setExperienceLevels)
                  }
                />
                <Button
                  onClick={() =>
                    handleAdd(experienceLevels, setExperienceLevels)
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {experienceLevels.map((level) => (
                  <Badge
                    key={level}
                    variant="secondary"
                    className="text-sm py-2 px-3"
                  >
                    {level}
                    <button
                      onClick={() =>
                        handleRemove(
                          level,
                          experienceLevels,
                          setExperienceLevels,
                        )
                      }
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Locations</CardTitle>
              <CardDescription>
                Manage the locations available for job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add new location..."
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAdd(locations, setLocations)
                  }
                />
                <Button onClick={() => handleAdd(locations, setLocations)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <Badge
                    key={location}
                    variant="secondary"
                    className="text-sm py-2 px-3"
                  >
                    {location}
                    <button
                      onClick={() =>
                        handleRemove(location, locations, setLocations)
                      }
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
