// TableComponent.js
import React from "react";
import { useTable } from "react-table";

const TableComponent = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <table {...getTableProps()} style={{ width: "100%" }}>
      {/* ... (rest of the table rendering logic) */}
    </table>
  );
};

export default TableComponent;
