// components/Layer1Component.tsx
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import Layer2Component from "@/components/taxonomy/layer2";
import { Accordion } from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { L1 } from "@/interfaces/taxonomy";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flow } from "@/components/diagram/index";
import { DataHandler } from "../diagram/datahandler";

const Layer1Component: React.FC<{ Layer1: L1; child: string; form: any }> = ({
  Layer1,
  form,
  child,
}) => {
  const him = child;
  return (
    <TabsContent value={Layer1.id} className="space-y-4">
      <div className="container relative hidden flex-col items-start justify-center md:grid max-w-none grid-cols-2 px-0">
        <div className="">
          <ScrollArea className="rounded-md border p-4 m-4 h-[60vh]">
            {Layer1.children &&
              Layer1.children.map((layer2, index) => (
                <Layer2Component
                  key={layer2.id}
                  layer2={layer2}
                  form={form}
                  child={him + `.children[${index}]`}
                />
              ))}
          </ScrollArea>
        </div>
        <div className="items-center rounded-md border h-full">
          <div>
            <DataHandler layer1={Layer1} />
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default Layer1Component;
