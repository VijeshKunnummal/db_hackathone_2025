import "./index.css";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";
import classnames from "classnames";
import { useScore } from "../../../contexts/ScoreProvider";

interface LeadershipBoardProps {
  open: boolean;
  onClose: () => void;
}

const LeadershipBoard = ({ open, onClose }: LeadershipBoardProps) => {
  const { score } = useScore();
  const [readyToRender, setReadyToRender] = useState(false);

  useEffect(() => {
    setReadyToRender(true);
  }, []);
  return readyToRender
    ? ReactDOM.createPortal(
        <div className={classnames("leadershipboard", { open })}>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Smith</td>
                <td>5630</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Joe</td>
                <td>4910</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Tasha</td>
                <td>3790</td>
              </tr>
            </tbody>
          </table>

          <div className="remark">You are here: 3!</div>
        </div>,
        document.querySelector(".app")!,
      )
    : null;
};

export default LeadershipBoard;
