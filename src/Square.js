import React from "react";

const Square = React.memo(({ value, onClick }) => (
  <button className="square" onClick={onClick} disabled={!!value}>
    {value}
  </button>
));

export default Square;