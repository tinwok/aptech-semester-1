export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button
        className="rounded border px-3 py-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`rounded border px-3 py-1 ${
            currentPage === index + 1 ? "bg-zinc-900 text-white" : ""
          }`}
        >
          {index + 1}
        </button>
      ))}

      <button
        className="rounded border px-3 py-1"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}
