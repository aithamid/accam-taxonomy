import React, { useEffect, useState } from "react";
import { L3 } from "@/interfaces/taxonomy";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormLabel,
  FormDescription,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import Layer4Component from "@/components/taxonomy/layer4";
import InputComponent from "./input";

const Layer3Component: React.FC<{
  layer3: L3;
  form: any;
  child: string;
}> = ({ layer3, form, child }) => {
  const him = child;
  const fieldName = `${him}.active`;

  // Ajout d'un état local pour suivre l'état actif
  const [isActive, setIsActive] = useState(layer3.active);

  // Utiliser useEffect pour définir la valeur initiale de `active` dans le formulaire et initialiser l'état local
  useEffect(() => {
    form.setValue(fieldName, layer3.active);
    setIsActive(layer3.active); // Initialise l'état local avec la valeur de `layer3.active`
  }, [form, fieldName, layer3.active]);

  return (
    <div className="rounded-lg border p-3 shadow-sm space-y-0.5 my-3">
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <FormLabel>{layer3.name}</FormLabel>
              {isActive && layer3.description && (
                <FormDescription>{layer3.description}</FormDescription>
              )}
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(value) => {
                  form.setValue(fieldName, value);
                  setIsActive(value); // Met à jour l'état local lorsque l'utilisateur modifie le switch
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="">
        {isActive && layer3.input !== undefined && (
          <InputComponent
            input={layer3.input}
            form={form}
            him={him + ".input"}
          />
        )}
        {isActive &&
          layer3.children &&
          layer3.children.map((layer4, index) => (
            <Layer4Component
              key={layer4.id}
              layer4={layer4}
              form={form}
              child={`${him}.children[${index}]`}
            />
          ))}
      </div>
    </div>
  );
};

export default Layer3Component;
