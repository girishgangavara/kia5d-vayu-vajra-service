const Bus3D = () => {
  return (
    <div className="perspective-1000 w-full max-w-lg mx-auto">
      <div className="preserve-3d animate-float relative">
        {/* Bus body */}
        <div className="relative">
          {/* Main bus shape */}
          <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl h-32 w-full shadow-glow">
            {/* Windows */}
            <div className="absolute top-4 left-4 right-4 flex gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 bg-gradient-to-b from-white/40 to-white/20 rounded-lg backdrop-blur-sm border border-white/30"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            {/* Logo stripe */}
            <div className="absolute bottom-8 left-4 right-4 h-6 bg-gradient-to-r from-accent via-accent/80 to-accent rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-accent-foreground tracking-wider">VAYU VAJRA</span>
            </div>
            {/* Wheels */}
            <div className="absolute -bottom-4 left-8 w-10 h-10 bg-secondary rounded-full border-4 border-muted shadow-lg">
              <div className="w-full h-full rounded-full border-2 border-muted-foreground/30 animate-spin-slow" />
            </div>
            <div className="absolute -bottom-4 right-8 w-10 h-10 bg-secondary rounded-full border-4 border-muted shadow-lg">
              <div className="w-full h-full rounded-full border-2 border-muted-foreground/30 animate-spin-slow" />
            </div>
          </div>
          {/* Reflection */}
          <div className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-b from-primary/20 to-transparent blur-xl rounded-full" />
        </div>
        {/* Route indicator */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 glass px-6 py-2 rounded-full">
          <span className="text-sm font-semibold text-gradient">KIA-5D</span>
        </div>
      </div>
    </div>
  );
};

export default Bus3D;
