import Link from "next/link";
import { Metadata } from "next";
import { getArtists } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Artists",
  description: "Browse hentai galleries by artist",
};

export default async function ArtistsPage() {
  const artists = await getArtists();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Browse by <span className="text-pink-500">Artists</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover galleries organized by artist
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <Link
            key={artist}
            href={`/artist/${encodeURIComponent(artist)}`}
            className="group"
          >
            <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-6 text-center transition-all duration-300 group-hover:scale-105">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="text-lg font-semibold text-white group-hover:text-pink-400 transition-colors">
                {artist}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {artists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No artists found
          </h3>
          <p className="text-gray-400">
            Artists will appear here once galleries are added to the database.
          </p>
        </div>
      )}
    </div>
  );
}