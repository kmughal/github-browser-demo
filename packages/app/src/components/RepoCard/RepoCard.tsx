import React from 'react';
import { GithubRepo } from '../../stores';


type RepoCardProps = {
    addVisibilityHandler: (repoId: number) => void;
    data: GithubRepo;
};

export const RepoCard = ({ addVisibilityHandler, data }: RepoCardProps) => {
    const bgClass = data.visibility ? "bg-slate-200" : "bg-white";

    return <div
        data-testid={`repo-card-${data.id}`}
        className={`repo-card flex-col p-5 border-1 rounded-lg ${bgClass} border-purple-900 m-5 hover:bg-slate-400`}
        key={data.id}
        onClick={() => addVisibilityHandler(data.id)}
    >
        <h1 className="text-4xl flex justify-between cursor-pointer">
            <div className="flex justify-between w-full">

                <div className="flex items-center">
                    <img
                        src={data.avatarUrl}
                        alt="avatar"
                        className="mr-5 w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                        <h1 className="text-lg font-bold">{data.name}</h1>
                        <p className="text-sm text-gray-600">{data.description}</p>
                    </div>
                </div>
                <div className="flex">
                    <span className="text-xl">{data.visibility ? "-" : "+"}</span>
                </div>
            </div>
        </h1>
    </div>
};