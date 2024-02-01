import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css"; // Import the styles
import "../components/Styles/AdminPanel.css"
import 'semantic-ui-css/semantic.min.css';
import { Button } from 'semantic-ui-react';


const AdminPanel = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8085/api/fetchData");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [newData, setNewData] = useState({
    name: "",
    phone: "",
    seva: "",
    selectedDate: new Date(),
    notify: "",
  });

  const handleDateChange = (date) => {
    const selectedDate = new Date(date);
    setNewData({ ...newData, selectedDate });
  };

  const handleChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleAddData = async () => {
    try {
      if (newData.name && newData.phone && newData.seva && newData.selectedDate && newData.notify) {
        const { selectedDate, ...requestData } = newData;
        const response = await axios.post("https://srs-matha.onrender.com/api/addData", {
          ...requestData,
          date: selectedDate,
        });

        const addedData = response.data;

        if (addedData && addedData._id && addedData.name && addedData.phone && addedData.seva && addedData.notify) {
          const updatedData = [...data, addedData];
          setData(updatedData);
          setNewData({ name: "", phone: "", seva: "", selectedDate: "", notify: "" });
        } else {
          console.error("Invalid response format from the server");
        }
      } else {
        alert("Please fill in all fields");
      }
    } catch (error) {
      console.error("Error adding data:", error.message);
    }
  };

  const scheduleMessage = async (phoneNumber) => {
    try {
      console.log("scheduleMessage called with phoneNumber:", phoneNumber);
  
      // Delay the execution of the message sending logic by 5 minutes (300,000 milliseconds)
      const delayInMilliseconds = 10 * 1000; // 10 seconds
      console.log("Delaying for", delayInMilliseconds, "milliseconds");
      await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
  
      // Now, make an API request to trigger the send-instant-message action
      console.log("Making API request to send-instant-message");
      const response = await axios.post("https://srs-matha.onrender.com/api/send-instant-message", {
        phoneNumber,
        message: "Your scheduled message content here",
      });
  
      if (response.status === 200) {
        console.log("Scheduled message sent successfully!");
      } else {
        console.error("Failed to send scheduled message.");
      }
    } catch (error) {
      console.error("Error in scheduleMessage:", error);
    }
  };
  
  const handleScheduleMessage = (phoneNumber) => {
    console.log("Button clicked! Phone Number:", phoneNumber);
    scheduleMessage(phoneNumber);
  };

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "_id" },
      { Header: "Name", accessor: "name" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Seva", accessor: "seva" },
      {
        Header: "Selected Date",
        accessor: "date",
        Cell: ({ value }) => {
          const formattedDate = new Date(value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          return <span>{formattedDate}</span>;
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <Button
      className="custom-button" // You can still add your existing class if needed
      primary // Use the primary style for a blue button
      onClick={() => handleScheduleMessage(row.original.phone)}
    >
      Schedule
    </Button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <div className="admin-panel-container">
      <h1>User Data</h1>
      <div className="form-container">
        <label>
          Name:
          <input type="text" name="name" value={newData.name} onChange={handleChange} className="input-field" />
        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={newData.phone} onChange={handleChange} className="input-field" />
        </label>
        <label>
          Seva:
          <input type="text" name="seva" value={newData.seva} onChange={handleChange} className="input-field" />
        </label>
        <label>
          Date:
          <DatePicker selected={newData.selectedDate} onChange={handleDateChange} dateFormat="MMMM d, yyyy" className="input-field" />
        </label>
        <label>
          Notify:
          <input type="text" name="notify" value={newData.notify} onChange={handleChange} className="input-field" />
        </label>
        <Button onClick={handleAddData} className="add-data-button" primary>
  Add Data
</Button>
      </div>

      <table {...getTableProps()} className="data-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
