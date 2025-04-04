// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const generateSnowflakes = () => {
    return Array.from({ length: 400 }).map((_, i) => {
      const left = Math.random() * 500;
      const fontSize = 0.2 + Math.random() * 0.8; // Smaller size
      const delay = Math.random() * 4;
      const fallDuration = 1 + Math.random() * 5;
      const shakeDuration = 2 + Math.random() * 4;
      const rotation = Math.random() * 360;

      return (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${left}vw`,
            fontSize: `${fontSize}vmin`,
            opacity: 0.5 + Math.random() * 0.5,
            transform: `rotate(${rotation}deg)`,
            animation: `
              snowflake-fall ${fallDuration}s linear ${delay}s infinite,
              snowflake-shake ${shakeDuration}s ease-in-out ${delay}s infinite alternate,
              snowflake-wind-w ${fallDuration}s linear ${delay}s infinite
            `,
          }}
        />
      );
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Winter Background Layer */}
      <div className="fixed inset-0 z-0 winter-background">
        <div className="fixed inset-0 pointer-events-none">{generateSnowflakes()}</div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="absolute w-[500px] h-[500px] bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute w-[400px] h-[400px] bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-2xl animate-float delay-2000 -right-20" />
        
        <main className="flex flex-col items-center gap-8 px-4 text-center">
          <div className="animate-float">
            <Image
              src="/next.svg"
              alt="Next.js logo"
              width={240}
              height={52}
              className="drop-shadow-glow hover:scale-105 transition-transform duration-300"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            File Explorer Directory Operations
          </h1>
          
          <p className="text-gray-300 max-w-2xl text-lg md:text-xl leading-relaxed">
            Revolutionizing file management with cutting-edge technology and 
            seamless user experiences. Empower your Directory with intelligent 
            operations.
          </p>

          <Link 
          href="/FileOps"
          className="mt-8  z-100 px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-lg
                   hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-300
                   shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          Get Started
        </Link>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
            {['Secure Encryption', 'Fast Ops', 'Organized', 'Multi-Platform'].map((feature) => (
              <div 
                key={feature}
                className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-gray-100 font-medium mb-2">{feature}</h3>
                <p className="text-sm text-gray-400">FileOps Platform</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}