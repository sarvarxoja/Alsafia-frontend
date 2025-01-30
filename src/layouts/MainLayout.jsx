import axios from "axios";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";

export const MainLayout = () => {
  const [myData, setMyData] = useState([]);

  useEffect(() => {
    profileMe();
  }, []);

  async function profileMe() {
    try {
      let { data } = await axios.get(`/admin/profile/me`);
      console.log(data);
      setMyData(data.myData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="d-flex">
      <Sidebar myData={myData} />
      <Outlet />
    </div>
  );
};
