import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog , confirmDialog} from "primereact/confirmdialog";
import { FilterMatchMode } from "primereact/api";
import { deleteEmployee, getEmployees, addEmployee, updateEmployee} from "../Service/EmployeeAPI";
import "../styles/global.css";
import { Password } from "primereact/password";



const EmployeeRegistry = () => {
  <ConfirmDialog/>
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    empname: "",
    empemail: "",
    Password:"",
    empsalary: ""
  });

  const [filters] = useState({
    empname: { value: null, matchMode: FilterMatchMode.CONTAINS },
    empemail: { value: null, matchMode: FilterMatchMode.CONTAINS },
    empsalary: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const [lazyParams, setLazyParams] = useState({
  page: 0,
  rows: 5,
  sortField: null,
  sortOrder: null,
  filters: {}
});

  useEffect(() => {
    fetchEmployees();
  }, [lazyParams]);

const fetchEmployees = async (params = lazyParams) => {
  setLoading(true);

  const response = await getEmployees({
    page: params.page,
    size: params.rows,
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    filters: params.filters
  });

  setData(response.data.data);
  setTotalRecords(response.data.totalRecords);
  setLoading(false);
};


  const resetForm = () => {
    setForm({ empname: "", empemail: "", empsalary: "" });
    setEditId(null);
    setIsEdit(false);
  };

//   const handleDelete = async (uuid) => {
//     await deleteEmployee(uuid);
//     setData((prev) => prev.filter((emp) => emp.uuid !== uuid));
//   };

const handleDelete = (uuid) => {
  confirmDialog({
    message: "Are you sure you want to delete this employee?",
    header: "Delete Confirmation",
    icon: "pi pi-exclamation-triangle",
    acceptClassName: "p-button-danger",
    accept: async () => {
      await deleteEmployee(uuid);
      setData((prev) => prev.filter((emp) => emp.uuid !== uuid));
    },
    reject: () => {
      // optional: toast or nothing
    }
  });
};


  const handleAddClick =()=>{
    resetForm();
    setIsEdit(false)
    setShowForm(true);
  };

  const handleEditClick = (row) => {
    setForm({
      empname: row.empname,
      empemail: row.empemail,
      empsalary: row.empsalary
    });
    setEditId(row.uuid);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEdit) {
            await updateEmployee(editId, {
                empname: form.empname,
                empemail: form.empemail,
                empsalary: Number(form.empsalary)
            });
        } 
        else {
                console.log(form)
                await addEmployee({
                empname: form.empname,
                empemail: form.empemail,
                password: form.password,
                empsalary: Number(form.empsalary)
            });
        }

        setShowForm(false);
        resetForm();
        fetchEmployees();
    };

  const actionTemplate = (rowData) => (
    <div className="action-buttons">
      <Button
        label="Edit"
        size="small"
        severity="info"
        onClick={() => handleEditClick(rowData)}
      />
      <Button
        label="Delete"
        size="small"
        severity="danger"
        onClick={() => handleDelete(rowData.uuid)}
      />
    </div>
  );

  return (
    <>
      <ConfirmDialog/>
    <div className="page-container">
      {/* HEADER */}
      <div className="header">
        <h1>Employee Registry</h1>
        <Button
          label="Add Employee"
          icon="pi pi-plus"
          onClick={handleAddClick}
        />
      </div>

      {/* TABLE */}
      {!showForm && (
        <div className="table-container">
            <DataTable
                    value={data}
                    lazy
                    filterDisplay="row"
                    paginator
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    rows={lazyParams.rows}
                    first={lazyParams.page * lazyParams.rows}
                    totalRecords={totalRecords}
                    loading={loading}

                    sortField={lazyParams.sortField}   
                    sortOrder={lazyParams.sortOrder}

                    onPage={(e) =>
                setLazyParams({
                ...lazyParams,
                page: e.page,
                rows: e.rows
                })
            }
            onSort={(e) =>
                setLazyParams({
                ...lazyParams,
                sortField: e.sortField,
                sortOrder: e.sortOrder,
                page:0
                })
            }
            onFilter={(e) =>
                setLazyParams({
                ...lazyParams,
                filters: e.filters,
                page: 0
                })
            }
            >

          <Column field="empname" header="Name" sortField="empname" sortable filter filterPlaceholder="Search name" />
          <Column field="empemail" header="Email" sortField="empemail" sortable filter   filterPlaceholder="Search email"/>
          <Column field="empsalary" header="Salary" sortField="empsalary" sortable filter filterPlaceholder="Search salary" />
          <Column header="Actions" body={actionTemplate} />
        </DataTable>
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="form-overlay">
            <form className="form-card" onSubmit={handleSubmit}>
                <h2>{isEdit ? "Update Employee" : "Add Employee"}</h2>

                <input
                type="text"
                placeholder="Employee Name"
                value={form.empname}
                onChange={(e) =>
                    setForm({ ...form, empname: e.target.value })
                }
                required
                />

                <input
                type="email"
                placeholder="Employee Email"
                value={form.empemail}
                onChange={(e) =>
                    setForm({ ...form, empemail: e.target.value })
                }
                required
                />
                {!isEdit?(<input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                setForm({ ...form, password: e.target.value })
                }
                required={!isEdit}   // required only when adding
                />):("")}


                <input
                type="number"
                placeholder="Employee Salary"
                value={form.empsalary}
                onChange={(e) =>
                    setForm({ ...form, empsalary: e.target.value })
                }
                required
                />

                <div className="form-actions">
                    <Button type="submit" label="Save"/>
                    <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        onClick={() => {
                        setShowForm(false);
                        resetForm();
                        }}
                    />
                </div>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default EmployeeRegistry;





















// import React, { useEffect, useState } from "react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { FilterMatchMode } from "primereact/api";
// import { deleteEmployee, getEmployees } from "../Service/EmployeeAPI";

// const EmployeeRegistry = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔹 Filters state (column-level filters)
//   const [filters, setFilters] = useState({
//     empname: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     empemail: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     empsalary: { value: null, matchMode: FilterMatchMode.EQUALS },
//   });

//   // 🔹 Fetch employees
// useEffect(() => {
//   fetchEmployees();
// }, []);

// const fetchEmployees = async () => {
//   setLoading(true);     // start loading
//   const res = await getEmployees(); // API call
//   setData(res.data.data);
//   setLoading(false);    // stop loading
// };


//   // 🔹 Delete handler
//   const handleDelete = async (uuid) => {
//     await deleteEmployee(uuid);
//     setData((prev) => prev.filter((emp) => emp.uuid !== uuid));
//   };

//   // 🔹 Action buttons column
//   const actionTemplate = (rowData) => {
//     return (
//       <div className="flex gap-2">
//         <Button
//           label="Delete"
//           severity="danger"
//           size="small"
//           onClick={() => handleDelete(rowData.uuid)}
//         />
//         <Button
//           label="Update"
//           severity="info"
//           size="small"
//           onClick={() => navigate(`/updateemployee/${rowData.uuid}`)}
//         />
//       </div>
//     );
//   };

//   return (
//     <main className="mainContainer">
//         <div>
//         <h1>Employee Registry</h1>
//         <botton onClick={()=>{handleAddEmp}}>Add Employee</botton>
//         </div>

//       <section className="tableContainer">
//         <DataTable
//           value={data}
//           loading={loading}
//           paginator
//           rows={5}
//           rowsPerPageOptions={[2,5, 10, 20]}
//           dataKey="uuid"
//           filters={filters}
//           filterDisplay="row"
//           emptyMessage="No employees found"
//           responsiveLayout="scroll"
//         >
//           <Column
//             field="empname"
//             header="Name"
//             sortable
//             filter
//             filterPlaceholder="Filter by name"
//           />

//           <Column
//             field="empemail"
//             header="Email"
//             sortable
//             filter
//             filterPlaceholder="Filter by email"
//           />

//           <Column
//             field="empsalary"
//             header="Salary"
//             sortable
//             filter
//             filterPlaceholder="Filter by salary"
//           />

//           <Column header="Actions" body={actionTemplate} />
//         </DataTable>
//       </section>
//     </main>
//   );
// };

// export default EmployeeRegistry;






































// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import { FilterMatchMode } from "primereact/api";
// import React, { useEffect, useState } from "react";
// import { InputText } from "primereact/inputtext";
// import { Button } from "primereact/button";
// import { DataTable } from "primereact/datatable";

// // import React, { useEffect, useState } from "react";
// // import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// // import { InputText } from "primereact/inputtext";
// // import { Button } from "primereact/button";


// import {
//   addEmployee,
//   deleteEmployee,
//   getEmployees,
//   updateEmployee,
// } from "../Service/EmployeeAPI";

// const EmployeeRegistry = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [filters, setFilters] = useState({
//     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//     email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//     salary: { value: null, matchMode: FilterMatchMode.EQUALS },
//   });

//   const [globalFilterValue, setGlobalFilterValue] = useState("");

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     const res = await getEmployees();
//     setEmployees(res.data.data ?? res.data); // SAFE
//     setLoading(false);
//   };

// //   const onGlobalFilterChange = (e) => {
// //     const value = e.target.value;
// //     let _filters = { ...filters };

// //     _filters["global"].value = value;

// //     setFilters(_filters);
// //     setGlobalFilterValue(value);
// //   };

//   const header = (
//     <div className="flex justify-content-between align-items-center">
//       <h2>Employee Registry</h2>
//       <span className="p-input-icon-left">
//         <i className="pi pi-search" />
//         <InputText
//           value={globalFilterValue}
//         //   onChange={onGlobalFilterChange}
//           placeholder="Global Search"
//         />
//       </span>
//     </div>
//   );

//   const handleAddEmployee = async () => {
//     await addEmployee({
//       name: "New Employee",
//       email: "new@mail.com",
//       salary: 40000,
//     });
//     fetchEmployees();
//   };

//   const actionBodyTemplate = (rowData) => {
//     return (
//       <div className="flex gap-2">
//         <Button
//           icon="pi pi-pencil"
//           severity="info"
//           onClick={() => updateEmployee(rowData.uuid, { salary: 50000 })}
//         />
//         <Button
//           icon="pi pi-trash"
//           severity="danger"
//           onClick={() => deleteEmployee(rowData.uuid)}
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="card">
//       <Button
//         label="Add Employee"
//         icon="pi pi-plus"
//         className="mb-3"
//         onClick={handleAddEmployee}
//       />

//       <DataTable
//         value={employees}
//         paginator
//         rows={5}
//         loading={loading}
//         dataKey="uuid"
//         filters={filters}
//         filterDisplay="row"
//         globalFilterFields={["name", "email", "salary"]}
//         header={header}
//         emptyMessage="No employees found"
//       >
//         <Column
//           field="name"
//           header="Name"
//           filter
//           filterPlaceholder="Search name"
//           sortable
//         />

//         <Column
//           field="email"
//           header="Email"
//           filter
//           filterPlaceholder="Search email"
//           sortable
//         />

//         <Column
//           field="salary"
//           header="Salary"
//           filter
//           filterPlaceholder="Search salary"
//           sortable
//         />

//         <Column header="Actions" body={actionBodyTemplate} />
//       </DataTable>
//     </div>
//   );
// };

// export default EmployeeRegistry;











// import React, { useEffect, useState } from "react";
// import {
//   addEmployee,
//   deleteEmployee,
//   getEmployees,
//   updateEmployee,
// } from "../Service/EmployeeAPI";

// const EmployeeRegistry = () => {
//   const [employees, setEmployees] = useState([]);
//   const [filters, setFilters] = useState({
//     name: "",
//     email: "",
//     salary: "",
//   });

//   const [sortConfig, setSortConfig] = useState({
//     key: "",
//     direction: "asc",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

// //   const fetchEmployees = async () => {
// //     const res = await getEmployees();
// //     setEmployees(res.data);
// //   };

// const fetchEmployees = async () => {
//   const res = await getEmployees();
//   setEmployees(res.data.data); // adjust if needed
// };


//   const handleAddEmployee = async () => {
//     const newEmployee = {
//       name: "New Employee",
//       email: "new@email.com",
//       salary: 50000,
//     };
//     await addEmployee(newEmployee);
//     fetchEmployees();
//   };

//   const handleDelete = async (uuid) => {
//     await deleteEmployee(uuid);
//     fetchEmployees();
//   };

//   const handleUpdate = async (uuid) => {
//     const updatedData = {
//       salary: 60000,
//     };
//     await updateEmployee(uuid, updatedData);
//     fetchEmployees();
//   };

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // 🔍 Filter
//   const filteredEmployees = employees.filter((emp) =>
//     emp.name.toLowerCase().includes(filters.name.toLowerCase()) &&
//     emp.email.toLowerCase().includes(filters.email.toLowerCase()) &&
//     emp.salary.toString().includes(filters.salary)
//   );

//   // ↕ Sort
//   const sortedEmployees = [...filteredEmployees].sort((a, b) => {
//     if (!sortConfig.key) return 0;
//     if (a[sortConfig.key] < b[sortConfig.key])
//       return sortConfig.direction === "asc" ? -1 : 1;
//     if (a[sortConfig.key] > b[sortConfig.key])
//       return sortConfig.direction === "asc" ? 1 : -1;
//     return 0;
//   });

//   // 📄 Pagination
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentEmployees = sortedEmployees.slice(
//     indexOfFirst,
//     indexOfLast
//   );

//   const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Employee Registry</h2>
//       <button onClick={handleAddEmployee}>Add Employee</button>

//       <table border="1" cellPadding="10" cellSpacing="0" width="100%">
//         <thead>
//           <tr>
//             <th onClick={() => handleSort("name")}>Name</th>
//             <th onClick={() => handleSort("email")}>Email</th>
//             <th onClick={() => handleSort("salary")}>Salary</th>
//             <th>Update</th>
//             <th>Delete</th>
//           </tr>
//           <tr>
//             <th>
//               <input
//                 placeholder="Filter name"
//                 onChange={(e) =>
//                   setFilters({ ...filters, name: e.target.value })
//                 }
//               />
//             </th>
//             <th>
//               <input
//                 placeholder="Filter email"
//                 onChange={(e) =>
//                   setFilters({ ...filters, email: e.target.value })
//                 }
//               />
//             </th>
//             <th>
//               <input
//                 placeholder="Filter salary"
//                 onChange={(e) =>
//                   setFilters({ ...filters, salary: e.target.value })
//                 }
//               />
//             </th>
//             <th></th>
//             <th></th>
//           </tr>
//         </thead>

//         <tbody>
//           {currentEmployees.map((emp) => (
//             <tr key={emp.uuid}>
//               <td>{emp.name}</td>
//               <td>{emp.email}</td>
//               <td>{emp.salary}</td>
//               <td>
//                 <button onClick={() => handleUpdate(emp.uuid)}>
//                   Update
//                 </button>
//               </td>
//               <td>
//                 <button onClick={() => handleDelete(emp.uuid)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div style={{ marginTop: "10px" }}>
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i}
//             onClick={() => setCurrentPage(i + 1)}
//             style={{
//               margin: "5px",
//               fontWeight: currentPage === i + 1 ? "bold" : "normal",
//             }}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EmployeeRegistry;
