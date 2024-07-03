import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface VisibilityState {
  id: number;
  visibility: boolean;
}

interface VisibilityStoreState {
  visibility: VisibilityState[];
  toggleVisibility: (repoId: number) => void;
}

export const useVisibilityStore = create(
  persist<VisibilityStoreState>(
    (set, get) => ({
      visibility: [],
      toggleVisibility: (repoId) => {
        set((state) => {
          const updatedVisibility = state.visibility.some(
            (repo) => repo.id === repoId
          )
            ? state.visibility.map((repo) =>
                repo.id === repoId
                  ? { ...repo, visibility: !repo.visibility }
                  : repo
              )
            : [...state.visibility, { id: repoId, visibility: true }];

          return { visibility: updatedVisibility };
        });
      },
    }),
    {
      name: "repo-visibility",
      storage: createJSONStorage(() => sessionStorage) as any,
    }
  )
);
