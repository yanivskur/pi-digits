import { FormattedMessage } from "react-intl";
import { Flex, Text, Spinner } from "theme-ui";
import MyButton from "./MyButton";

const RenderDigits = ({
  digitsToDisplay = "default value",
  errorType,
  showSpinner,
  search=""
}) => {
  return (
    <Flex
      sx={{
        marginTop: "50px",
        width: "50%",
      }}
    >
      <Flex
        sx={{
          background: "whitesmoke",
          border: "solid",
          borderColor:
            errorType.negative || errorType.tooLong ? "red" : "black",
          flexDirection: "flex-start",
          padding: "20px",
          width: "85%",
          borderRadius: "30px",
        }}
      >
        <Text
          style={{
            fontSize: "30px",
            width: "100%",
            color: errorType.negative || errorType.tooLong ? "red" : "black",
            overflowWrap: "break-word",
            textAlign:
              errorType.negative || errorType.tooLong ? "center" : "start",
            pb: "3rem",
          }}
        >
          {errorType.tooLong ? (
            <FormattedMessage id="lbl.err_too_long" />
          ) : errorType.negative ? (
            <FormattedMessage id="lbl.err_negative" />
          ) : (
            digitsToDisplay.split(
              new RegExp(`(${search})`, "gi")).map((part, index) => 
                part === search ? (
                  <Text
                    key={index}
                    sx={{
                      color: "deepSkyBlue"
                    }}
                  >
                    {part}
                  </Text>
                ) : (
                  <Text key={index}>{part}</Text>
              ))
          )}
          {showSpinner && (
            <Spinner size={"25px"} color={"DeepSkyBlue"}></Spinner>
          )}
        </Text>
      </Flex>
      <MyButton
        bg="lightgreen"
        disabled={errorType.negative || errorType.tooLong}
        sx={{
          width: "15%",
          margin: "0 5px 0 5px",
        }}
        onClick={() => {navigator.clipboard.writeText(digitsToDisplay)}}
      >
        <FormattedMessage id="lbl.copy" />
      </MyButton>
    </Flex>
  );
};

export default RenderDigits;
