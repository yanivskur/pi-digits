//Imports from react open source
import React, { useEffect, useState } from "react";
import { Text, Flex, Input } from "theme-ui";
import { useDispatch, useSelector } from "react-redux";

import { getPiDigits, searchPi } from "../redux/slices/PiSlice";
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
  const { piDigits, searchResults } = useSelector((state) => state.PiSlice);

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
  // The digit to highlight
  const [highlightDigit, setHighlightDigit] = useState(null);
  // The sequnece in the input field
  const [seqSearch, setSeqSearch] = useState("");
  // The sequence the results are for
  const [resulatSeq, setResultSeq] = useState("");

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
    dispatch(searchPi(-1));
    setResultSeq(null);
    setHighlightDigit(null);
    setSeqSearch("");
    setDisplayedDigits("3.");
    setNumDigits(20);
    setErrorType({ negative: false, tooLong: false });
  };
  //--------------------------------------------------------------
  const handleSearch = () => {
    dispatch(searchPi(seqSearch));
    setResultSeq(seqSearch);
  }; 
  //--------------------------------------------------------------
  const changeNumDigit = (value) => {
    setIsPrinting(false);
    setIsPaused(false);
    setNumDigits(parseInt(value) || 0);
    setErrorType({ negative: parseInt(value) < 0, tooLong: parseInt(value) > 1000 });
  };
  //--------------------------------------------------------------
  const changeSeqSearch = (value) => {
    dispatch(searchPi(-1));
    setResultSeq(null);
    setSeqSearch(value);
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
            gap: "9%",
            flexDirection: "row",
            width: "100%",
          }}
        >
          {/* ----- Number of Digits ----- */}
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

          {/* ----- Hightlight Digit ----- */}
          <Flex
            id="highlight box"
            sx={{
              justifyContent: "space-between",
              flexDirection: "column",
              alignItems: "center",
              height: "280px",
              width: "15%",
              background: "whitesmoke",
              borderRadius: "30px",
              border: "solid",
              mt: "50px",
              py: "20px",
            }}
          >
            {/* --- Label --- */}
            <Text sx={{ color: "black" }}>
              <FormattedMessage id="lbl.highlight_digit" />
            </Text>

            {/* --- Buttons --- */}
            <Flex
              sx={{
                justifyContent: "space-around",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {Array(10)
                .fill(null)
                .map((v, i) => (
                  <MyButton
                    key={i}
                    bg="deepSkyBlue"
                    disabled={highlightDigit === i}
                    onClick={() => setHighlightDigit(i)}
                    sx={{ width: "24%", my: "2%", mx: "4%", height: "36px" }}
                  >
                    {" "}
                    {i}{" "}
                  </MyButton>
                ))}
              <MyButton
                key={11}
                bg="coral"
                disabled={highlightDigit === null}
                onClick={() => setHighlightDigit(null)}
                sx={{ width: "59%", m: "3%", height: "36px" }}
              >
                None
              </MyButton>
            </Flex>
          </Flex>

          {/* ----- Search Sequence ----- */}
          <Flex
            id="search box"
            sx={{
              justifyContent: "flex-start",
              flexDirection: "column",
              alignItems: "center",
              height: "280px",
              width: "15%",
              background: "whitesmoke",
              borderRadius: "30px",
              border: "solid",
              mt: "50px",
              py: "20px",
            }}
          >
            {/* --- Label --- */}
            <Text sx={{ color: "black" }}>
              <FormattedMessage id="lbl.search_sequence" />
            </Text>

            {/* --- Input --- */}
            <Flex
              sx={{
                width: "100%",
                justifyContent: "space-around",
                flexWrap: "wrap",
                alignItems: "center",
                my: "20px",
              }}
            >
              <Input
                sx={{
                  textAlign: "center",
                  width: "55%",
                  borderRadius: "10px",
                  borderWidth: "2px",
                  color: "black",
                }}
                value={seqSearch}
                onChange={(e) => {
                  changeSeqSearch(e.target.value.replace(/\D/g, ""));
                }}
              />
              <MyButton
                disabled={resulatSeq === seqSearch}
                onClick={handleSearch}
                bg="deepSkyBlue"
                sx={{ width: "35%", height: "36px" }}
              >
                <FormattedMessage id="lbl.search" />
              </MyButton>

              {/* --- Results --- */}
              <Flex
                sx={{
                  scrollBehavior: "smooth",
                  flexWrap: "wrap",
                  width: "100%",
                  my: "15px",
                  mx: "10px",
                  borderRadius:"5%",
                  overflowY: "scroll",
                  maxHeight:"145px"
                }}
              >
                {searchResults.split(",").map((v, i) => (v ?
                  <Text
                    sx={{
                      display: "flex",
                      alignItems: "center", 
                      justifyContent: "center", 
                      mx: "3px",
                      my:"2px",
                      height:"30px",
                      width:"40px",
                      fontSize: "16px",
                      color:"black",
                      bg: "lightGrey",
                      borderRadius:"25%",
                    }}
                  >
                    {v}
                  </Text> : <></>
                ))}
              </Flex>
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
          search={"" + highlightDigit}
        />
      </Flex>
      <Footer />
    </Flex>
  );
};
//================================================================================
//Export Pi component
export default Pi;
