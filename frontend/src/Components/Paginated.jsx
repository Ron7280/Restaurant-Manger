import { useEffect, useState } from "react";

const Paginated = ({ data, RenderComponent, onOffsetChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [prevClicked, setPrevClicked] = useState(false);
  const [nextClicked, setNextClicked] = useState(false);
  const [offset, setOffset] = useState(0);
  const itemsPerPage = 10;
  const maxVisiblePages = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    const newOffset = (currentPage - 1) * itemsPerPage;
    setOffset(newOffset);

    if (onOffsetChange) {
      onOffsetChange(newOffset);
    }
  }, [currentPage, onOffsetChange]);

  const currentItems = data.slice(offset, offset + itemsPerPage);

  const startPage = pageGroup * maxVisiblePages + 1;
  const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  const toggleStateWithTimeout = (setter, state) => {
    setter(!state);
    setTimeout(() => setter(false), 100);
  };

  const NextPage = () => {
    toggleStateWithTimeout(setNextClicked, nextClicked);
    setPageGroup(pageGroup + 1);
  };

  const PrevPage = () => {
    toggleStateWithTimeout(setPrevClicked, prevClicked);
    setPageGroup(pageGroup - 1);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex flex-col gap-3 p-1 h-[90%] pl-2 pr-2 scrollbar-track-transparent
        overflow-y-scroll scrollbar-thin scrollbar-thumb-mainColor2 "
      >
        {currentItems.map((item, index) => (
          <RenderComponent key={index} {...item} />
        ))}
      </div>

      <div className="flex w-full h-[10%] items-center justify-center gap-2 ">
        {pageGroup > 0 && (
          <button
            onClick={PrevPage}
            className={`flex items-center justify-center w-fit h-10 p-2 font-bold 
	                rounded-md bg-mainColor2 shadow-black text-white 
	                ${prevClicked ? "shadow-inner" : ""}`}
          >
            Prev
          </button>
        )}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-[3%] h-10 p-2 font-bold flex items-center justify-center rounded-md shadow-md ${
              currentPage === page
                ? "bg-mainColor2 text-white shadow-lg shadow-black"
                : "bg-gray-200 text-black"
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <button
            onClick={NextPage}
            className={`flex items-center justify-center w-fit h-10 p-2
	                 font-bold rounded-md shadow-black  bg-mainColor2 text-white
	                 ${nextClicked ? "shadow-inner" : ""}`}
          >
            +{totalPages - endPage}
          </button>
        )}
      </div>
    </div>
  );
};

export default Paginated;
