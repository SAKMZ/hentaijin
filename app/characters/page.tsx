import Link from "next/link";
import { Metadata } from "next";
import { getCharacters } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Characters",
  description: "Browse hentai galleries by character",
};

export default async function CharactersPage() {
  const characters = await getCharacters();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Browse by <span className="text-pink-500">Characters</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover galleries organized by character
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters.map((character) => (
          <Link
            key={character}
            href={`/character/${encodeURIComponent(character)}`}
            className="group"
          >
            <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-all duration-300 group-hover:scale-105">
              <div className="text-3xl mb-2">👤</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                {character}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {characters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No characters found
          </h3>
          <p className="text-gray-400">
            Characters will appear here once galleries are added to the database.
          </p>
        </div>
      )}
    </div>
  );
}