import { Button } from "theme-ui";
const MyButton = ({ children, ...props }) => {
  return (
    <Button
      {...props}
      sx={{
        padding:"0",
        borderRadius: "30px",
        color: "black",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "18px",
        ":hover": props.disabled ? {} : {
          opacity: "0.8",
          outline: "2px solid black",
        },
        ":disabled": {
          bg: "lightgray",
        },
        transition: "100ms ease-in",
        ...props.sx,
      }}
    >
      {children}
    </Button>
  );
};
export default MyButton;
