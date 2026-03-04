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
                // console.log(form)
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









