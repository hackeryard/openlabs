"use client";

import SelectionSort from "@/app/components/computer-science/dsa/sorting/SelectionSort";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProjects } from "@/app/hooks/useProjects";
import { Cloud } from 'lucide-react';



export default function Merge() {

 return(
    <div>
        <SelectionSort/>
    </div>
 )
}