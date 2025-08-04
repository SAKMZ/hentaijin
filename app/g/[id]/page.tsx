import type { Metadata } from "next";
import Link from "next/link";
import { GalleryViewer } from "@/components/GalleryViewer";
import { config } from "@/lib/config";

interface GalleryPageProps {
  params: { id: string };
}

// Mock gallery metadata - replace with real API call
const getGalleryMetadata = (id: string) => ({
  title: `Gallery ${id}`,
  artist: `Artist ${(parseInt(id) % 10) + 1}`,
  tags: ['sample', 'webp', 'gallery'],
  language: ['English', 'Japanese', 'Chinese', 'Korean'][parseInt(id) % 4],
  category: ['Manga', 'Doujinshi', 'CG Set', 'Game CG'][parseInt(id) % 4],
});

export async function generateMetadata({
  params,
}: GalleryPageProps): Promise<Metadata> {
  const metadata = getGalleryMetadata(params.id);

  return {
    title: metadata.title,
    description: `${metadata.title} by ${metadata.artist} - WebP Gallery`,
    openGraph: {
      title: metadata.title,
      description: `${metadata.title} by ${metadata.artist}`,
    },
  };
}

export default function GalleryPage({ params }: GalleryPageProps) {
  const metadata = getGalleryMetadata(params.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Galleries
        </Link>
      </div>

      {/* Gallery Viewer */}
      <GalleryViewer
        galleryId={params.id}
        title={metadata.title}
        artist={metadata.artist}
        tags={metadata.tags}
      />

      {/* Download Link */}
      <div className="mt-8 text-center">
        <a
          href={`${config.CDN_BASE_URL}/galleries/${params.id}.zip`}
          className="inline-flex items-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors font-medium"
          download
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download ZIP
        </a>
      </div>
    </div>
  );
}
