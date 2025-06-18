import React, { useEffect, useState } from "react";
import { L4 } from "@/interfaces/taxonomy";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormLabel,
  FormDescription,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import InputComponent from "./input";

const Layer4Component: React.FC<{
  layer4: L4;
  form: any;
  child: string;
}> = ({ layer4, form, child }) => {
  const him = child;
  const fieldName = `${him}.active`;
  const doubleFieldName = `${him}.double`;

  const [isActive, setIsActive] = useState(layer4.active);

  // Utiliser useEffect pour définir la valeur initiale de `active` dans le formulaire et initialiser l'état local
  useEffect(() => {
    form.setValue(fieldName, layer4.active);
    setIsActive(layer4.active); // Initialise l'état local avec la valeur de `layer3.active`
  }, [form, fieldName, layer4.active]);

  return (
    <div className="pt-3">
      <div className="rounded-lg border p-3  shadow-sm space-y-0.5">
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>{layer4.name}</FormLabel>
                <FormDescription>{layer4.description}</FormDescription>
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
        {isActive && layer4.input !== undefined && (
          <InputComponent
            input={layer4.input}
            form={form}
            him={him + ".input"}
          />
        )}
      </div>
    </div>
  );
};

export default Layer4Component;
