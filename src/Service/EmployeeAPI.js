import axiosInstance from  "./EmployeeAxiosINstance";

  


// Arrow Function to send Add request to API
export let addEmployee=(object)=>{
     axiosInstance.post("/api/employees",object)
}

// Arrow Function to send Get request to API
export const getEmployees = async ({
  page,
  size,
  sortField,
  sortOrder,
  filters
}) => {
  const params = new URLSearchParams();

  params.append("pageSize", size);
  params.append("pageNumber", page + 1);

  // ✅ only append sort if user actually sorted
  if (sortField && sortOrder) {
    params.append("sortColumn", sortField);

    if (sortOrder === 1) {
      params.append("sortOrder", "asc");
    } else if (sortOrder === -1) {
      params.append("sortOrder", "desc");
    }
  }

  // filters
  if (filters) {
    Object.keys(filters).forEach((key) => {
      if (filters[key]?.value) {
        params.append(key, filters[key].value);
      }
    });
  }

  return axiosInstance.post(
    `/api/employees/list?${params.toString()}`,
    {}
  );
};



// Arrow Function to send Get request to API for single employee
export let getEmployeeById=(id)=>{
    return axiosInstance.post(`/api/employees/list?${id}`,{});  
}

// Arrow Function to send Delete request to API
export let deleteEmployee=(uuid)=>{
    return axiosInstance.delete(`/api/employees/${uuid}`);
}
// Arrow Function to send Update request to API
export let updateEmployee=(uuid,object)=>{
    return axiosInstance.patch(`/api/employees/${uuid}`,object);
}






























