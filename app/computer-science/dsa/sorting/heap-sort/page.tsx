"use client";

import HeapSort from "@/app/components/computer-science/dsa/sorting/HeapSort";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProjects } from "@/app/hooks/useProjects";
import { Cloud } from 'lucide-react';



export default function Merge() {

 return(
    <div>
        <HeapSort/>
    </div>
 )
}