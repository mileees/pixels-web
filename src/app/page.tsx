"use client"
import { useEffect, useState } from 'react';
import { convertToTime } from './utils/convertToTime';

interface Land {
  land: string;
  trees: number[];
  treesTimestamps: number[];
  updatedAt: Date;
  guild: string;
  door: string;
}

export default function Home() {
  const [lands, setLands] = useState<Land[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selectedFilter, setSelectedFilter] = useState(0);

  const getLands = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/lands", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch lands");
      }

      return res.json();
    } catch (error) {
      console.log("Error loading topics: ", error);
    }
  };

  useEffect(() => {
    const fetchLands = async () => {
      const { lands } = await getLands();
      setLands(lands);
    };

    fetchLands();

    const intervalId = setInterval(fetchLands, 2 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Atualiza os timestamps
      setLands((prevLands) =>
        prevLands.map((land) => ({
          ...land,
          treesTimestamps: land.treesTimestamps.filter((timestamp) => timestamp > new Date().getTime()),
        }))
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleFilterChange = (guild: string) => {
    setFilter(guild);
  };

  const filteredLands = lands.filter((land) => filter === "all" || land.guild === filter);

  return (
    <main className="flex min-h-screen flex-col">
      <header className="text-2xl p-4 w-screen bg-slate-900">
        🌳 Pixels Tree Web
      </header>
      <div className='px-10 py-3 flex items-center gap-4'>
        <button
          onClick={() => {
            setSelectedFilter(0)
            handleFilterChange("all")
          }}
          className={`border-2 border-green-500 px-5 py-2 rounded-3xl ${selectedFilter === 0 && "bg-green-500 font-bold"}`}
        >
          All ({lands.length})
        </button>
        <button
          onClick={() => {
            setSelectedFilter(1)
            handleFilterChange("moku")
          }}
          className={`border-2 border-blue-500 px-5 py-2 rounded-3xl ${selectedFilter === 1 && "bg-blue-500 font-bold"}`}
        >
          Moku
        </button>
        <button
          onClick={() => {
            setSelectedFilter(2)
            handleFilterChange("afarmerparadise")
          }}
          className={`border-2 border-purple-500 px-5 py-2 rounded-3xl ${selectedFilter === 2 && "bg-purple-500 font-bold"}`}
        >
          Farmer Paradise
        </button>
        <button
          onClick={() => {
            setSelectedFilter(3)
            handleFilterChange("guildpal")
          }}
          className={`border-2 border-orange-500 px-5 py-2 rounded-3xl ${selectedFilter === 3 && "bg-orange-500"}`}
        >
          Guild Pal
        </button>
      </div>
      <div>
        <div className='flex px-12 py-4'>           
          <h2 className='w-40'>Land</h2>
          <h2 className='w-40'>Preview</h2>
          <h2 className='w-40'>Quantity</h2>
          <h2 className='w-40'>Time</h2>
          <h2 className='w-40'>Guild</h2>
        </div>
        <div>
          {filteredLands.length ?
            filteredLands.map((land, landIndex) => {
              const sortedTimestamps = land.treesTimestamps.sort((a, b) =>new Date(a).getTime() - new Date(b).getTime());
              if (sortedTimestamps[0] > new Date().getTime()) {
                return (
                  <div key={landIndex}>
                    <details className="bg-slate-500">
                      <summary className='w-full py-6 px-12 flex bg-slate-700 hover:bg-slate-600 cursor-pointer'>
                        <span className='w-40'>{land.land}</span>
                        <span className='w-40'>
                          <a
                            className='hover:border-b-2'
                            href={`https://play.pixels.xyz/pixels/share/${land.land}`}
                            target='_blank'
                          >
                           👁️ Watch
                          </a>
                        </span>
                        <span className='w-40'>🌳 {sortedTimestamps.length}</span>
                        <span className='w-40'>{convertToTime(sortedTimestamps[0])}</span>
                        <span className='w-40'>{land.guild}</span>
                      </summary>
                      <ul className='ml-8'>
                        {sortedTimestamps.map((timestamp, index) => {
                          return (
                            <li key={index} className='py-2'>
                              🌳 {convertToTime(timestamp)}
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </div>
                );
              }
            })
            : <p className='px-12 text-xl mt-8 text-red-300'>Sem lands no momento =(</p>
          }
        </div>
      </div>
    </main>
  );
}
