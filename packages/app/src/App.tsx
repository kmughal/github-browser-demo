import React, { useEffect } from "react";
import { useGithubRepoStore, useVisibilityStore } from "./stores";
import { ActionButtons, RepoCard } from "./components";
import "./index.css";

export const App = () => {
  const { data, fetch, nextPage, prevPage, currentPage, totalItems, updateVisibility } =
    useGithubRepoStore();

  const { toggleVisibility } = useVisibilityStore();

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addVisibilityHandler = (repoId: number) => {
    toggleVisibility(repoId);
    updateVisibility(repoId);
  };

  return (
    <div className="bg-slate-300">
      <main className="sm:w-1/2 w-full m-auto p-5">
        <div className="flex-col">
          <h1 className="text-2xl font-extrabold ml-5" id="main-heading">browse Github</h1>
          <ActionButtons currentPage={currentPage} prevPage={prevPage} nextPage={nextPage} totalItems={totalItems} />
          {data.map((repo) => (
            <RepoCard key={repo.id} addVisibilityHandler={addVisibilityHandler} data={repo} />
          ))}
        </div>
      </main>
    </div>
  );
}
