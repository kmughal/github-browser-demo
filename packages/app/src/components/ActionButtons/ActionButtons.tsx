import React from 'react';

type ActionButtonsProps = {
    nextPage: () => void;
    prevPage: () => void;
    currentPage: number;
    totalItems: number;
};

export const ActionButtons = ({ prevPage, currentPage, nextPage, totalItems }: ActionButtonsProps) => {

    return <div className="flex ml-5">
        <button
            className="previous-button"
            onClick={prevPage}
            disabled={currentPage === 0}
        >
            Previous
        </button>
        <button
            className="ml-5 next-button"
            onClick={nextPage}
            disabled={currentPage >= Math.floor(totalItems / 10)}
        >
            Next
        </button>
    </div>
};