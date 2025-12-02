
import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from './icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

const DOTS = '...';

const usePaginationRange = ({ currentPage, totalPages, siblingCount = 1 }: Omit<PaginationProps, 'onPageChange'>) => {
    return useMemo(() => {
        const totalPageNumbers = siblingCount + 5;

        if (totalPageNumbers >= totalPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPages;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
            return [...leftRange, DOTS, totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
            return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
        
        return []; // ar trebui să fie inaccesibil
    }, [totalPages, currentPage, siblingCount]);
};


export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
    const paginationRange = usePaginationRange({ currentPage, totalPages, siblingCount });

    const onNext = () => {
        onPageChange(Math.min(currentPage + 1, totalPages));
    };

    const onPrevious = () => {
        onPageChange(Math.max(currentPage - 1, 1));
    };

    if (currentPage === 0 || totalPages < 2) {
        return null;
    }

    return (
        <nav aria-label="Pagination">
            <ul className="flex justify-center items-center gap-2 mt-12">
                <li>
                    <button
                        onClick={onPrevious}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center px-3 h-9 leading-tight text-zinc-950 bg-red-950 border border-red-700 rounded-lg hover:bg-red-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Pagina anterioară"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="ml-2 hidden sm:inline">Precedenta</span>
                    </button>
                </li>

                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                        return <li key={`${DOTS}-${index}`} className="flex items-center justify-center px-3 h-9 text-red-400">...</li>;
                    }

                    return (
                        <li key={pageNumber}>
                            <button
                                onClick={() => onPageChange(pageNumber as number)}
                                className={`flex items-center justify-center px-3 h-9 leading-tight border border-zinc-950 rounded-lg transition-colors
                                    ${currentPage === pageNumber
                                        ? 'z-10 text-white bg-red-600 border-red-500 hover:bg-red-700'
                                        : 'text-zinc-950 bg-red-950 hover:bg-red-700 hover:text-white'
                                    }`
                                }
                                aria-current={currentPage === pageNumber ? 'page' : undefined}
                            >
                                {pageNumber}
                            </button>
                        </li>
                    );
                })}

                <li>
                    <button
                        onClick={onNext}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center px-3 h-9 leading-tight text-zinc-950 bg-red-950 border border-red-950 rounded-lg hover:bg-red-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Pagina următoare"
                    >
                        <span className="mr-2 hidden sm:inline">Următoarea</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </li>
            </ul>
        </nav>
    );
};
