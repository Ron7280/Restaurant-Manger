import { toast } from "react-toastify";

const Alert = ({ changeTheme }) => {
  const getPosition = () => {
    return window.innerWidth <= 768 ? "top-center" : "top-left";
  };

  const notifyS = (msg) =>
    toast.success(msg, {
      position: getPosition(),
      autoClose: 2000,
      pauseOnHover: true,
      theme: `${changeTheme ? "light" : "colored"}`,
      className: "custom-toast text-xl",
    });

  const notifyE = (msg) =>
    toast.error(msg, {
      position: getPosition(),
      autoClose: 2000,
      pauseOnHover: true,
      theme: `${changeTheme ? "light" : "colored"}`,
      className: "custom-toast text-xl",
    });

  const notifyW = (msg) =>
    toast.warn(msg, {
      position: getPosition(),
      autoClose: 2000,
      pauseOnHover: true,
      theme: `${changeTheme ? "light" : "colored"}`,
      className: "custom-toast text-xl",
    });

  const notifyI = (msg) =>
    toast.info(msg, {
      position: getPosition(),
      autoClose: 2000,
      pauseOnHover: true,
      theme: `${changeTheme ? "light" : "colored"}`,
      className: "custom-toast text-xl",
    });

  return {
    notifyS,
    notifyE,
    notifyW,
    notifyI,
  };
};

export default Alert;
