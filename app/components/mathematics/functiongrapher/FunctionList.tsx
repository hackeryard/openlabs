"use client";

import React, { useState } from "react";
import { GraphFunction, COLOR_PALETTE } from "./types";
import { Eye, EyeOff, Trash2, Star, Copy, Edit2, Check, X } from "lucide-react";
import { parseExpression } from "./lib/parser";

interface FunctionListProps {
  functions: GraphFunction[];
  onToggleVisibility: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onDeleteFunction: (id: string) => void;
  onDuplicateFunction: (id: string) => void;
  onUpdateExpression: (id: string, newExpr: string) => void;
  onChangeColor: (id: string, newColor: string) => void;
}

export default function FunctionList({
  functions,
  onToggleVisibility,
  onSetPrimary,
  onDeleteFunction,
  onDuplicateFunction,
  onUpdateExpression,
  onChangeColor,
}: FunctionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editExpr, setEditExpr] = useState("");
  const [activeColorPickerId, setActiveColorPickerId] = useState<string | null>(null);

  const startEdit = (fn: GraphFunction) => {
    setEditingId(fn.id);
    setEditExpr(fn.rawExpression);
  };

  const saveEdit = (id: string) => {
    const val = parseExpression(editExpr);
    if (val.isValid) {
      onUpdateExpression(id, editExpr);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  if (functions.length === 0) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground shadow-md">
        <p className="text-sm font-semibold">No functions plotted on canvas.</p>
        <p className="text-xs opacity-75 mt-1">Type an expression above or choose a preset to begin.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-md space-y-3">
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Active Functions
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
            {functions.length}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-semibold">
          Click ★ to set primary analysis target
        </span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {functions.map((fn) => {
          const isEditing = editingId === fn.id;

          return (
            <div
              key={fn.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 relative ${
                fn.isPrimary
                  ? "bg-primary/5 border-primary/40 shadow-sm"
                  : "bg-muted/40 border-border hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: Swatch & Name/Expression */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Swatch */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveColorPickerId(activeColorPickerId === fn.id ? null : fn.id)
                      }
                      className="w-5 h-5 rounded-lg border border-border shadow-inner transition-transform hover:scale-110 shrink-0"
                      style={{ backgroundColor: fn.color }}
                      title="Change color"
                    />

                    {activeColorPickerId === fn.id && (
                      <div className="absolute left-0 mt-2 p-2 bg-card border border-border rounded-2xl shadow-2xl z-50 grid grid-cols-4 gap-1.5 w-36">
                        {COLOR_PALETTE.map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              onChangeColor(fn.id, c);
                              setActiveColorPickerId(null);
                            }}
                            className="w-6 h-6 rounded-lg border border-border transition-transform hover:scale-110 shadow-sm"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Formula / Edit Input */}
                  {!isEditing ? (
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-foreground truncate">
                        <span className="text-primary">{fn.name} =</span>
                        <span className="truncate">{fn.rawExpression}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="font-mono text-xs font-bold text-primary">{fn.name} =</span>
                      <input
                        type="text"
                        value={editExpr}
                        onChange={(e) => setEditExpr(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(fn.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        className="flex-1 px-2.5 py-1 bg-card border border-primary rounded-xl font-mono text-xs text-foreground focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(fn.id)}
                        className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Primary Target Star */}
                  <button
                    onClick={() => onSetPrimary(fn.id)}
                    title={fn.isPrimary ? "Current Primary Function" : "Set as Primary Function"}
                    className={`p-1.5 rounded-xl transition-all ${
                      fn.isPrimary
                        ? "text-amber-500 bg-amber-500/10"
                        : "text-muted-foreground hover:text-amber-500 hover:bg-muted"
                    }`}
                  >
                    <Star size={15} fill={fn.isPrimary ? "currentColor" : "none"} />
                  </button>

                  {/* Visibility Toggle */}
                  <button
                    onClick={() => onToggleVisibility(fn.id)}
                    title={fn.isVisible ? "Hide Function" : "Show Function"}
                    className={`p-1.5 rounded-xl transition-all ${
                      fn.isVisible
                        ? "text-primary hover:bg-primary/10"
                        : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {fn.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>

                  {/* Edit Button */}
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(fn)}
                      title="Edit Expression"
                      className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}

                  {/* Duplicate */}
                  <button
                    onClick={() => onDuplicateFunction(fn.id)}
                    title="Duplicate Function"
                    className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Copy size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteFunction(fn.id)}
                    title="Delete Function"
                    className="p-1.5 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
