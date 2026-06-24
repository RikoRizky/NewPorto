import React from 'react';

export default function TitleSertif() {
    return (
        <div className="relative w-full bg-black pt-6 sm:pt-8 pb-0 mb-0 text-center">
            <div className="flex items-center justify-center gap-4 mb-2">
                <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-lime-400/60" />
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.4em] text-lime-400/80 uppercase font-light">
                    Career Path
                </span>
                <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-lime-400/60" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Related{' '}
                <span className="bg-gradient-to-r from-lime-300 via-lime-400 to-emerald-400 bg-clip-text text-transparent">
                    Experience
                </span>
            </h1>
            <p className="text-[11px] sm:text-xs tracking-[0.35em] text-neutral-500 uppercase font-light mt-2">
                Scroll to explore my professional journey
            </p>
        </div>
    );
}