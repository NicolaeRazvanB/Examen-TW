import { React, useState } from "react";
import axios from "axios";
const AddFounder = ({ company }) => {
  const [founder, setFounder] = useState({
    name: "",
    role: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/api/companies/" + company.id + "/founders", founder)
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error.response);
      });
    e.target.reset();
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Founder name"
              onChange={(e) => (founder.name = e.target.value)}
            />
            <br></br>
            <label>Role</label>
            <input
              type="text"
              name="role"
              placeholder="Founder role"
              onChange={(e) => (founder.role = e.target.value)}
            />
          </div>
        </div>
        <input type="submit" value="Save Founder" />
      </form>
    </div>
  );
};

export default AddFounder;
