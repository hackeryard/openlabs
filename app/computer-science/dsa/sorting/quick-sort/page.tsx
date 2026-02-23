"use client";

import QuickSort from "@/app/components/computer-science/dsa/sorting/QuickSort";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProjects } from "@/app/hooks/useProjects";
import { Cloud } from 'lucide-react';



export default function Quick() {

 return(
    <div>
        <QuickSort/>
    </div>
 )
}
