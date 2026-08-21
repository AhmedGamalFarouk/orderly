import { useState } from "react";

export default function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const nextPage = () => setCurrentPage((page) => page + 1);
  const prevPage = () => setCurrentPage((page) => (page == 1 ? 1 : page - 1));
  return (
    <div className="join ">
      <button type="button" className="join-item btn" onClick={prevPage}>«</button>
      <button type="button" className="join-item btn tabular-nums">Page {currentPage}</button>
      <button type="button" className="join-item btn" onClick={nextPage}>»</button>
    </div>
  );
}
