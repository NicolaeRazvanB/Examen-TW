import { React, useState, useEffect } from "react";
import axios from "axios";
import FounderCard from "./FounderCard";
import AddFounder from "./AddFounder";
const ViewFounders = ({ company }) => {
  const [founders, setFounders] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  useEffect(() => {
    const FetchData = async () => {
      try {
        const resp = await axios.get(
          "/api/companies/" + company.id + "/founders"
        );

        setFounders(resp.data);
      } catch (err) {
        console.error(err);
      }
    };
    FetchData();
  }, [founders]);

  return (
    <div>
      <button
        onClick={() => {
          if (isAdding === false) setIsAdding(true);
          else setIsAdding(false);
        }}
      >
        Add founder of company
      </button>
      {isAdding && <AddFounder company={company} />}
      {founders.length === 0 && (
        <h5>There are no founders added for this company</h5>
      )}
      {founders.length > 0 &&
        founders.map((founder) => (
          <div key={founder.id}>
            <FounderCard founder={founder} company={company} />
          </div>
        ))}
    </div>
  );
};

export default ViewFounders;
