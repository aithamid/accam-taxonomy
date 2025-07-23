"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

// Types
export interface TaxonomyFileExample {
  id: string;
  name: string;
  jsonfile: Record<string, any>;
}

// File types with embedded JSON structure
const fileTypeList = [
  {
    id: "odd-erena",
    label: "ODD ERENA",
    jsonfile: {"layers":[{"id":"1","name":"Physical Infrastructure","children":[{"id":"1.1","name":"Roadway Type","children":[{"id":"1.1.1","name":"Road category","input":{"one_choice":{"list":[{"id":"1","label":"One-way roads"},{"id":"2","label":"Two-way roads"},{"id":"3","label":"Divided Roads"},{"id":"4","label":"Roads with variable lane assignment"},{"id":"other","label":""}],"value":"1"}},"active":false},{"id":"1.1.2","name":"Specific infrastructure configuration","input":{"multi_choice":{"list":[{"id":"1","label":"Current traffic (not applicable)"},{"id":"2","label":"Distress lane"},{"id":"3","label":"Storage lane"},{"id":"4","label":"Parking"},{"id":"5","label":"Toll booth"},{"id":"6","label":"bridge/viaduct"},{"id":"7","label":"tunnel/underpass"},{"id":"8","label":"ramp"},{"id":"9","label":"intersection Railroad crossing"},{"id":"10","label":"tramway intersection "},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"1.1.3","name":"Eventual roadway use type ","input":{"multi_choice":{"list":[{"id":"1","label":"Roads open to all traffic types (no restriction)"},{"id":"2","label":"Ego-only road"},{"id":"3","label":"Car-only lanes"},{"id":"4","label":"Meeting Zone"},{"id":"5","label":"\"30\" zone"},{"id":"6","label":"Pedestrian walkways"},{"id":"7","label":"Roads closed to motor vehicles"},{"id":"other","label":""}],"value":["1","2"]}},"active":false},{"id":"1.2.1","name":"Use of lanes","input":{"specialClass":[{"id":"1.2.1.1","label":"Use of ego lane","active":false,"one_choice":{"list":[{"id":"1","label":"Ego only traffic lane"},{"id":"2","label":"All traffic"},{"id":"3","label":"Pedestrian zone / soft modes"},{"id":"4","label":"Bus lane"}],"value":"3"}},{"id":"1.2.1.2","label":"Use of left lane","active":false,"one_choice":{"list":[{"id":"1","label":"Shoulder lane"},{"id":"2","label":"All traffic"},{"id":"3","label":"Pedestrian zone / soft modes"},{"id":"4","label":"Bus lane"}],"value":"3"}},{"id":"1.2.1.3","label":"Use of right lane","active":false,"one_choice":{"list":[{"id":"1","label":"Shoulder lane"},{"id":"2","label":"All traffic"},{"id":"3","label":"Pedestrian zone / soft modes"},{"id":"4","label":"Bus lane"}],"value":"3"}}]},"active":false},{"id":"1.2.2","name":"Traffic lanes direction","input":{"specialClass":[{"id":"1.2.2.1","label":"Direction of left traffic lane","active":false,"one_choice":{"list":[{"id":"1","label":"Not applicable"},{"id":"2","label":"Ego direction"},{"id":"3","label":"Opposite direction"}],"value":"1"}},{"id":"1.2.2.2","label":"Direction of right traffic lane","active":false,"one_choice":{"list":[{"id":"1","label":"Not applicable"},{"id":"2","label":"Ego direction"},{"id":"3","label":"Opposite direction"}],"value":"1"}}]},"active":false},{"id":"1.2.3","name":"Element on the lanes not preventing traffic","active":false,"children":[{"id":"1.2.3.1","name":"Possible element on the ego traffic lane not preventing traffic","input":{"multi_choice":{"list":[{"id":"1","label":"Rutting"},{"id":"2","label":"Subsidence"},{"id":"3","label":"Pothole"},{"id":"4","label":"Manhole"},{"id":"5","label":"Fillings"},{"id":"6","label":"Speed bump"},{"id":"7","label":"Speed bump with sound strip"},{"id":"8","label":"Chicane speed bump"},{"id":"9","label":"Lock speed bump"},{"id":"10","label":"Tight curve retarder"},{"id":"11","label":"Cushion-type speed bump"},{"id":"12","label":"Trapezoidal type speed bumps"},{"id":"13","label":"Roadway elevation"},{"id":"14","label":"Railway level crossing platform"},{"id":"15","label":"Parking bumps"},{"id":"other","label":""}],"value":["1","2"]}},"active":false}]},{"id":"1.2.4","name":"Type of pavement surface","input":{"multi_choice":{"list":[{"id":"1","label":"Asphalt pavement"},{"id":"2","label":"Concrete"},{"id":"3","label":"Composite pavement"},{"id":"4","label":"Gravel surface"},{"id":"5","label":"Pavers"},{"id":"6","label":"Thin geo-textile membrane"},{"id":"7","label":"Unpaved"},{"id":"other","label":""}],"value":["1","2"]}},"active":false},{"id":"1.2.5","name":"Luminance of the road surface","input":{"double":""},"active":false},{"id":"1.2.6","name":"Pavement grip coefficient","input":{"double":""},"active":false,"description":"Between 0.5 and 1.2 (mu value)"},{"id":"1.2.7","name":"Road marking contrast","input":{"double":""},"active":false,"description":"Visual contrast between the road marking and the back-ground"}]},{"id":"1.X","name":"Roadway Edge","children":[{"id":"1.X.1","name":"Element of infrastructure adjacent to the lane","active":false,"children":[{"id":"1.X.1.1","name":"Nature of the element of infrastructure adjacent to ego lane on the left side","input":{"multi_choice":{"list":[{"id":"1","label":"Sidewalk"},{"id":"2","label":"Central reservation"},{"id":"3","label":"Fence"},{"id":"4","label":"Wall"},{"id":"5","label":"Tree"},{"id":"6","label":"Angle parking"},{"id":"7","label":"Parallel parking"},{"id":"8","label":"Path"},{"id":"9","label":"Ditch"},{"id":"10","label":"River"},{"id":"11","label":"Ravine"},{"id":"12","label":"Dividing island"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"1.X.1.2","name":"Nature of the element of infrastructure adjacent to ego lane on the right side","input":{"multi_choice":{"list":[{"id":"1","label":"Sidewalk"},{"id":"2","label":"Central reservation"},{"id":"3","label":"Fence"},{"id":"4","label":"Wall"},{"id":"5","label":"Tree"},{"id":"6","label":"Angle parking"},{"id":"7","label":"Parallel parking"},{"id":"8","label":"Path"},{"id":"9","label":"Ditch"},{"id":"10","label":"River"},{"id":"11","label":"Ravine"},{"id":"12","label":"Dividing island"},{"id":"other","label":""}],"value":[]}},"active":false}]}]},{"id":"1.3","name":"Roadway Geometry","children":[{"id":"1.3.1","name":"Width of the lanes","active":false,"children":[{"id":"1.3.1.1","name":"Minimal width of the ego lane","input":{"double":""},"active":false,"description":"In centimeters"}]},{"id":"1.3.3","name":"Radius of curvature","input":{"double":""},"active":false,"description":"In meters"},{"id":"1.3.5","name":"Slope","input":{"double":""},"active":false,"description":"up/down according to sign: -/+ %"}]},{"id":"1.4","name":"Junctions","children":[{"id":"1.4.1","name":"Configuration of the intersection","input":{"multi_choice":{"list":[{"id":"1","label":"X intersection"},{"id":"2","label":"T intersection"},{"id":"3","label":"Y intersection"},{"id":"4","label":"Star intersection"},{"id":"5","label":"Single traffic round about "},{"id":"6","label":"Double traffic round about"},{"id":"7","label":"Triple traffic round about"},{"id":"8","label":"Left turn"},{"id":"10","label":"Merging of lanes"},{"id":"11","label":"Roundabout"},{"id":"12","label":"Railway level crossing platform"},{"id":"13","label":"Tramway lane intersection"},{"id":"14","label":"Ramp in"},{"id":"15","label":"Ramp off"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"1.4.2","name":"Angle of the crossing lanes","active":false,"children":[{"id":"1.4.2.1","name":"Maximal angle between ego lane and intersection branch","input":{"double":""},"active":false,"description":"Between -180 and +180"}]},{"id":"1.4.3","name":"Priority rules","input":{"multi_choice":{"list":[{"id":"1","label":"Right priority lane"},{"id":"2","label":"Priority roundabout"},{"id":"3","label":"Traffic lights"},{"id":"4","label":"Flashing light"},{"id":"5","label":"R24 light"},{"id":"6","label":"YIELD"},{"id":"7","label":"STOP"},{"id":"8","label":"Tramway line priority"},{"id":"9","label":"Priority lane TW"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"1.4.4","name":"Particularity of the intersection","input":{"text":""},"active":false}]},{"id":"1.5","name":"Temporary structures","children":[{"id":"1.5.1","name":"Workzone","input":{"text":""},"active":false},{"id":"1.5.2","name":"FLR","input":{"text":""},"active":false}]},{"id":"1.6","name":"Fixed surroundings structures","children":[{"id":"1.6.1","name":"Constraints on masks from the geo-positioning point of view","input":{"multi_choice":{"list":[{"id":"1","label":"Tunnel"},{"id":"2","label":"Trench"},{"id":"3","label":"Parking / Garage"},{"id":"4","label":"Toll booth"},{"id":"5","label":"Urban canyon"},{"id":"6","label":"Multiple reflections"},{"id":"7","label":"Dense vegetation cover"},{"id":"8","label":"GPS / GNSS Disturbance zone"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"1.6.2","name":"Constraints on masks from the connectivity point of view","input":{"multi_choice":{"list":[{"id":"1","label":"Vegetated area "},{"id":"2","label":"Tunnel"},{"id":"3","label":"Trench"},{"id":"4","label":"Metalic structure"},{"id":"5","label":"Parking/ Garage"},{"id":"6","label":"Toll booth"},{"id":"7","label":"Urban canyon"},{"id":"8","label":"Multiple reflections"},{"id":"9","label":"Radio interference zone"},{"id":"other","label":""}],"value":[]}},"active":false}]},{"id":"1.7","name":"Special structures","children":[{"id":"1.7.1","name":"Marking of cycle zone on the ego lane","input":{"text":""},"active":false}]},{"id":"1.8","name":"Signage","children":[{"id":"1.8.1","name":"Vertical traffic signs","input":{"multi_choice":{"list":[{"id":"1.8.1.1","label":"Type A : hazard"},{"id":"1.8.1.2","label":"Type AB : priorities at intersection"},{"id":"1.8.1.3","label":"Type B : prescriptions"},{"id":"1.8.1.4","label":"Type C : useful indications"},{"id":"1.8.1.5","label":"Type CE : useful services indication"},{"id":"1.8.1.6","label":"Type D : signalization and positioning"},{"id":"1.8.1.7","label":"Type E : entries/end of urban zones"},{"id":"1.8.1.8","label":"Type G : Railway crossing localization"},{"id":"1.8.1.9","label":"Type SR : information for road safety"}],"value":[]}},"active":false},{"id":"1.8.2","name":"Traffic lights","input":{"text":""},"active":false},{"id":"1.8.3","name":"Road markings (horizontal markings)","input":{"text":""},"active":false},{"id":"1.8.4","name":"Guidance equipment","input":{"text":""},"active":false},{"id":"1.8.5","name":"Boundary markers","input":{"text":""},"active":false},{"id":"1.8.6","name":"Closing devices","input":{"text":""},"active":false},{"id":"1.8.7","name":"Dynamic signs ","input":{"text":""},"active":false},{"id":"1.8.8","name":"Temporary signs","input":{"multi_choice":{"list":[{"id":"1.8.8.1","label":"Type AK : Hazard"},{"id":"1.8.8.2","label":"Type K : Specific"},{"id":"1.8.8.3","label":"Type KC : Work-zones"},{"id":"1.8.8.4","label":"Type KD : Lane merging"}],"value":[]}},"active":false},{"id":"1.8.9","name":"Connected equipments","input":{"text":""},"active":false,"description":"Type of equipments"}]},{"id":"1.9","name":"Man-made landmark","children":[{"id":"1.9.1","name":"Infrared objects","input":{"one_choice":{"list":[{"id":"1","label":"On the surface"},{"id":"2","label":"Road side"}],"value":"1"}},"active":false},{"id":"1.9.2","name":"Beacon","input":{"one_choice":{"list":[{"id":"1","label":"On the surface"},{"id":"2","label":"Road side"}],"value":"1"}},"active":false},{"id":"1.9.3","name":"Speed bump","input":{"one_choice":{"list":[{"id":"1","label":"On the surface"},{"id":"2","label":"Road side"}],"value":"1"}},"active":false},{"id":"1.9.4","name":"Electromagnetic","input":{"one_choice":{"list":[{"id":"1","label":"On the surface"},{"id":"2","label":"Road side"}],"value":"1"}},"active":false}]}]},{"id":"2","name":"Scenery","children":[{"id":"2.2","name":"Region / State","children":[{"id":"2.2.1","name":"Region / State","input":{"newClass":[{"id":"1","label":"Country","value":"","active":false},{"id":"2","label":"Geographic Area","value":"","active":false}]},"active":false}]},{"id":"2.3","name":"Interference zones","children":[{"id":"2.3.1","name":"Interference zones","input":{"multi_choice":{"list":[{"id":"1","label":"Tunnels"},{"id":"2","label":"Garages / Parking"},{"id":"other","label":""}],"value":[]}},"active":false}]},{"id":"2.4","name":"Geo-fencing","children":[{"id":"2.4.1","name":"Geo-fencing","input":{"newClass":[{"id":"1","label":"Limitation of the areas in which the travel of ego vehicle is allowed","value":"","active":false}]},"active":false}]},{"id":"2.5","name":"Landmark","children":[{"id":"2.5.1","name":"Landmark","input":{"multi_choice":{"list":[{"id":"1","label":"Bridge"},{"id":"2","label":"Tunnels"},{"id":"3","label":"Specific buildings with specific shapes"},{"id":"4","label":"Signatures at building's roof"},{"id":"5","label":"Electrical poles"},{"id":"6","label":"Wind turbines"},{"id":"other","label":""}],"value":[]}},"active":false}]}]},{"id":"3","name":"Environmental conditions","children":[{"id":"3.1","name":"Weather conditions","children":[{"id":"3.1.1","name":"Rain","input":{"newClass":[{"id":"1","label":"Drop size (µm)","value":"","active":false},{"id":"2","label":"Rain intensity (mm/h)","value":"","active":false},{"id":"3","label":"Opacity level","value":"","active":false},{"id":"4","label":"Speed (m/s)","value":"","active":false},{"id":"5","label":"Direction","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"3.1.2","name":"Snow","input":{"newClass":[{"id":"1","label":"Size (µm)","value":"","active":false},{"id":"2","label":"Visibility (m)","value":"","active":false},{"id":"3","label":"Speed (m/s)","value":"","active":false},{"id":"4","label":"Direction","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"3.1.3","name":"Hail","input":{"newClass":[{"id":"1","label":"Size (µm)","value":"","active":false},{"id":"2","label":"Visibility (m)","value":"","active":false},{"id":"3","label":"Speed (m/s)","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"3.1.4","name":"Fog","input":{"newClass":[{"id":"1","label":"Size (µm)","value":"","active":false},{"id":"2","label":"Visibility (m)","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"3.1.5","name":"Wind","input":{"newClass":[{"id":"1","label":"Speed (m/s)","value":"","active":false},{"id":"2","label":"Speed gradient","value":"","active":false},{"id":"3","label":"Direction","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false}]},{"id":"3.2","name":"Particulates","children":[{"id":"3.2.1","name":"Particulates","input":{"multi_choice":{"list":[{"id":"1","label":"Smoke"},{"id":"2","label":"Sand"},{"id":"3","label":"Dust"},{"id":"4","label":"Wind-blown debris"},{"id":"other","label":""}],"value":[]}},"active":false}]},{"id":"3.3","name":"Weather-induced roadway conditions","children":[{"id":"3.3.1","name":"Road surface state","input":{"multi_choice":{"list":[{"id":"1","label":"Normal"},{"id":"2","label":"Wet"},{"id":"3","label":"Puddles, accumulations"},{"id":"4","label":"Flooded"},{"id":"5","label":"Snowy"},{"id":"6","label":"Muddy"},{"id":"7","label":"Icy"},{"id":"other","label":""}],"value":[]}},"active":false}]},{"id":"3.4","name":"Illumination","children":[{"id":"3.4.1","name":"Illumination level","input":{"double":""},"active":false,"description":"Illumination level in lux"},{"id":"3.4.2","name":"Illumination conditions","input":{"multi_choice":{"list":[{"id":"1","label":"Daylight"},{"id":"2","label":"Night"},{"id":"3","label":"Dusk"},{"id":"4","label":"Dawn"},{"id":"5","label":"Natural light"},{"id":"6","label":"Artificial light"},{"id":"7","label":"Fog"},{"id":"8","label":"Night with public lighting"},{"id":"9","label":"Night without public lighting"},{"id":"10","label":"Sunrise"},{"id":"11","label":"Sunset"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"3.4.3","name":"Interfering illuminances","input":{"multi_choice":{"list":[{"id":"1","label":"Not applicable"},{"id":"2","label":"Passing vehicle headlights"},{"id":"3","label":"Headlights of the following vehicles"},{"id":"4","label":"Position lights of the other vehicles in lane"},{"id":"5","label":"Grazing sun in front"},{"id":"6","label":"Reflections"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"3.4.4","name":"Illumination variation","input":{"text":""},"active":false,"description":"Gradient of illumination variation"}]},{"id":"3.5","name":"Minimum / Maximum ambient air temperature","children":[{"id":"3.5.1","name":"Minimum ambient air temperature","input":{"double":""},"active":false,"description":"In Celsius"},{"id":"3.5.2","name":"Maximum ambient air temperature","input":{"double":""},"active":false,"description":"In Celsius"}]}]},{"id":"4","name":"Traffic conditions","children":[{"id":"4.1","name":"Traffic density","children":[{"id":"4.1.1","name":"Traffic density on the ego direction traffic lane(s)","input":{"one_choice":{"list":[{"id":"1","label":"Fluid (0.75*Vmax < V < Vmax)"},{"id":"2","label":"Dense (0.50*Vmax < V < 0.75* Vmax)"},{"id":"3","label":"Saturated (0.25*Vmax < V < 0.50*Vmax)"},{"id":"4","label":"Blocked (V < 0.25*Vmax)"}],"value":"1"}},"active":false},{"id":"4.1.2","name":"Traffic density on the opposite direction lane(s)","input":{"one_choice":{"list":[{"id":"1","label":"Fluid (0.75*Vmax < V < Vmax)"},{"id":"2","label":"Dense (0.50*Vmax < V < 0.75* Vmax)"},{"id":"3","label":"Saturated (0.25*Vmax < V < 0.50*Vmax)"},{"id":"4","label":"Blocked (V < 0.25*Vmax)"}],"value":"1"}},"active":false},{"id":"4.1.3","name":"Traffic density on ramp in","input":{"one_choice":{"list":[{"id":"1","label":"Fluid (0.75*Vmax < V < Vmax)"},{"id":"2","label":"Dense (0.50*Vmax < V < 0.75* Vmax)"},{"id":"3","label":"Saturated (0.25*Vmax < V < 0.50*Vmax)"},{"id":"4","label":"Blocked (V < 0.25*Vmax)"}],"value":"1"}},"active":false},{"id":"4.1.4","name":"Traffic density on ramp off","input":{"one_choice":{"list":[{"id":"1","label":"Fluid (0.75*Vmax < V < Vmax)"},{"id":"2","label":"Dense (0.50*Vmax < V < 0.75* Vmax)"},{"id":"3","label":"Saturated (0.25*Vmax < V < 0.50*Vmax)"},{"id":"4","label":"Blocked (V < 0.25*Vmax)"}],"value":"1"}},"active":false},{"id":"4.1.5","name":"Traffic density on the crossing lane(s)","input":{"one_choice":{"list":[{"id":"1","label":"Fluid (0.75*Vmax < V < Vmax)"},{"id":"2","label":"Dense (0.50*Vmax < V < 0.75* Vmax)"},{"id":"3","label":"Saturated (0.25*Vmax < V < 0.50*Vmax)"},{"id":"4","label":"Blocked (V < 0.25*Vmax)"}],"value":"1"}},"active":false}]},{"id":"4.2","name":"Road-users (type & speed)","children":[{"id":"4.2.1","name":"Road-users type","active":false,"children":[{"id":"4.2.1.1","name":"Road users type on the ego direction traffic lane(s)","input":{"multi_choice":{"list":[{"id":"1","label":"Pedestrian"},{"id":"2","label":"Bicycle"},{"id":"3","label":"2 Wheel Drive"},{"id":"4","label":"Light vehicles"},{"id":"5","label":"Heavy vehicles"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"4.2.1.2","name":"Road users type on the opposite direction traffic lane(s)","input":{"multi_choice":{"list":[{"id":"1","label":"Pedestrian"},{"id":"2","label":"Bicycle"},{"id":"3","label":"2 Wheel Drive"},{"id":"4","label":"Light vehicles"},{"id":"5","label":"Heavy vehicles"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"4.2.1.3","name":"Road users type on the crossing traffic lane(s)","input":{"multi_choice":{"list":[{"id":"1","label":"Pedestrian"},{"id":"2","label":"Bicycle"},{"id":"3","label":"2 Wheel Drive"},{"id":"4","label":"Light vehicles"},{"id":"5","label":"Heavy vehicles"},{"id":"other","label":""}],"value":[]}},"active":false}]},{"id":"4.2.2","name":"Road-users speed","active":false,"children":[{"id":"4.2.2.1","name":"Road users type on the ego direction traffic lane(s)","input":{"one_choice":{"list":[{"id":"1","label":"Low (30-59 km/h)"},{"id":"2","label":"Medium (60-79 km/h)"},{"id":"3","label":"High (80-130 km/h)"}],"value":""}},"active":false},{"id":"4.2.2.2","name":"Road users type on the opposite direction traffic lane(s)","input":{"one_choice":{"list":[{"id":"1","label":"Low (30-59 km/h)"},{"id":"2","label":"Medium (60-79 km/h)"},{"id":"3","label":"High (80-130 km/h)"}],"value":""}},"active":false},{"id":"4.2.2.3","name":"Road users type on the crossing traffic lane(s)","input":{"one_choice":{"list":[{"id":"1","label":"Low (30-59 km/h)"},{"id":"2","label":"Medium (60-79 km/h)"},{"id":"3","label":"High (80-130 km/h)"}],"value":""}},"active":false}]}]}]},{"id":"5","name":"Digital infrastructure","children":[{"id":"5.1","name":"Type of information","children":[{"id":"5.1.1","name":"GPS Signal","input":{"multi_choice":{"list":[{"id":"1","label":"Simple GPS"},{"id":"2","label":"RTK"},{"id":"3","label":"PPP (Precise Point Positioning)"},{"id":"4","label":"DGPS (Differential GPS)"},{"id":"5","label":"SBAS (Satellite-Based Augmentation System)"},{"id":"other","label":""}],"value":[]}},"active":false,"description":"Signal Type"},{"id":"5.1.2","name":"Radio landmark for geo positioning recalibration","input":{"text":""},"active":false},{"id":"5.1.3","name":"Information expected by the vehicle ","input":{"multi_choice":{"list":[{"id":"1","label":"Temperature"},{"id":"2","label":"Traffic conditions"},{"id":"3","label":"Accident"},{"id":"4","label":"Priority vehicles approaching"},{"id":"5","label":"Traffic light status"},{"id":"6","label":"Weather conditions"},{"id":"7","label":"Mobile equipment position"},{"id":"8","label":"Recommended path"},{"id":"9","label":"Position of the cone"},{"id":"10","label":"Excessive speed warning"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"5.1.4","name":"Information expected by the system","input":{"multi_choice":{"list":[{"id":"1","label":"Position of the cone"},{"id":"2","label":"Topology of the roadwork"},{"id":"other","label":""}],"value":[]}},"active":false}]},{"id":"5.2","name":"Radio access technology","children":[{"id":"5.2.1","name":"Protocol","input":{"newClass":[{"id":"1","label":"V2V","value":"","active":false},{"id":"2","label":"V2I","value":"","active":false},{"id":"3","label":"V2P","value":"","active":false},{"id":"4","label":"V2FLEET","value":"","active":false},{"id":"5","label":"Other","value":"","active":false}]},"active":false,"description":"Please write one of the following radio access technologies for each protocol that you have chosen: 5G, ITS-G5, C-V2X, etc."},{"id":"5.2.2","name":"Technology features","input":{"newClass":[{"id":"1","label":"Communication range (in m)","value":"","active":false},{"id":"2","label":"Covered area (in m2)","value":"","active":false},{"id":"3","label":"Delay (in ms)","value":"","active":false},{"id":"4","label":"Message frequency (in Hertz)","value":"","active":false},{"id":"5","label":"Other","value":"","active":false}]},"active":false}]},{"id":"5.3","name":"Service type","children":[{"id":"5.3.1","name":"C-ITS Day 1 Services","input":{"multi_choice":{"list":[{"id":"1","label":"Slow or stationary vehicle(s) (SSV)"},{"id":"2","label":"Traffic jam ahead warning (TJW)"},{"id":"3","label":"Hazardous location notification (HLN)"},{"id":"4","label":"Road works warning (RWW)"},{"id":"5","label":"Weather conditions (WTC)"},{"id":"6","label":"Emergency brake light (EBL)"},{"id":"7","label":"Emergency vehicle approaching (EVA)"},{"id":"8","label":"In-vehicle signage (VSGN)"},{"id":"9","label":"In-vehicle speed limits (VSPD)"},{"id":"10","label":"Signal violation / Intersection safety (SigV)"}],"value":[]}},"active":false},{"id":"5.3.2","name":"C-ITS Day 1.5 Services","input":{"multi_choice":{"list":[{"id":"1","label":"Infontainment services"},{"id":"2","label":"Vulnerable Road User protection (VRU)"},{"id":"3","label":"Connected and cooperative navigation into and out of the city (CCN)"},{"id":"4","label":"Zone Access Control for urban areas (ZAC)"},{"id":"5","label":"Cooperative Collision Risk Warning (CCRW)"},{"id":"6","label":"MotorCycle Approaching indication (MCA)"},{"id":"7","label":"Wrong Way Driving (WWD)"}],"value":[]}},"active":false},{"id":"5.3.3","name":"C-ITS Day 2 Services","input":{"multi_choice":{"list":[{"id":"1","label":"Vulnerable Road User protection (VRU)"},{"id":"2","label":"Advanced Pre-crash sensing warning (APCSW)"},{"id":"3","label":"Cooperative Adaptive Cruise Control (C-ACC)"},{"id":"4","label":"Cooperative ACC String (C-ACC S)"},{"id":"5","label":"MotorCycle Approaching warning or protection (MAW)"},{"id":"6","label":"Overtaking vehicle warning (OVW)"},{"id":"7","label":"Advanced Intersection Collision Warning (AICW)"},{"id":"8","label":"Road works warning (long term) (RWW LT)"}],"value":[]}},"active":false},{"id":"5.3.4","name":"C-ITS Day 3+ Services","input":{"multi_choice":{"list":[{"id":"1","label":"Advanced Cooperative ACC (String) (ACACC)"},{"id":"2","label":"Target Driving Area Reservation (TDAR)"},{"id":"3","label":"Transition of control notification (ToCN)"},{"id":"4","label":"Improved Vulnerable Road User Protection (IVRUP)"},{"id":"5","label":"Platooning (platoon)"},{"id":"6","label":"Co-operative merging assistance (CM)"},{"id":"7","label":"Cooperative lane change (CLC)"},{"id":"8","label":"Cooperative overtaking (CO)"},{"id":"9","label":"Cooperative ACC string management (CACCS M)"},{"id":"10","label":"Cooperative Transition of Control (CToC)"}],"value":[]}},"active":false},{"id":"5.3.5","name":"Augmented CCAM Services","input":{"multi_choice":{"list":[{"id":"1","label":"Equipped VRUs protection"},{"id":"2","label":"UAV based VRU protection for closed environments"},{"id":"3","label":"Road workers in the field"},{"id":"4","label":"Insertion (on current lane or on insertion lane)"},{"id":"5","label":"Temporary road works"},{"id":"6","label":"Non-equipped VRU protection"},{"id":"7","label":"Localisation of assets and CCAM vehicles"},{"id":"8","label":"Minimum risk manœuvre"},{"id":"9","label":"Optimised logistic operation of AVs leveraging on advanced digital technologies and DT"},{"id":"10","label":"Emergency vehicle approaching"},{"id":"11","label":"Traffic management optimization"}],"value":[]}},"active":false}]},{"id":"5.4","name":"Road side sensors","children":[{"id":"5.4.1","name":"Type of sensors","input":{"multi_choice":{"list":[{"id":"1","label":"Camera"},{"id":"2","label":"Inductive loop"},{"id":"3","label":"Radar"},{"id":"4","label":"Lidar"},{"id":"5","label":"GPS"},{"id":"6","label":"Meteorogical sensors"},{"id":"7","label":"RSU"},{"id":"other","label":""}],"value":[]}},"active":false},{"id":"5.4.2","name":"Type of service","input":{"multi_choice":{"list":[{"id":"1","label":"Localization"},{"id":"2","label":"Accident/incident detection"},{"id":"3","label":"Traffic density assessment"},{"id":"4","label":"Traveling time estimation"},{"id":"5","label":"Weather condition assessment"},{"id":"6","label":"Distance of visibility"},{"id":"7","label":"Risk assessment"},{"id":"8","label":"Object detection (box, part of a car, rock, tree branch, etc.)"},{"id":"other","label":""}],"value":[]}},"active":false,"description":"Optional"}]},{"id":"5.5","name":"HD Maps","children":[{"id":"5.5.1","name":"Layer 1 : Road network and traffic guidance objects","input":{"text":""},"active":false,"description":"Includes Roadwork geometry, Road shoulders and sidewalks, Parking spaces, Road markings, Traffic signs and traffic lights, Intersections, Pedestrian crossing, Bicycle lane, Speed bumps"},{"id":"5.5.2","name":"Layer 2 : Roadside structures and permanent furniture","input":{"text":""},"active":false,"description":"Includes Buildings, Tunnels, Bridges, Road side furniture : bench, bus station, Vegetation (grass, trees, bushes), Safety furniture: guardrails, construction plot, barrier, concrete separator, Street lamps, Road signs: advertising boards and pillars"},{"id":"5.5.3","name":"Layer 3 : Temporary modification of Level1 and Level2","input":{"text":""},"active":false,"description":"Includes Roadwork signs, Temporary road marking, Covered road marking, Fallen branch and tree on the road surface, Pothole, Speed bump"},{"id":"5.5.4","name":"Layer 4 : Static and dynamic modeling","input":{"text":""},"active":false,"description":"Includes Vehicles (moving and non moving): conventional car, pick-up, shuttle, bus, truck (with or without trailer), Vulnerable (pedestrian, cyclist, motorcyclist), Animals (flying, walking), Moving objects (box, tree, falling, flying leave and papers, ball, beverage can,...), Static objects (box, tree and branch, leave, ball, beverage can,...), Ground truth: observers, mask, bounding boxes"},{"id":"5.5.5","name":"Layer 5 : Environment conditions and disturbers","input":{"text":""},"active":false,"description":"Includes Adverse and degraded conditions: Rain, snow, fog, dust, Energy sources: sun, lamp, heat, electromagnetic wave, front headlight, Wind, Shadows and cloud effect, Specific effect on material (environment reflection,...)"},{"id":"5.5.6","name":"Layer 6 : Digital information and sensors","input":{"text":""},"active":false,"description":"Includes State of traffic lights and switchable traffic signs, Variable message sign, V2X messages, Cellular network coverage, Infra sensors (LiDAR, RADAR, camera (IR, neuromorphic, cyclop, fisheye,...)), GPS and satellite constellation (ref station), Road Side Unit, Meteo station"},{"id":"5.5.7","name":"Layer 7 : Ego-vehicle","active":false}]}]},{"id":"6","name":"Vehicle Features","children":[{"id":"6.1","name":"ADAS features","children":[{"id":"6.1.1","name":"Level of automation","input":{"one_choice":{"list":[{"id":"1","label":"Level 0"},{"id":"2","label":"Level 1"},{"id":"3","label":"Level 2"},{"id":"4","label":"Level 3"},{"id":"5","label":"Level 4"},{"id":"6","label":"Level 5"}],"value":""}},"active":false},{"id":"6.1.2","name":"Type of actuator","input":{"newClass":[{"id":"1","label":"Steering wheel","value":"","active":false},{"id":"2","label":"Pedals","value":"","active":false},{"id":"3","label":"Wheels","value":"","active":false},{"id":"4","label":"Electrical motors","value":"","active":false},{"id":"5","label":"Type of order (torques, acc, pressure (newton), ...)","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"6.1.3","name":"Sensors","input":{"newClass":[{"id":"1","label":"Camera","value":"","active":false},{"id":"2","label":"Radar","value":"","active":false},{"id":"3","label":"Lidar","value":"","active":false},{"id":"4","label":"GPS","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"6.1.4","name":"Perception","input":{"newClass":[{"id":"1","label":"Obstacle detection","value":"","active":false},{"id":"2","label":"Tracking","value":"","active":false},{"id":"3","label":"Recognition","value":"","active":false},{"id":"4","label":"Road markings and lanes detection","value":"","active":false},{"id":"5","label":"Localisation","value":"","active":false},{"id":"6","label":"Situation recognition","value":"","active":false},{"id":"7","label":"Risk assessment","value":"","active":false},{"id":"8","label":"Free navigation area","value":"","active":false},{"id":"9","label":"FoV","value":"","active":false},{"id":"10","label":"Range","value":"","active":false},{"id":"11","label":"Resolution","value":"","active":false},{"id":"12","label":"Period of data updating","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"6.1.5","name":"Decision-making","input":{"newClass":[{"id":"1","label":"Rule based system","value":"","active":false},{"id":"2","label":"AI-based methods","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"6.1.6","name":"Path-planning","input":{"newClass":[{"id":"1","label":"Type of environment modeling (trajectory, area with constraints, graph)","value":"","active":false},{"id":"2","label":"Definition of the limit of usability","value":"","active":false},{"id":"3","label":"Type of generated trajectory, path, manoeuvers","value":"","active":false},{"id":"6","label":"Limits of the trajectory modeling (max curvature)","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false},{"id":"6.1.7","name":"Control/command","input":{"text":""},"active":false,"description":"Functionalities"},{"id":"6.1.8","name":"Communication","input":{"newClass":[{"id":"1","label":"Type of communication","value":"","active":false},{"id":"2","label":"Protocol","value":"","active":false},{"id":"3","label":"Antenna diagram","value":"","active":false},{"id":"4","label":"Multiple hop","value":"","active":false},{"id":"5","label":"Range of communication","value":"","active":false},{"id":"6","label":"Routing strategy","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false}]},{"id":"6.2","name":"Dynamic capabilities","children":[{"id":"6.2.1","name":"Maximum speed of ego vehicle","input":{"double":""},"active":false,"description":"In km/h"},{"id":"6.2.2","name":"Acceleration","input":{"newClass":[{"id":"1","label":"Maximum acceleration (m/s²)","value":"","active":false},{"id":"2","label":"Maximum torque (Newton-meter)","value":"","active":false}]},"active":false},{"id":"6.2.3","name":"Maneuvers","active":false,"children":[{"id":"1","name":"Maneuvers type","input":{"multi_choice":{"list":[{"id":"1","label":"Straight ahead"},{"id":"2","label":"Straight ahead reverse"},{"id":"3","label":"Ramp insertion"},{"id":"4","label":"Ramp exit"},{"id":"5","label":"Turning on the road"},{"id":"6","label":"Lane change left"},{"id":"7","label":"Lane change right"},{"id":"8","label":"Turn left"},{"id":"9","label":"Turn right"},{"id":"10","label":"Overtaking"},{"id":"11","label":"Emergency lane parking"},{"id":"12","label":"Stop maneuver"},{"id":"13","label":"Herringbone parking maneuver"},{"id":"14","label":"In-line parking maneuver"},{"id":"15","label":"Station stop"},{"id":"other","label":""}],"value":[]}},"active":false,"description":"Maneuvers the ego vehicle can perform"},{"id":"2","name":"Condition of achievement (for each maneuver)","input":{"newClass":[{"id":"1","label":"Minimum length","value":"","active":false},{"id":"2","label":"Minimum track width","value":"","active":false},{"id":"3","label":"Maximum angle","value":"","active":false},{"id":"4","label":"Maximum slope","value":"","active":false},{"id":"other","label":"Other","value":"","active":false}]},"active":false}]},{"id":"6.2.8","name":"Tire state","input":{"newClass":[{"id":"1","label":"Tire grip","value":"","active":false},{"id":"2","label":"Tire pressure","value":"","active":false},{"id":"3","label":"Slippage rate G","value":"","active":false}]},"active":false,"description":"For Tire grip : 0.5-1 (Mu value), for Tire pressure : in bar, for Slippage rate G : in %"},{"id":"6.2.9","name":"Braking system","input":{"newClass":[{"id":"1","label":"Braking torque (Newton-meter)","value":"","active":false},{"id":"2","label":"Deceleration capability (m/s²)","value":"","active":false}]},"active":false},{"id":"6.2.10","name":"Steering capability","input":{"newClass":[{"id":"1","label":"Field of reachable angles","value":"","active":false},{"id":"2","label":"Max steering angle (Turning radius)","value":"","active":false}]},"active":false}]},{"id":"6.3","name":"Type and size","children":[{"id":"6.3.1","name":"Vehicle body (size)","input":{"newClass":[{"id":"1","label":"Length","value":"","active":false},{"id":"2","label":"Width","value":"","active":false},{"id":"3","label":"Height","value":"","active":false}]},"active":false,"description":"For each dimension, please provide the value in centimeters"},{"id":"6.3.2","name":"Vehicle type","input":{"one_choice":{"list":[{"id":"1","label":"Light car"},{"id":"2","label":"Heavy car"},{"id":"3","label":"Pick-up"},{"id":"4","label":"Shuttle"},{"id":"5","label":"Bus"},{"id":"6","label":"Mini bus"},{"id":"7","label":"Truck (with or without trailer)"},{"id":"8","label":"SUV"},{"id":"9","label":"4DW"},{"id":"other","label":""}],"value":""}},"active":false},{"id":"6.3.3","name":"Trailer","input":{"newClass":[{"id":"1","label":"Number","value":"","active":false},{"id":"2","label":"Size","value":"","active":false}]},"active":false}]}]}]}
  },
];

// Form schema for adding
const typeformSchema = z.object({
  filename: z.string().min(2).max(50),
  filetypeId: z.string(),
});

// Form schema for renaming
const renameFormSchema = z.object({
  name: z.string().min(2).max(50),
  fileId: z.string(),
});

export default function Dashboard() {
  const [files, setFiles] = useState<TaxonomyFileExample[] | null>(null);

  // Initialize files from localStorage
  useEffect(() => {
    const storedFiles = localStorage.getItem("taxonomyFiles");
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    } else {
      setFiles([]);
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (files !== null) {
      localStorage.setItem("taxonomyFiles", JSON.stringify(files));
    }
  }, [files]);

  const form = useForm<z.infer<typeof typeformSchema>>({
    resolver: zodResolver(typeformSchema),
    defaultValues: {
      filename: "",
      filetypeId: fileTypeList[0].id,
    },
  });

  const handleAddFile = (data: z.infer<typeof typeformSchema>) => {
    const selectedType = fileTypeList.find((t) => t.id === data.filetypeId);
    if (!selectedType) return;

    const newFile: TaxonomyFileExample = {
      id: crypto.randomUUID(),
      name: data.filename,
      jsonfile: selectedType.jsonfile,
    };

    setFiles((prev) => (prev ? [...prev, newFile] : [newFile]));
    form.reset();
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => (prev ? prev.filter((file) => file.id !== id) : []));
  };

  const handleDuplicate = (file: TaxonomyFileExample) => {
    const duplicateFile = {
      ...file,
      id: crypto.randomUUID(),
      name: `${file.name} (Copy)`,
    };
    setFiles((prev) => (prev ? [...prev, duplicateFile] : [duplicateFile]));
  };

  const handleRename = (id: string, newName: string) => {
    setFiles((prev) =>
      (prev ?? []).map((file) =>
        file.id === id ? { ...file, name: newName } : file
      )
    );
  };

  return (
    <>
      <nav className="bg-gray-800 text-white px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
        <Link href={`/`}>
          <h1 className="E-mail ml-2 text-xl font-semibold">ACCAM Taxonomy</h1>
        </Link>
        </div>
      </div>
    </nav>
      <div className="text-center my-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage your taxonomy files</p>
      </div>

      {/* Add file form */}
      <div className="flex justify-center mb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddFile)}
            className="flex items-center gap-4"
          >
            <Input
              placeholder="File name"
              {...form.register("filename")}
              className="w-64"
            />
            <FormField
              control={form.control}
              name="filetypeId"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="File Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fileTypeList.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Create</Button>
          </form>
        </Form>
      </div>

      {/* File list */}
      <div className="grid place-items-center">
        <div className="w-3/4">
          <h2 className="text-xl font-semibold mb-4 text-center">Your Files</h2>
          <ul>
            {files !== null && files.map((file) => (
              <Card key={file.id} className="h-14 p-2 m-3">
                <div className="flex justify-between items-center ">
                  <div>
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/files/${file.id}`}>
                      <Button >Modify</Button>
                    </Link>
                    <EditFileName file={file} onRename={handleRename} />
                    <Button className="bg-green-400 hover:bg-green-200 text-white" variant="outline" onClick={() => handleDuplicate(file)}>
                      Duplicate
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-400"
                      onClick={() => handleDelete(file.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

// EditFileName embedded directly
function EditFileName({
  file,
  onRename,
}: {
  file: TaxonomyFileExample;
  onRename: (id: string, newName: string) => void;
}) {
  const form = useForm<z.infer<typeof renameFormSchema>>({
    resolver: zodResolver(renameFormSchema),
    defaultValues: {
      name: file.name,
      fileId: file.id,
    },
  });

  const onSubmit = (data: z.infer<typeof renameFormSchema>) => {
    onRename(data.fileId, data.name);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-yellow-400 hover:bg-yellow-200 text-white " variant="outline">Edit name</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit file name</SheetTitle>
          <SheetDescription>
            Change your file name here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  File name
                </Label>
                <Input
                  {...form.register("name")}
                  type="text"
                  defaultValue={file.name}
                  className="col-span-3"
                />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Save changes</Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
