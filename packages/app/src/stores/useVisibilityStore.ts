import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface VisibilityState {
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
          const { visibility } = get();
          const lookup = visibility.find((repo) => repo.id === repoId);
          if (lookup) {
            lookup.visibility = !lookup.visibility;
          } else {
            visibility.push({ id: repoId, visibility: true });
          }

          return { visibility };
        });
      },
    }),
    {
      name: "repo-visibility",
      storage: createJSONStorage(() => sessionStorage) as any,
    }
  )
);
