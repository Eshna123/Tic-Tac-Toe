import React, { useState, useEffect, useCallback } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState("X");
  const [computerSymbol, setComputerSymbol] = useState("O");
  const [winner, setWinner] = useState(null);
  const [turn, setTurn] = useState("Player's Turn");

  const checkWinner = useCallback((board) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setTurn(`${board[a]} Wins!`);
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner("Draw");
      setTurn("It's a Draw!");
    }
  }, []);

  const makeComputerMove = useCallback(async (newBoard) => {
    setTurn("Computer's Turn...");
    try {
      const response = await fetch("https://hiring-react-assignment.vercel.app/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBoard),
      });
      const index = await response.json();
      if (typeof index === "number" && newBoard[index] === null) {
        newBoard[index] = computerSymbol;
        setBoard([...newBoard]);
        checkWinner(newBoard);
        setTurn("Player's Turn");
      }
    } catch (error) {
      console.error("Error fetching computer move:", error);
    }
  }, [computerSymbol, checkWinner]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    checkWinner(newBoard);
    setTurn("Computer's Turn...");
    setTimeout(() => makeComputerMove(newBoard), 500);
  };

  return (
    <div className="game-container">
      <h2 className="title">{turn}</h2>
      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${winner && winner !== "Draw" && [0,1,2,3,4,5,6,7,8].includes(index) ? "highlight" : ""}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;