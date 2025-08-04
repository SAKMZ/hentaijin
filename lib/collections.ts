// API functions for getting collection data via Flask backend
async function fetchCollectionData(
  type: string,
  value?: string,
  page?: number
) {
  try {
    let url = `/api/collections/${type}`;
    const params = new URLSearchParams();

    if (value) params.append("value", value);
    if (page) params.append("page", page.toString());

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`Failed to fetch ${type} data:`, error);
    return { values: [], galleries: [], pagination: null };
  }
}

export async function getCategories(): Promise<string[]> {
  const data = await fetchCollectionData("categories");
  return data.values || [];
}

export async function getTags(): Promise<string[]> {
  const data = await fetchCollectionData("tags");
  return data.values || [];
}

export async function getArtists(): Promise<string[]> {
  const data = await fetchCollectionData("artists");
  return data.values || [];
}

export async function getCharacters(): Promise<string[]> {
  const data = await fetchCollectionData("characters");
  return data.values || [];
}

export async function getLanguages(): Promise<string[]> {
  const data = await fetchCollectionData("languages");
  return data.values || [];
}

// Get galleries by specific field value
export async function getGalleriesByField(
  field: "categories" | "tags" | "artists" | "characters" | "languages",
  value: string,
  page: number = 1,
  limit: number = 25
) {
  const data = await fetchCollectionData(field, value, page);
  return {
    galleries: data.galleries || [],
    pagination: data.pagination || {
      currentPage: page,
      totalPages: 1,
      totalItems: 0,
      hasNext: false,
      hasPrev: false,
    },
  };
}
