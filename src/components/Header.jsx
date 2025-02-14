import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { Image, Flex, Text, useColorMode } from "theme-ui";

import pi_header from "../assets/images/pi_header.png";
import LanguageSwitch from "./LanguageSwitch";
import { doLogout } from "../redux/slices/AuthSlice";
import MyButton from "./MyButton";


const Header = () => {
  const [colorMode, setColorMode] = useColorMode()
  const dispatch = useDispatch();

  return (
    <Flex
      id="Pi_Flex"
      sx={{
        backgroundColor: "DeepSkyBlue ",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: "141px",
        py: "10px",
      }}
    >

      <MyButton
        sx={{
          width: "10rem",
          height: "36px",
          backgroundColor: "whiteSmoke",
        }}
        onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
      >
        <FormattedMessage
          id={colorMode === "light" ? "lbl.dark_theme" : "lbl.light_theme"}
        />
      </MyButton>

      <Text sx={{ width: "12rem", color:"black" }}>
        <FormattedMessage
          id="lbl.formateDate"
          values={{ dateParam: new Date() }}
        />
      </Text>

      <Image src={pi_header} ></Image>

      <LanguageSwitch sx={{ width: "12rem", color:"black" }} />

      <MyButton
        sx={{
          width: "10rem",
          height: "36px",
          backgroundColor: "whiteSmoke",
        }}
        onClick={() => dispatch(doLogout())}
      >
        <FormattedMessage id="lbl.logout" />
      </MyButton>
    </Flex>
  );
};

export default Header;
