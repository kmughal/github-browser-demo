import { create } from "zustand";
import { VisibilityState, useVisibilityStore } from "./useVisibilityStore";

export interface GithubRepo {
  id: number;
  name: string;
  description: string;
  visibility: boolean;
  avatarUrl: string;
}

interface GitHubRepoSearchResponse {
  total_count: number;
  items: Array<{
    id: number;
    name: string;
    description: string;
    visibility: boolean;
    owner: {
      avatar_url: string;
    };
  }>;
}

const fetchGithub = async (
  page = 1,
  perPage = 10
): Promise<GitHubRepoSearchResponse> => {
  const url = `https://api.github.com/search/repositories?sort=stars&q=javascript&per_page=${perPage}&page=${page}`;
  const response = await fetch(url);
  const data = (await response.json()) as GitHubRepoSearchResponse;
  return data;
};

interface GithubRepoStoreState {
  data: GithubRepo[];
  pageSize: number;
  currentPage: number;
  totalItems: number;
  fetch: () => Promise<void>;
  updateSearchResults: (newResults: GithubRepo[]) => void;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  updateVisibility: (repoId: number) => void;
}

const mapVisibility = (
  visibilityDetails: VisibilityState[],
  data: GitHubRepoSearchResponse
) => {
  return data.items.map(({ id, name, description, owner }) => {
    const visibility =
      visibilityDetails.find((v) => v.id === id)?.visibility || false;

    return {
      id,
      name,
      description,
      visibility,
      avatarUrl: owner.avatar_url,
    };
  });
};

export const useGithubRepoStore = create<GithubRepoStoreState>((set, get) => ({
  data: [] as GithubRepo[],
  pageSize: 10,
  currentPage: 1,
  totalItems: 0,
  updateVisibility: (repoId: number) => {
    const { data: currentData, totalItems } = get();
    const lookup = currentData.find((item) => item.id === repoId);
    lookup && (lookup.visibility = !lookup.visibility);

    set({
      data: currentData,
      totalItems,
    });
  },
  fetch: async () => {
    const res = await fetchGithub(1, 10);
    const { visibility } = useVisibilityStore.getState();
    const { total_count: totalItems } = res;

    set({
      data: mapVisibility(visibility, res),
      totalItems,
    });
  },
  updateSearchResults: (newResults) =>
    set((state) => ({ ...state, data: newResults })),
  nextPage: async () => {
    const { currentPage, pageSize } = get();
    const newPage = currentPage + 1;
    const res = await fetchGithub(newPage, pageSize);
    const { visibility } = useVisibilityStore.getState();
    set({ currentPage: newPage, data: mapVisibility(visibility, res) });
  },
  prevPage: async () => {
    const { currentPage, pageSize } = get();
    const newPage = Math.max(currentPage - 1, 1);
    const res = await fetchGithub(newPage, pageSize);
    const { visibility } = useVisibilityStore.getState();
    set({ currentPage: newPage, data: mapVisibility(visibility, res) });
  },
}));
