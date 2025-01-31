import axios from "axios";
import { useEffect, useState } from "react";
import Login from "../components/auth/login/Login";
import { MainLayout } from "../layouts/MainLayout";
import { Admins } from "../components/admins/Admins";
import { ProductsPage } from "../components/home/Home";
import { AdminProfile } from "../components/admin/Admin";
import { Staff } from "../components/employees/Employees";
import { Products } from "../components/products/Products";
import { NotFound } from "../components/notfound/Notfound";
import { DefaultPage } from "../components/default/Default";
import { UserProfile } from "../components/employee/Employee";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ProductPage } from "../components/product/ProductPage";
import { GlobalLoader } from "../components/loader/GlobalLoader";
import { AddProduct } from "../components/products/create/AddProduct";
import { DatePickerPage } from "../components/employee/EmployeeDasboard";

export const Router = () => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(true);
  const [access, setAccess] = useState(null);

  async function checkAuth() {
    try {
      let data = await axios.get("/auth/check");
      setAccess(true); 
    } catch (error) {
      await refreshToken();
    }
  }

  async function refreshToken() {
    try {
      const response = await axios.post("/auth/refresh/token");
      if (response.status === 200) {
        setAccess(true); 
      } else {
        setAccess(false);
        navigate("/auth/login");
      }
    } catch (error) {
      setAccess(false);
      navigate("/auth/login");
    }
  }

  useEffect(() => {
    if (access !== null) {
      setLoad(false);
    }
  }, [access]);

  useEffect(() => {
    const checkAuthAsync = async () => {
      await checkAuth();
    };
    checkAuthAsync();
  }, []);

  if (load === null || load) {
    return <GlobalLoader />;
  }

  if (access === false) {
    return <Login />;
  }


  return (
    <div>
      <Routes>
        <Route path="/" element={<DefaultPage access={access} />} />
        <Route path="/auth/login" element={<Login access={access} />} />
        <Route element={<MainLayout />}>
          <Route path="/employees" element={<Staff />} />
          <Route path="/home" element={<ProductsPage />} />
          <Route path="/site/admins" element={<Admins />} />
          <Route path="/dashboard" element={<Products />} />
          <Route path="/admin/:id" element={<AdminProfile />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/employee/:id" element={<UserProfile />} />
          <Route
            path="/employee/:id/dashboard/:system_id"
            element={<DatePickerPage />}
          />
          <Route path="/product/create" element={<AddProduct />} />
          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};
