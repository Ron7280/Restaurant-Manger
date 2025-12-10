import React from "react";
import * as XLSX from "xlsx";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";

const ExportToExcel = ({ data, fileName = "Export", sheetName = "Sheet1" }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <PiMicrosoftExcelLogoFill
      onClick={handleExport}
      size={25}
      className="cursor-pointer"
    />
  );
};

export default ExportToExcel;
