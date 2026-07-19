'use client';

import { SkipBack, StepBack, Play, Pause, StepForward, SkipForward, RotateCcw } from 'lucide-react';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  /** When true, all stepping/seeking/playback is disabled (e.g. a predict-mode
   * example whose answer hasn't been revealed yet) — only Reset stays active. */
  disabled?: boolean;
  onStepForward: () => void;
  onStepBackward: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (step: number) => void;
}

const speeds = [0.5, 1, 2, 4];

export default function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  disabled = false,
  onStepForward,
  onStepBackward,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onSeek,
}: PlaybackControlsProps) {
  const atStart = currentStep === 0;
  const atEnd = currentStep >= totalSteps - 1;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Timeline scrubber */}
      <div className="relative px-1">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={e => onSeek(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted
                     disabled:opacity-30 disabled:cursor-not-allowed
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                     [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(99,102,241,0.4)]
                     [&::-webkit-slider-thumb]:hover:opacity-90 [&::-webkit-slider-thumb]:transition-colors
                     [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5
                     [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary) / 0.5) ${progress}%, hsl(var(--muted-foreground) / 0.3) ${progress}%)`,
          }}
          aria-label="Simulation timeline"
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Transport buttons */}
        <div className="flex items-center gap-1">
          <ControlButton
            icon={RotateCcw}
            label="Reset"
            onClick={onReset}
            size="sm"
          />
          <ControlButton
            icon={SkipBack}
            label="First step"
            onClick={() => onSeek(0)}
            disabled={disabled || atStart}
            size="sm"
          />
          <ControlButton
            icon={StepBack}
            label="Step backward"
            onClick={onStepBackward}
            disabled={disabled || atStart}
          />
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={disabled || (atEnd && !isPlaying)}
            className={`
              flex items-center justify-center w-10 h-10 rounded-xl transition-all
              ${isPlaying
                ? 'bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                : 'bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25'
              }
              disabled:opacity-30 disabled:cursor-not-allowed
              shadow-lg hover:shadow-xl active:scale-95
            `}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <ControlButton
            icon={StepForward}
            label="Step forward"
            onClick={onStepForward}
            disabled={disabled || atEnd}
          />
          <ControlButton
            icon={SkipForward}
            label="Last step"
            onClick={() => onSeek(totalSteps - 1)}
            disabled={disabled || atEnd}
            size="sm"
          />
        </div>

        {/* Step counter */}
        <div className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border">
          Step <span className="text-primary font-semibold">{currentStep + 1}</span>
          <span className="text-muted-foreground/70"> / </span>
          <span className="text-foreground">{totalSteps}</span>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-muted rounded-lg border border-border p-0.5">
          {speeds.map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`
                px-2 py-1 rounded-md text-[11px] font-bold transition-all
                ${speed === s
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
                }
              `}
              aria-label={`Set speed to ${s}x`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Helper button ────────────────────────────────────────────

function ControlButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  size = 'md',
}: {
  icon: typeof Play;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center rounded-lg transition-all
        bg-muted border border-border text-muted-foreground
        hover:bg-accent hover:text-foreground
        disabled:opacity-30 disabled:cursor-not-allowed
        active:scale-95
        ${size === 'sm' ? 'w-8 h-8' : 'w-9 h-9'}
      `}
      aria-label={label}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    </button>
  );
}
