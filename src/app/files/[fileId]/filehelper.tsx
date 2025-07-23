// pages/index.tsx
"use client";

import React, { useState } from "react";
import Layer1Component from "@/components/taxonomy/layer1";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Layers, Taxo, taxonomySchema } from "@/interfaces/taxonomy";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { GlobalView } from "@/components/diagram/datahandler";
import { TaxonomyFileExample } from "@/app/dashboard/page";

export function FileRenderer(file : TaxonomyFileExample) {
  const json = file.jsonfile as Taxo;
  const [layers, setLayers] = useState<Layers>(json.layers);

  function handleLayersUpdate(updatedLayers: Layers) {
    setLayers(updatedLayers);
  }

  const form = useForm<z.infer<typeof taxonomySchema>>({
    resolver: zodResolver(taxonomySchema),
    defaultValues: {
      layers: layers,
    },
  });

  function onChange(data: z.infer<typeof taxonomySchema>) {
    handleLayersUpdate(data.layers);
    onSubmit(data);
  }

  function onSubmit(data: z.infer<typeof taxonomySchema>) {
    // Get taxonomy file from form localstorage
    const taxonomyFiles = window.localStorage.getItem("taxonomyFiles");
    if (!taxonomyFiles) {
      console.error("No taxonomy files found in localStorage");
      return;
    }
    
    const parsedFiles = JSON.parse(taxonomyFiles) as TaxonomyFileExample[];
    const fileIndex = parsedFiles.findIndex((f) => f.id === file.id);
    if (fileIndex === -1) {
      console.error("File not found in localStorage");
      return;
    }

    // Update the file in localStorage
    parsedFiles[fileIndex].jsonfile = data;
    window.localStorage.setItem("taxonomyFiles", JSON.stringify(parsedFiles));
  }

  return (
    <div>
      <div className="h-full">
        <div className="px-8 h-full">
          <div className="flex items-center justify-between my-3">
          </div>
          <Form {...form}>
            <form
              onChange={form.handleSubmit(onChange)}
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full"
            >
              <Tabs defaultValue={layers[0].id} className="space-y-4">
                <div className="flex">
                  <TabsList>
                    {layers.map((layer1) => (
                      <TabsTrigger
                        key={layer1.id}
                        value={layer1.id}
                        className="text-l"
                      >
                        {layer1.name}
                      </TabsTrigger>
                    ))}
                    <TabsTrigger key="all" value="all" className="text-l">
                      Global view
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex-1 text-right  text-2xl font-semibold grid-cols-2  items-start">
                    <h1>ODD Descriptor - {file.name}</h1>
                    <Button type="submit" className="text-right"
                    onClick={() => {
                      toast({
                        title: "File updated!",
                        description: "The file has been updated successfully! 🎉",
                      })
                    }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
                {layers.map((layer1, index) => (
                  <div key={layer1.id}>
                    <Layer1Component
                      Layer1={layer1}
                      child={`layers[${index}]`}
                      form={form}
                    />
                  </div>
                ))}
                <div key="all" className="">
                  <TabsContent
                    value="all"
                    className="space-y-4 rounded-lg border p-3 shadow-sm relative"
                  >
                    <GlobalView layers={layers} />
                  </TabsContent>
                </div>
              </Tabs>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
