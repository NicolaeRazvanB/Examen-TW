import { React, useState } from "react";
import axios from "axios";
import EditFounder from "./EditFounder";

const FounderCard = ({ founder, company }) => {
  const [isClicked, setIsClicked] = useState(false);
  const deleteFounder = () => {
    axios.delete("/api/companies/" + company.id + "/founders/" + founder.id);
  };
  return (
    <div>
      <div>
        <div
          onClick={() => {
            if (isClicked === true) setIsClicked(false);
            else setIsClicked(true);
          }}
        >
          <h5>Founder name</h5>
          <h5>{founder.name}</h5>
          <h5>Founder role</h5>
          <h5>{founder.role}</h5>
        </div>
        <button onClick={deleteFounder}>Delete Founder</button>
      </div>
      <div>
        <button
          onClick={() => {
            if (isClicked === true) setIsClicked(false);
            else setIsClicked(true);
          }}
        >
          Edit Founder Information
        </button>
        {isClicked && <EditFounder founder={founder} company={company} />}
      </div>
    </div>
  );
};

export default FounderCard;
