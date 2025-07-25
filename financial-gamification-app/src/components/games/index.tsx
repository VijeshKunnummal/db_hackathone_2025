import "./games.css";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { MdLeaderboard } from "react-icons/md";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import LeadershipBoard from "./leadershipboard";

const Games = () => {
  const [openLeaderboard, setOpenLeaderBoard] = useState(false);
  const toggleOpen = () => {
    setOpenLeaderBoard((prev) => !prev);
  };
  return (
    <div className="games">
      <div className="actions">
        <a onClick={toggleOpen}>
          <MdLeaderboard />
        </a>
        <WhatsappShareButton url="https://finlit.com">
          <WhatsappIcon />
        </WhatsappShareButton>
      </div>
      <Outlet />
      <LeadershipBoard open={openLeaderboard} onClose={toggleOpen} />
    </div>
  );
};

export default Games;
