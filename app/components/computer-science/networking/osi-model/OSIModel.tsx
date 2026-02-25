"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const OSI3DScene = dynamic(() => import("./OSI3DScene"), {
    ssr: false,
});

type Protocol = "TCP" | "UDP";

export default function OSIModel() {
    const [mode, setMode] = useState<"send" | "receive">("send");
    const [protocol, setProtocol] = useState<Protocol>("TCP");
    const [message, setMessage] = useState("Hello OpenLabs 🚀");
    const [trigger, setTrigger] = useState(false);

    const runSimulation = () => {
        setTrigger(!trigger);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT CONTROL PANEL */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
                <h2 className="text-xl font-semibold">Simulation Controls</h2>

                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 rounded bg-slate-700"
                />

                <select
                    value={protocol}
                    onChange={(e) =>
                        setProtocol(e.target.value as Protocol)
                    }
                    className="w-full p-2 rounded bg-slate-700"
                >
                    <option value="TCP">TCP</option>
                    <option value="UDP">UDP</option>
                </select>

                <button
                    onClick={() => setMode(mode === "send" ? "receive" : "send")}
                    className="bg-indigo-600 px-4 py-2 rounded w-full"
                >
                    Mode: {mode === "send" ? "Sender" : "Receiver"}
                </button>

                <button
                    onClick={runSimulation}
                    className="bg-green-600 px-4 py-2 rounded w-full"
                >
                    Run 3D Simulation
                </button>
            </div>

            {/* CENTER 3D SCENE */}
            <div className="lg:col-span-2 h-[600px] bg-slate-900 rounded-2xl overflow-hidden">
                <OSI3DScene
                    mode={mode}
                    protocol={protocol}
                    message={message}
                    trigger={trigger}
                />
            </div>
        </div>
    );
}