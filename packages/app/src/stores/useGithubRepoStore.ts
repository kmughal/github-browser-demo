import { create } from "zustand";
import { useVisibilityStore } from "./useVisibilityStore";

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

export const useGithubRepoStore = create<GithubRepoStoreState>((set, get) => ({
  data: [] as GithubRepo[],
  pageSize: 10,
  currentPage: 1,
  totalItems: 0,
  updateVisibility: (repoId: number) => {
    const { data: currentData, totalItems } = get();
    const repos = currentData.map((item) => {
      if (item.id === repoId) {
        item.visibility = !item.visibility;
      }

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        visibility: item.visibility,
        avatarUrl: item.avatarUrl,
      };
    });

    set({
      data: repos,
      totalItems,
    });
  },
  fetch: async () => {
    const res = await fetchGithub(1, 10);

    const visibilityState = useVisibilityStore.getState().visibility;
    const { items, total_count: totalItems } = res;
    const repos = items.map((repoData) => {
      const visibility =
        visibilityState.find((v) => v.id === repoData.id)?.visibility || false;

      return {
        id: repoData.id,
        name: repoData.name,
        description: repoData.description,
        visibility: visibility,
        avatarUrl: repoData.owner.avatar_url,
      };
    });

    set({
      data: repos,
      totalItems,
    });
  },
  updateSearchResults: (newResults) =>
    set((state) => ({ ...state, data: newResults })),
  nextPage: async () => {
    const { currentPage, pageSize } = get();
    const newPage = currentPage + 1;
    const data = await fetchGithub(newPage, pageSize);
    const visibilityState = useVisibilityStore.getState().visibility;

    const repos = data.items.map((x) => {
      const visibility =
        visibilityState.find((v) => v.id === x.id)?.visibility || false;
      return {
        id: x.id,
        name: x.name,
        description: x.description,
        visibility: visibility,
        avatarUrl: x.owner.avatar_url,
      };
    });

    set({ currentPage: newPage, data: repos });
  },
  prevPage: async () => {
    const { currentPage, pageSize } = get();
    const newPage = Math.max(currentPage - 1, 1);
    const data = await fetchGithub(newPage, pageSize);
    const visibilityState = useVisibilityStore.getState().visibility;

    const repos = data.items.map((x) => {
      const visibility =
        visibilityState.find((v) => v.id === x.id)?.visibility || false;
      return {
        id: x.id,
        name: x.name,
        description: x.description,
        visibility: visibility,
        avatarUrl: x.owner.avatar_url,
      };
    });

    set({ currentPage: newPage, data: repos });
  },
}));
