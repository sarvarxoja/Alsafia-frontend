import "./gloader.css";
import Logo from "../../../public/logo.png"

export const GlobalLoader = () => {
  return (
    <div className="logo_background">
        <img src={Logo} className="global_loader_item"/>
    </div>
  );
};
