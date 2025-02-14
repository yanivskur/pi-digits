//Imports from react open source
import React, { useEffect, useState } from "react";
import { Text, Flex, Input } from "theme-ui";
import { useDispatch, useSelector } from "react-redux";

import { getPiDigits } from "../redux/slices/PiSlice";
import MyButton from "../components/MyButton";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Title from "../components/Title";
import RenderDigits from "../components/RenderDigits";
import { FormattedMessage } from "react-intl";

//================================================================================
const Pi = () => {
  // Use dispatch to call redux functions
  const dispatch = useDispatch();
  // Use selector to get the piDigits from the store
  const { piDigits } = useSelector((state) => state.PiSlice);

  // The number in the input field
  const [numDigits, setNumDigits] = useState(20);
  // The number currently shown as pi
  const [displayedDigits, setDisplayedDigits] = useState("3.");
  // Is it currently printing
  const [isPrinting, setIsPrinting] = useState(false);
  // Is the printing paused
  const [isPaused, setIsPaused] = useState(false);
  // Validations on input
  const [errorType, setErrorType] = useState({
    negative: false,
    tooLong: false,
  });
  // Long pressing the plus and minus buttons
  const [intervalPlMn, setIntervalPlMn] = useState(null);
  // The number in the search field
  const [numSearch, setNumSearch] = useState(42);
  // The number passed to RenderDigits
  const [searchValue, setSearchValue] = useState("");

  //--------------------------------------------------------------
  //Use effect to print every second 1 digit
  useEffect(() => {
    // calls a function at specified intervals (in milliseconds)
    const interval = setInterval(() => {
      // the function we want to call
      if (isPrinting) {
        setDisplayedDigits(
          displayedDigits + piDigits.charAt(displayedDigits.length - 2)
        );
        if (displayedDigits.length > (piDigits || "").length)
          setIsPrinting(false);
          setIsPaused(false);
      }
      //the interval
    }, 500);

    return () => clearInterval(interval);
  }, [isPrinting, displayedDigits, piDigits, numDigits]);

  //--------------------------------------------------------------
  //Handle minus function, sub 1 from  numDigits
  const handleMinus = () => {
    setNumDigits((numDigits) => Math.max(numDigits - 1, 0));
    setErrorType({ negative: numDigits < 0, tooLong: numDigits > 1000 });
    setIsPrinting(() => false);
  };
  //--------------------------------------------------------------
  //Handle plus function, sub 1 from  numDigits
  const handlePlus = () => {
    setNumDigits((numDigits) => Math.min(numDigits === "" ? 1 : numDigits + 1, 1000));
    setErrorType({ negative: numDigits < 0, tooLong: numDigits > 1000 });
    setIsPrinting(() => false);
  };
  //--------------------------------------------------------------
  const handlePause = () => {
    setIsPrinting(!isPrinting);
    setIsPaused(!isPaused);
  };
  //--------------------------------------------------------------
  const handleStart = () => {
    setIsPrinting(true);
    setIsPaused(false);
    setDisplayedDigits("3.");
    dispatch(getPiDigits(numDigits));
  };
  //--------------------------------------------------------------
  const handleRefresh = () => {
    setIsPrinting(false);
    setIsPaused(false);
    handleClear();
    setDisplayedDigits("3.");
    setNumDigits(20);
    setErrorType({ negative: false, tooLong: false });
  };
  //--------------------------------------------------------------
  const handleSearch = () => {  
    setSearchValue(numSearch);
  }; 
  //--------------------------------------------------------------
  const handleClear = () => {
    setNumSearch("");
    setSearchValue("");
  };
  //--------------------------------------------------------------
  const changeNumDigit = (value) => {
    setIsPrinting(false);
    setIsPaused(false);
    setNumDigits(parseInt(value) || 0);
    setErrorType({ negative: parseInt(value) < 0, tooLong: parseInt(value) > 1000 });
  };
  //--------------------------------------------------------------
  const changeNumSearch = (value) => {
    setNumSearch(value || "");
  };
  //--------------------------------------------------------------
  
  return (
    <Flex
      id="main_flex"
      sx={{
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        background: "background",
        minHeight: "100vh",
      }}
    >
      <Header />

      <Flex
        id="Body"
        sx={{
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "100%",
          py: "20px",
          my: "auto",
        }}
      >
        <Title />

        <Flex
          sx={{
            justifyContent: "center",
            gap: "10%",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <Flex
            id="main box"
            sx={{
              alignItems: "center",
              background: "whitesmoke",
              border: "solid",
              borderRadius: "30px",
              flexDirection: "column",
              height: "280px",
              justifyContent: "space-between",
              marginTop: "50px",
              py: "20px",
              width: "15%",
            }}
          >
            {/* --- Label --- */}
            <Text sx={{ color: "black" }}>
              <FormattedMessage id="lbl.number_of_digits" />
            </Text>

            <Flex id="plusMinus-container">
              {/* --- Minus Button --- */}
              <MyButton
                disabled={numDigits <= 0}
                backgroundColor="coral"
                sx={{ width: "40px" }}
                onClick={handleMinus}
                onMouseDown={() =>
                  setIntervalPlMn(setInterval(handleMinus, 100))
                }
                onMouseUp={() => {
                  clearInterval(intervalPlMn);
                  setIntervalPlMn(null);
                }}
                onMouseLeave={() => {
                  if (intervalPlMn) {
                    clearInterval(intervalPlMn);
                    setIntervalPlMn(null);
                  }
                }}
              >
                -
              </MyButton>

              {/* --- Input --- */}
              <Input
                sx={{
                  marginX: "10px",
                  textAlign: "center",
                  width: "100px",
                  borderRadius: "10px",
                  borderWidth: "2px",
                  color: "black",
                  outlineColor:
                    errorType.negative || errorType.tooLong ? "red" : "black",
                  borderColor:
                    errorType.negative || errorType.tooLong ? "red" : "black",
                }}
                value={numDigits}
                onChange={(e) => {
                  changeNumDigit(e.target.value.replace(/\D/g, ""));
                }}
              />

              {/* --- Plus Button --- */}
              <MyButton
                disabled={numDigits >= 1000}
                backgroundColor="DeepSkyBlue"
                sx={{ width: "40px" }}
                onClick={handlePlus}
                onMouseDown={() =>
                  setIntervalPlMn(setInterval(handlePlus, 100))
                }
                onMouseUp={() => {
                  clearInterval(intervalPlMn);
                  setIntervalPlMn(null);
                }}
                onMouseLeave={() => {
                  if (intervalPlMn) {
                    clearInterval(intervalPlMn);
                    setIntervalPlMn(null);
                  }
                }}
              >
                +
              </MyButton>
            </Flex>

            <Flex
              id="action-container"
              sx={{
                width: "100%",
                justifyContent: "space-evenly",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* --- Pause Button --- */}
              <MyButton
                disabled={!isPrinting && !isPaused}
                onClick={handlePause}
                bg="coral"
                sx={{ width: "45%", height: "36px" }}
              >
                {isPaused ? (
                  <FormattedMessage id="lbl.unpause" />
                ) : (
                  <FormattedMessage id="lbl.pause" />
                )}
              </MyButton>

              {/* --- Start Button --- */}
              <MyButton
                disabled={
                  isPrinting ||
                  !numDigits ||
                  errorType.negative ||
                  errorType.tooLong
                }
                onClick={handleStart}
                bg="DeepSkyBlue"
                sx={{ width: "45%", height: "36px" }}
              >
                <FormattedMessage id="lbl.start" />
              </MyButton>

              {/* --- Refresh Button --- */}
              <MyButton
                bg="lightgreen"
                onClick={handleRefresh}
                sx={{ width: "45%", height: "36px" }}
              >
                <FormattedMessage id="lbl.refresh" />
              </MyButton>
            </Flex>
          </Flex>

          <Flex
            id="search box"
            sx={{
              alignItems: "center",
              background: "whitesmoke",
              border: "solid",
              borderRadius: "30px",
              flexDirection: "column",
              height: "280px",
              justifyContent: "space-between",
              marginTop: "50px",
              py: "20px",
              width: "15%",
            }}
          >
            {/* --- Label --- */}
            <Text sx={{ color: "black" }}>
              <FormattedMessage id="lbl.search_number" />
            </Text>

            {/* --- Input --- */}
            <Input
              sx={{
                marginX: "10px",
                textAlign: "center",
                width: "100px",
                borderRadius: "10px",
                borderWidth: "2px",
                color: "black",
              }}
              value={numSearch}
              onChange={(e) => {
                changeNumSearch(e.target.value.replace(/\D/g, ""));
              }}
            />

  <Flex sx={{m:"23px", width:"100%",justifyContent: "space-evenly",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "10px"}}>
{/* --- Clear --- */}
            <MyButton
              disabled={!numSearch && !searchValue}
              onClick={handleClear}
              bg="coral"
              sx={{ width: "45%", height: "36px" }}
            >
              <FormattedMessage id="lbl.clear" />
            </MyButton>
            {/* --- Search --- */}
            <MyButton
              disabled={!numSearch || numSearch === searchValue}
              onClick={handleSearch}
              bg="deepSkyBlue"
              sx={{ width: "45%", height: "36px" }}
            >
              <FormattedMessage id="lbl.search" />
            </MyButton>
</Flex>

          </Flex>
        </Flex>
        <RenderDigits
          digitsToDisplay={displayedDigits}
          errorType={errorType}
          showSpinner={
            isPrinting &&
            displayedDigits !== null &&
            displayedDigits.length !== numDigits + 2
          }
          search={searchValue}
        />
      </Flex>
      <Footer />
    </Flex>
  );
};
//================================================================================
//Export Pi component
export default Pi;
