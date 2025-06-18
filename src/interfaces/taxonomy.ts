import { z } from "zod";

export const newClassItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
  active: z.boolean(),
});

export const choiceSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const one_choiceSchema = z.object({
  list: z.array(choiceSchema),
  value: z.string(),
});

export const multi_choiceSchema = z.object({
  list: z.array(choiceSchema),
  value: z.array(z.string()),
});

export const specialClassSchema = z.object({
  id: z.string(),
  label: z.string(),
  one_choice: one_choiceSchema.optional(),
  multi_choice: multi_choiceSchema.optional(),
  active: z.boolean(),
});

export const inputSchema = z.object({
  double: z.string().optional(),
  one_choice: one_choiceSchema.optional(),
  multi_choice: multi_choiceSchema.optional(),
  newClass: z.array(newClassItemSchema).optional(),
  text: z.string().optional(),
  specialClass: z.array(specialClassSchema).optional(),
});

export const layer4Schema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  input: inputSchema.optional(),
  description: z.string().optional(),
});

export const layer3Schema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  description: z.string().optional(),
  input: inputSchema.optional(),
  children: z.array(layer4Schema).optional(),
});

export const layer2Schema = z.object({
  id: z.string(),
  name: z.string(),
  input: inputSchema.optional(),
  children: z.array(layer3Schema).optional(),
});

export const layer1Schema = z.object({
  id: z.string(),
  name: z.string(),
  children: z.array(layer2Schema).optional(),
});

export const taxonomySchema = z.object({
  layers: z.array(layer1Schema),
});

export type Taxo = z.infer<typeof taxonomySchema>;

export type Layers = z.infer<typeof taxonomySchema>["layers"];

export type L1 = z.infer<typeof taxonomySchema>["layers"][number];

export type L2 = z.infer<typeof layer2Schema>;

export type L3 = z.infer<typeof layer3Schema>;

export type L4 = z.infer<typeof layer4Schema>;

export type InputType = z.infer<typeof inputSchema>;

export type NewClass = z.infer<typeof newClassItemSchema>;

export type SClass = z.infer<typeof specialClassSchema>;

export type OneChoice = z.infer<typeof one_choiceSchema>;
