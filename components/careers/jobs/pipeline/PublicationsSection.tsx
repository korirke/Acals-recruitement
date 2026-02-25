"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/careers/ui/card";
import { Button } from "@/components/careers/ui/button";
import { Input } from "@/components/careers/ui/input";
import { Label } from "@/components/careers/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/careers/ui/select";
import { BookOpen, Plus, Trash2, CheckCircle2, Link as LinkIcon } from "lucide-react";

interface Props {
  data: any[];
  onChange: (data: any[]) => void;
  existingPublications: any[];
}

export default function PublicationsSection({ data, onChange, existingPublications }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [currentPub, setCurrentPub] = useState({
    title: "",
    type: "Journal",
    journalOrPublisher: "",
    year: new Date().getFullYear(),
    link: "",
  });

  const handleAdd = () => {
    if (!currentPub.title || !currentPub.year) return;
    onChange([...data, { ...currentPub }]);
    setCurrentPub({
      title: "",
      type: "Journal",
      journalOrPublisher: "",
      year: new Date().getFullYear(),
      link: "",
    });
    setShowForm(false);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary-500" />
              Publications <span className="text-red-500">*</span>
            </CardTitle>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Research papers, journal articles, books, or conference papers
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            type="button"
            variant={showForm ? "outline" : "default"}
            size="sm"
          >
            {showForm ? "Cancel" : <><Plus className="h-4 w-4 mr-2" />Add</>}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Existing */}
        {existingPublications.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Already in your profile
              </Label>
            </div>
            <div className="space-y-2">
              {existingPublications.map((pub) => (
                <div
                  key={pub.id}
                  className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
                >
                  <p className="font-semibold text-neutral-900 dark:text-white text-sm">{pub.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {pub.type} · {pub.year}
                    {pub.journalOrPublisher && ` · ${pub.journalOrPublisher}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New */}
        {data.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-green-700 dark:text-green-300">
              Adding now
            </Label>
            <div className="space-y-2">
              {data.map((pub, index) => (
                <div
                  key={index}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-900 dark:text-green-200 text-sm">{pub.title}</p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      {pub.type} · {pub.year}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRemove(index)}
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="space-y-4 p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Publication Title <span className="text-red-500">*</span>
              </Label>
              <Input
                value={currentPub.title}
                onChange={(e) => setCurrentPub({ ...currentPub, title: e.target.value })}
                placeholder="e.g. Machine Learning Approaches in Healthcare"
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Publication Type</Label>
                <Select
                  value={currentPub.type}
                  onValueChange={(value) => setCurrentPub({ ...currentPub, type: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Journal">Journal Article</SelectItem>
                    <SelectItem value="Conference">Conference Paper</SelectItem>
                    <SelectItem value="Book">Book</SelectItem>
                    <SelectItem value="Chapter">Book Chapter</SelectItem>
                    <SelectItem value="Report">Technical Report</SelectItem>
                    <SelectItem value="Thesis">Thesis / Dissertation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Year <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={currentPub.year}
                  onChange={(e) => setCurrentPub({ ...currentPub, year: parseInt(e.target.value) })}
                  min={1950}
                  max={new Date().getFullYear()}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Journal / Publisher</Label>
              <Input
                value={currentPub.journalOrPublisher}
                onChange={(e) => setCurrentPub({ ...currentPub, journalOrPublisher: e.target.value })}
                placeholder="e.g. Nature, IEEE, Springer"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Link (Optional)</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                <Input
                  type="url"
                  value={currentPub.link}
                  onChange={(e) => setCurrentPub({ ...currentPub, link: e.target.value })}
                  placeholder="https://doi.org/..."
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={handleAdd} type="button" className="flex-1">
                Add Publication
              </Button>
              <Button onClick={() => setShowForm(false)} type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {data.length === 0 && existingPublications.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <BookOpen className="h-4 w-4 text-orange-600 shrink-0" />
            <p className="text-sm text-orange-900 dark:text-orange-200">
              At least 1 publication is required for this position
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
