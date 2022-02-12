import { React, useState } from "react";
import axios from "axios";
const EditFounder = ({ founder, company }) => {
  const [editedFounder, setEditedFounder] = useState(founder);
  const [isSaved, setIsSaved] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(
        "/api/companies/" + company.id + "/founders/" + founder.id,
        editedFounder
      )
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error.response);
      });
    setIsSaved(true);
  };
  if (isSaved === false)
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
                defaultValue={founder.name}
                onChange={(e) => (editedFounder.name = e.target.value)}
              />
              <br></br>

              <label>Role</label>
              <input
                type="text"
                name="role"
                placeholder="Founder role"
                defaultValue={founder.role}
                onChange={(e) => (editedFounder.email = e.target.value)}
              />
            </div>
          </div>
          <input type="submit" value="Save changes to founder" />
        </form>
      </div>
    );
  else return <h1>Changes saved succesfully</h1>;
};

export default EditFounder;
