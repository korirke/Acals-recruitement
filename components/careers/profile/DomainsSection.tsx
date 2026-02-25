"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { candidateService } from "@/services/recruitment-services";
import { Plus, X, Loader2, Star, Sparkles } from "lucide-react";
import type { CandidateProfile, Domain } from "@/types";

interface DomainsSectionProps {
  profile: CandidateProfile | null;
  onUpdate: () => void;
}

export default function DomainsSection({
  profile,
  onUpdate,
}: DomainsSectionProps) {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDomains, setAvailableDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    fetchAvailableDomains();
  }, []);

  const fetchAvailableDomains = async () => {
    try {
      const response = await candidateService.getAvailableDomains();
      if (response.success && response.data) {
        setAvailableDomains(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch domains:", error);
    }
  };

  const handleAddDomain = async () => {
    if (!selectedDomain) {
      toast({
        title: "Validation Error",
        description: "Please select a domain",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await candidateService.addDomain({
        domainId: selectedDomain,
        isPrimary,
      });
      toast({
        title: "Domain Added",
        description: "Your domain has been added successfully",
      });
      setSelectedDomain("");
      setIsPrimary(false);
      setIsAdding(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add domain",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDomain = async (domainId: string) => {
    try {
      setIsLoading(true);
      await candidateService.removeDomain(domainId);
      toast({
        title: "Domain Removed",
        description: "Domain has been removed from your profile",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove domain",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userDomainIds = profile?.domains?.map((d) => d.domain.id) || [];
  const filteredDomains = availableDomains.filter(
    (d) => !userDomainIds.includes(d.id),
  );

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              Expertise Domains
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400 mt-1">
              Select your areas of expertise to help employers find you
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            variant={isAdding ? "outline" : "default"}
            size="sm"
            className={
              isAdding
                ? "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                : "bg-primary-500 hover:bg-primary-600 text-white"
            }
          >
            {isAdding ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <Card className="bg-neutral-50 dark:bg-neutral-800/50 border-2 border-dashed border-neutral-300 dark:border-neutral-700 shadow-inner">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="domain"
                  className="text-neutral-900 dark:text-white font-medium"
                >
                  Select Domain
                </Label>
                <Select
                  value={selectedDomain}
                  onValueChange={setSelectedDomain}
                >
                  <SelectTrigger className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
                    <SelectValue placeholder="Choose a domain..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700">
                    {filteredDomains.map((domain) => (
                      <SelectItem
                        key={domain.id}
                        value={domain.id}
                        className="text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <Checkbox
                  id="isPrimary"
                  checked={isPrimary}
                  onCheckedChange={(checked) =>
                    setIsPrimary(checked as boolean)
                  }
                  className="border-orange-400 dark:border-orange-600"
                />
                <Label
                  htmlFor="isPrimary"
                  className="text-sm font-medium text-orange-900 dark:text-orange-200 cursor-pointer"
                >
                  <Star className="h-3 w-3 inline mr-1" />
                  Set as primary domain
                </Label>
              </div>
              <Button
                onClick={handleAddDomain}
                disabled={isLoading || !selectedDomain}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Domain"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {profile?.domains && profile.domains.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2">
            {profile.domains.map((candidateDomain) => (
              <div
                key={candidateDomain.id}
                className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-200 group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      {candidateDomain.domain.name}
                    </h4>
                    {candidateDomain.isPrimary && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  {candidateDomain.domain.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                      {candidateDomain.domain.description}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleRemoveDomain(candidateDomain.domain.id)}
                  variant="ghost"
                  size="icon"
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No domains added yet</p>
            <p className="text-sm mt-1">
              Click "Add Domain" to showcase your expertise
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
