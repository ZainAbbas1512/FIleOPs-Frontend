import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-radial from-purple-500/20 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute w-[400px] h-[400px] bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-2xl animate-float delay-2000 -right-20" />
      
      <main className="z-10 flex flex-col items-center gap-8 px-4 text-center">
        {/* Animated logo */}
        <div className="animate-float">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={240}
            height={52}
            className="drop-shadow-glow hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Main content */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          File Explorer Directory Operations
        </h1>
        
        <p className="text-gray-300 max-w-2xl text-lg md:text-xl leading-relaxed">
          Revolutionizing file management with cutting-edge technology and 
          seamless user experiences. Empower your Directory with intelligent 
          operations.
        </p>

        {/* CTA Button */}
        <Link 
          href="/FileOps"
          className="mt-8 px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-lg
                   hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all duration-300
                   shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
        >
          Get Started
        </Link>

        {/* Feature Grid */}
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
  );
}