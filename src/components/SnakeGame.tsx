import { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED_MS = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food doesn't spawn on snake
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys when playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && isPlaying) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y !== 1) {
             setDirection({ x: 0, y: -1 });
             directionRef.current = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
          if (directionRef.current.y !== -1) {
             setDirection({ x: 0, y: 1 });
             directionRef.current = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
          if (directionRef.current.x !== 1) {
             setDirection({ x: -1, y: 0 });
             directionRef.current = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
          if (directionRef.current.x !== -1) {
             setDirection({ x: 1, y: 0 });
             directionRef.current = { x: 1, y: 0 };
          }
          break;
        case ' ': // Spacebar
        case 'Enter':
          if (gameOver || !isPlaying) {
             e.preventDefault();
             resetGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, SPEED_MS);
    return () => clearInterval(gameLoop);
  }, [isPlaying, gameOver, food, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#0a0a0a] border border-gray-800 w-full max-w-lg relative z-10 font-pixel">
      
      <div className="w-full flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
        <div>
          <h2 className="text-[10px] text-gray-600 mb-1">PROGRAM_RUNNING</h2>
          <div className="text-sm font-bold text-gray-300 glitch-text" data-text="GRID.SECTOR.7">GRID.SECTOR.7</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-600 mb-1">MEM_ALLOC</div>
          <div className="text-2xl text-blue-500 drop-shadow-[0_0_5px_rgba(0,0,255,0.8)]">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      <div 
        className="relative bg-black border border-blue-900 shadow-[0_0_20px_rgba(0,0,255,0.1)] p-1 overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: '100%',
          aspectRatio: '1 / 1',
        }}
      >
        <div className="scanline"></div>
        {/* Snake body */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? 'bg-blue-500 z-10' : 'bg-gray-600 z-0'} ${!isPlaying && !gameOver ? 'opacity-50' : ''}`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                boxShadow: isHead ? '0 0 5px #00f' : 'inset 0 0 2px #000',
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="bg-gray-300 animate-[pulse_0.5s_infinite] z-0"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            boxShadow: '0 0 10px #fff',
          }}
        />

        {/* Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <button 
              onClick={resetGame}
              className="px-4 py-2 border border-blue-600 bg-[#050505] text-blue-500 hover:bg-blue-900 transition-colors cursor-pointer text-sm glitch-text"
              data-text="EXECUTE"
            >
              EXECUTE
            </button>
            <p className="text-gray-600 text-xs mt-4 uppercase">INPUT_REQUIRED</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-900/30 z-20 border-2 border-red-900 tear-effect backdrop-blur-[1px]">
            <h3 className="text-3xl text-gray-300 mb-2 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h3>
            <p className="text-gray-400 text-xs mb-8">DUMP: {score.toString(16).toUpperCase()}H</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-gray-900 border border-gray-500 text-gray-300 hover:bg-gray-700 text-sm transition-all"
            >
              RESTART
            </button>
          </div>
        )}
      </div>

      <div className="w-full flex justify-between items-center mt-6 text-gray-600 text-[10px]">
        <p className="animate-pulse">LATENCY: <span className="text-blue-500">ERR.</span></p>
        <p>V. 2.1.4</p>
      </div>
    </div>
  );
}
