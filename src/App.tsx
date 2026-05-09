import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="h-screen w-full bg-[#080808] text-[#b0b0b0] font-pixel flex flex-col overflow-hidden relative selection:bg-blue-900/50">
      <div className="static-noise-bg"></div>
      
      {/* Header */}
      <header className="h-16 border-b border-blue-900/50 bg-[#0a0a0a] flex shrink-0 items-center justify-between px-8 z-10 tear-effect">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 border border-blue-600 flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-600 animate-pulse"></div>
          </div>
          <span className="text-xl tracking-tighter text-blue-500 uppercase glitch-text" data-text="SYS.SNAKE_OS">SYS.SNAKE_OS</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-gray-500 animate-ping" style={{ animationDuration: '3s' }}></div>
          <span className="text-xs uppercase tracking-wider text-gray-500 pt-1">STATUS: INITIALIZED</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden z-10">
        
        {/* Left Aside for Player */}
        <aside className="w-80 md:w-96 border-r border-gray-800 bg-[#0a0a0a] flex flex-col p-6 overflow-y-auto tear-effect" style={{ animationDelay: '1s' }}>
          <h3 className="text-[12px] uppercase tracking-[0.2em] text-gray-600 mb-6 border-b border-gray-800 pb-2">AUDIO_INTERFACE</h3>
          <MusicPlayer />
        </aside>

        {/* Center Section for Game */}
        <section className="flex-1 bg-[#050505] flex flex-col items-center justify-center relative p-4 tear-effect" style={{ animationDelay: '2s' }}>
           {/* Background Grid Accent */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #333 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
           
           <SnakeGame />
        </section>

      </main>
      
      {/* Footer */}
      <footer className="h-12 border-t border-gray-800 bg-[#0a0a0a] flex shrink-0 items-center px-8 justify-between z-10 text-[10px] text-gray-700 uppercase">
        <span className="pt-1">TML: ROOT SYSTEM</span>
        <span className="pt-1">ERROR_LOG: NONE</span>
      </footer>

    </div>
  );
}
