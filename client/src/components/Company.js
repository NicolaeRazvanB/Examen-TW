import { React, useState, useEffect } from "react";
import EditCompany from "./EditCompany";
import axios from "axios";
import ViewFounders from "./ViewFounders";
const Company = ({ company }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [seeChildren, setSeeChildren] = useState(false);
  const deleteCompany = () => {
    axios.delete("/api/companies/" + company.id);
  };
  return (
    <div>
      <h1>{company.name}</h1>
      <h1>{company.foundingdate.substring(0, 10)}</h1>
      <button
        onClick={() => {
          if (isClicked === true) setIsClicked(false);
          else setIsClicked(true);
        }}
      >
        Edit company information
      </button>
      {isClicked && <EditCompany company={company} />}

      <button onClick={deleteCompany}>Delete this company</button>

      <button
        onClick={() => {
          if (seeChildren === true) setSeeChildren(false);
          else setSeeChildren(true);
        }}
      >
        View Founders
      </button>
      {seeChildren && <ViewFounders company={company} />}
    </div>
  );
};

export default Company;
