import { useContext } from "react";
import { Change_Theme_context } from "../Contexts";

const Loader = ({
  type = "spinner",
  color = "#FFFFFF",
  color2 = "#2DD4BF",
  size,
}) => {
  const [changeTheme, setChangeTheme] = useContext(Change_Theme_context);

  switch (type) {
    case "spinner":
      return (
        <div
          className={`animate-spin rounded-full border-t-4 border-b-4 `}
          style={{
            width: size,
            height: size,
            borderColor: ` ${changeTheme ? color2 : color} transparent `,
          }}
        />
      );
    case "dots":
      return (
        <div className="flex items-center gap-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-4 rounded-full animate-pulse"
              style={{
                backgroundColor: changeTheme ? color2 : color,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      );
    case "pulse":
      return (
        <div
          className="rounded-full animate-ping"
          style={{
            width: size,
            height: size,
            backgroundColor: changeTheme ? color2 : color,
          }}
        />
      );
    case "bars":
      return (
        <div className="flex items-center gap-2">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-current animate-pulse rounded-full"
              style={{
                width: size * 0.2,
                height: size * (0.2 + i * 0.3),
                backgroundColor: changeTheme ? color2 : color,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      );
    case "ring":
      return (
        <div
          className="animate-spin rounded-full border-4 border-solid
           border-t-transparent border-r-transparent"
          style={{
            width: size,
            height: size,
            borderColor: `${changeTheme ? color2 : color} transparent`,
          }}
        />
      );
    default:
      return null;
  }
};

export default Loader;
