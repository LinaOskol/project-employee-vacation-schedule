export const loadEmployees = () => {
  const data = localStorage.getItem("employees");
  return data ? JSON.parse(data) : [];
};

export const saveEmployees = (employees) => {
  localStorage.setItem("employees", JSON.stringify(employees));
};

export const clearEmployees = () => {
  localStorage.removeItem("employees");
};