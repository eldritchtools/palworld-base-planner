import { useState } from "react";

function FeedbackButton({ style, onClick, text, feedbackText }) {
  const [display, setDisplay] = useState(text);

  const handleClick = async (e) => {
    setDisplay(feedbackText);
    setTimeout(() => setDisplay(text), 1000);
    if (onClick) onClick(e);
  };

  return <button style={style} onClick={handleClick}>{display}</button>;
}

export default FeedbackButton;