//import logo from './logo.svg';
// import './App.css';
// import TicTacToe from './pages/TicTacToe/TicTacToe';

// function App() {
//   return (
//     <div className="App">
//     <TicTacToe/>
//     </div>
//   );
// }

// export default App;


import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import Square from "./Square";

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerSymbol, setPlayerSymbol] = useState("X");
  const [botSymbol, setBotSymbol] = useState("O");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningSquares, setWinningSquares] = useState([]);
  
  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      fetchBotMove();
    }
  }, [isPlayerTurn, winner]);

  const checkWinner = useCallback((board) => {
    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        setWinningSquares([a, b, c]);
        return;
      }
    }
    if (!board.includes(null)) setWinner("Draw");
  }, []);

  const handlePlayerMove = (index) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    setIsPlayerTurn(false);
    checkWinner(newBoard);
  };

  const fetchBotMove = async () => {
    try {
      const response = await axios.post("https://hiring-react-assignment.vercel.app/api/bot", board);
      const botMove = response.data;
      
      const newBoard = [...board];
      newBoard[botMove] = botSymbol;
      setBoard(newBoard);
      setIsPlayerTurn(true);
      checkWinner(newBoard);
    } catch (error) {
      console.error("Error fetching bot move", error);
    }
  };

  return (
    <div className="container">
      <h1>Tic-Tac-Toe</h1>
      <div className="board">
        {board.map((value, index) => (
          <Square key={index} value={value} onClick={() => handlePlayerMove(index)} />
        ))}
      </div>
      {winner && <h2>{winner === "Draw" ? "It's a draw!" : `${winner} Wins!`}</h2>}
    </div>
  );
}

export default App;