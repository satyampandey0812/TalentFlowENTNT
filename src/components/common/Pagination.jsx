// src/components/common/Pagination.jsx

import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  // --- Generate Page Numbers ---
  const pages = [];
  const maxPagesToShow = 5; // Number of page buttons to show
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    // Less than maxPagesToShow total pages, so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // More than maxPagesToShow total pages, so calculate start and end pages
    const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
    const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;

    if (currentPage <= maxPagesBeforeCurrent) {
      // Near the start
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
      // Near the end
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      // Somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrent;
      endPage = currentPage + maxPagesAfterCurrent;
    }
  }

  // Create an array of page numbers to render
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  // --- Calculate "Showing X to Y of Z" text ---
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  // --- Button Styles ---
  const baseButtonStyles = "px-4 py-2 mx-1 border rounded transition-colors duration-200";
  const disabledButtonStyles = "bg-gray-100 text-gray-400 cursor-not-allowed";
  const enabledButtonStyles = "bg-white text-gray-700 hover:bg-gray-50";
  const activeButtonStyles = "bg-blue-500 text-white border-blue-500 hover:bg-blue-600";

  return (
    <div className="flex flex-col items-center mt-6">
      {/* Navigation Buttons */}
      <div className="flex items-center">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={`${baseButtonStyles} ${currentPage === 1 ? disabledButtonStyles : enabledButtonStyles}`}
        >
          &lt;&lt;
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseButtonStyles} ${currentPage === 1 ? disabledButtonStyles : enabledButtonStyles}`}
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${baseButtonStyles} ${currentPage === page ? activeButtonStyles : enabledButtonStyles}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${baseButtonStyles} ${currentPage === totalPages ? disabledButtonStyles : enabledButtonStyles}`}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${baseButtonStyles} ${currentPage === totalPages ? disabledButtonStyles : enabledButtonStyles}`}
        >
          &gt;&gt;
        </button>
      </div>

      {/* Showing Text */}
      <div className="mt-3 text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} candidates
      </div>
    </div>
  );
};

export default Pagination;
