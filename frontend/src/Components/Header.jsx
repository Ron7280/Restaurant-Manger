import { FaSearch, FaPlus } from "react-icons/fa";
import { TfiBackRight } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
const Header = ({
  searchQuery,
  handleSearchChange,
  btnFunction,
  icon: Icon,
  title,
  button,
  searchBTN,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center h-[5%] justify-between">
      <div className="w-[50%]">
        <div className="flex items-center gap-3 text-2xl font-semibold text-mainColor">
          <Icon size={40} />
          {title}
        </div>
      </div>

      <div className="flex items-center justify-end w-[50%] gap-3">
        {searchBTN && (
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
        {button && (
          <button
            onClick={btnFunction}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-mainColor text-white
            rounded-lg shadow-md shadow-black p-2"
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
