'use client';

import { SkipBack, StepBack, Play, Pause, StepForward, SkipForward, RotateCcw, Gauge } from 'lucide-react';

interface PlaybackBarProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  /** When true, all stepping/seeking/playback is disabled (e.g. a predict-mode
   * example whose answer hasn't been revealed yet) — only Reset stays active. */
  disabled?: boolean;
  /** Step indices that produce console output — drawn as dots on the scrubber. */
  logSteps?: number[];
  onStepForward: () => void;
  onStepBackward: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (step: number) => void;
}

const speeds = [0.5, 1, 2, 4];

export default function PlaybackBar({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  disabled = false,
  logSteps = [],
  onStepForward,
  onStepBackward,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  onSeek,
}: PlaybackBarProps) {
  const atStart = currentStep === 0;
  const atEnd = currentStep >= totalSteps - 1;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  const cycleSpeed = () => {
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    onSpeedChange(next);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Timeline scrubber with console-output markers */}
      <div className="relative px-1">
        {/* LOG markers: little dots where console output happens — makes
            the timeline scannable ("where do things print?"). */}
        {totalSteps > 1 && logSteps.map(s => (
          <span
            key={s}
            className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full pointer-events-none ${
              s <= currentStep ? 'bg-primary' : 'bg-muted-foreground/40'
            }`}
            style={{ left: `calc(${(s / (totalSteps - 1)) * 100}% - 2px)` }}
          />
        ))}
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
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Transport */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <ControlButton icon={RotateCcw} label="Reset" onClick={onReset} size="sm" />
          <ControlButton icon={SkipBack} label="First step" onClick={() => onSeek(0)} disabled={disabled || atStart} size="sm" hideOnMobile />
          <ControlButton icon={StepBack} label="Step backward" onClick={onStepBackward} disabled={disabled || atStart} />
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={disabled || (atEnd && !isPlaying)}
            className={`
              flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg transition-all
              ${isPlaying
                ? 'bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                : 'bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25'
              }
              disabled:opacity-30 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95
            `}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <ControlButton icon={StepForward} label="Step forward" onClick={onStepForward} disabled={disabled || atEnd} />
          <ControlButton icon={SkipForward} label="Last step" onClick={() => onSeek(totalSteps - 1)} disabled={disabled || atEnd} size="sm" hideOnMobile />
        </div>

        {/* Step counter */}
        <div className="text-[10px] sm:text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-lg border border-border whitespace-nowrap">
          <span className="text-primary font-semibold">{currentStep + 1}</span>
          <span className="text-muted-foreground/70">/</span>
          <span className="text-foreground">{totalSteps}</span>
        </div>

        {/* Speed: full selector at sm+, single cycling button below */}
        <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg border border-border p-0.5">
          {speeds.map(s => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                speed === s
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}
              aria-label={`Set speed to ${s}x`}
            >
              {s}x
            </button>
          ))}
        </div>
        <button
          onClick={cycleSpeed}
          className="sm:hidden flex items-center gap-1 bg-muted rounded-lg border border-border px-2 py-1.5 text-[10px] font-bold text-foreground active:scale-95 transition-transform"
          aria-label={`Playback speed ${speed}x — tap to change`}
        >
          <Gauge className="w-3 h-3 text-muted-foreground" />
          {speed}x
        </button>
      </div>
    </div>
  );
}

function ControlButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  size = 'md',
  hideOnMobile = false,
}: {
  icon: typeof Play;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  hideOnMobile?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${hideOnMobile ? 'hidden sm:flex' : 'flex'} items-center justify-center rounded-lg transition-all
        bg-muted border border-border text-muted-foreground
        hover:bg-accent hover:text-foreground
        disabled:opacity-30 disabled:cursor-not-allowed active:scale-95
        ${size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'}
      `}
      aria-label={label}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    </button>
  );
}
