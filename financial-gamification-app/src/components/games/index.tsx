import "./games.css";
import React from "react";
import { Outlet } from "react-router-dom";
import { MdLeaderboard } from "react-icons/md";
import { WhatsappIcon, WhatsappShareButton } from "react-share";

const Games = () => {
  return (
    <div className="games">
      <div className="actions">
        <a>
          <MdLeaderboard />
        </a>
        <WhatsappShareButton url="https://finlit.com">
          <WhatsappIcon />
        </WhatsappShareButton>
      </div>
      <Outlet />
    </div>
  );
};

export default Games;
