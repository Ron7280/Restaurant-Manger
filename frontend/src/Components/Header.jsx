import { FaSearch, FaPlus } from "react-icons/fa";
import { TfiBackRight } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import ExportToExcel from "./ExportToExcel";
const Header = ({
  searchQuery,
  handleSearchChange,
  btnFunction,
  icon: Icon,
  title,
  button,
  searchField,
  Excel_text,
  Excel_Data,
  excelBtn,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center h-[5%] justify-between">
      <div className="w-[35%]">
        <div
          className="flex items-center gap-3 text-2xl font-semibold bg-gradient-to-r
         from-mainColor via-Indigo to-Indigo bg-clip-text text-transparent"
        >
          <Icon size={40} className="text-mainColor" />
          {title}
        </div>
      </div>

      <div className="flex items-center justify-end w-[50%] gap-3">
        {searchField && (
          <div className="flex justify-between w-[50%] rounded-lg bg-white items-center pl-2 pr-2 shadow-md shadow-black">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search . . . "
              className="w-full bg-transparent outline-none text-black font-semibold p-2"
            />
            <FaSearch className="text-emerald-400" />
          </div>
        )}
        {excelBtn && (
          <ExportToExcel
            data={Excel_Data}
            fileName={`${Excel_text} Items`}
            sheetName={`${Excel_text} Items`}
          />
        )}
        {button && (
          <button
            onClick={btnFunction}
            className="inline-flex items-center gap-2 bg-mainColor text-white
            rounded-lg shadow-md font-semibold shadow-black p-2"
          >
            <FaPlus /> Add Item
          </button>
        )}
        <TfiBackRight
          onClick={() => navigate(-1)}
          className="cursor-pointer text-mainColor"
          size={30}
        />
      </div>
    </div>
  );
};

export default Header;
