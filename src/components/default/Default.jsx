import { useEffect } from "react";
import "./default.css";
import { useNavigate } from "react-router-dom";

export const DefaultPage = ({ access }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (access) {
      navigate("/home");
    } else {
      navigate("/auth/login");
    }
  }, [access]);

  return <span className="loader"></span>;
};
