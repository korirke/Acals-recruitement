"use client";

import * as React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/careers/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/careers/ui/accordion";
import { Badge } from "@/components/careers/ui/badge";
import type { JobEditorSection } from "./jobEditorMap";

function LabelWithCount({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="leading-none">{label}</span>
      {count && count > 0 ? (
        <Badge className="bg-red-600 text-white px-2 py-0.5 text-xs leading-none">
          {count}
        </Badge>
      ) : null}
    </div>
  );
}

export function JobEditorSections(props: {
  section: JobEditorSection;
  setSection: (s: JobEditorSection) => void;
  errorCounts: Record<JobEditorSection, number>;
  basic: React.ReactNode;
  location: React.ReactNode;
  salary: React.ReactNode;
  content: React.ReactNode;
}) {
  const c = props.errorCounts;

  return (
    <>
      {/* =========================
          Mobile (Accordion)
         ========================= */}
      <div className="lg:hidden space-y-4">
        <Accordion
          type="single"
          collapsible
          value={props.section}
          onValueChange={(v) => v && props.setSection(v as JobEditorSection)}
          className="space-y-3"
        >
          <AccordionItem
            value="basic"
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 px-2"
          >
            <AccordionTrigger className="px-3 py-4 text-left">
              <LabelWithCount label="Basic" count={c.basic} />
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-5 pt-2">
              <div className="space-y-6">{props.basic}</div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="location"
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 px-2"
          >
            <AccordionTrigger className="px-3 py-4 text-left">
              <LabelWithCount label="Location" count={c.location} />
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-5 pt-2">
              <div className="space-y-6">{props.location}</div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="salary"
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 px-2"
          >
            <AccordionTrigger className="px-3 py-4 text-left">
              <LabelWithCount label="Salary" count={c.salary} />
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-5 pt-2">
              <div className="space-y-6">{props.salary}</div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="content"
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 px-2"
          >
            <AccordionTrigger className="px-3 py-4 text-left">
              <LabelWithCount label="Content" count={c.content} />
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-5 pt-2">
              <div className="space-y-6">{props.content}</div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* =========================
          Desktop (Tabs)
         ========================= */}
      <div className="hidden lg:block">
        <Tabs
          value={props.section}
          onValueChange={(v) => props.setSection(v as JobEditorSection)}
        >
          {/* Tabs bar */}
          <div className="sticky top-20 z-10 mx-0 mb-5">
            <TabsList
              className={[
                "w-full justify-start gap-2",
                "rounded-2xl border border-neutral-200 dark:border-neutral-800",
                "bg-white/80 dark:bg-neutral-950/60 backdrop-blur",
                "px-2 py-2",
              ].join(" ")}
            >
              <TabsTrigger
                value="basic"
                className="rounded-xl px-4 py-2.5 data-[state=active]:shadow-sm"
              >
                <LabelWithCount label="Basic" count={c.basic} />
              </TabsTrigger>

              <TabsTrigger
                value="location"
                className="rounded-xl px-4 py-2.5 data-[state=active]:shadow-sm"
              >
                <LabelWithCount label="Location" count={c.location} />
              </TabsTrigger>

              <TabsTrigger
                value="salary"
                className="rounded-xl px-4 py-2.5 data-[state=active]:shadow-sm"
              >
                <LabelWithCount label="Salary" count={c.salary} />
              </TabsTrigger>

              <TabsTrigger
                value="content"
                className="rounded-xl px-4 py-2.5 data-[state=active]:shadow-sm"
              >
                <LabelWithCount label="Content" count={c.content} />
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Section content spacing wrapper: */}
          <div className="space-y-10">
            <TabsContent
              value="basic"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="space-y-6">{props.basic}</div>
            </TabsContent>

            <TabsContent
              value="location"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="space-y-6">{props.location}</div>
            </TabsContent>

            <TabsContent
              value="salary"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="space-y-6">{props.salary}</div>
            </TabsContent>

            <TabsContent
              value="content"
              className="mt-0 focus-visible:outline-none"
            >
              <div className="space-y-6">{props.content}</div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}
