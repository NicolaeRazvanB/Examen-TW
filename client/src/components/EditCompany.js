import { React, useState } from "react";
import axios from "axios";

const EditCompany = ({ company }) => {
  const [editedCompany, setEditedCompany] = useState(company);
  const [isSaved, setIsSaved] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("/api/companies/" + company.id, editedCompany)
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
              <label>Company name</label>
              <input
                type="text"
                name="company"
                placeholder="name of your company"
                defaultValue={company.name}
                onChange={(e) => (editedCompany.name = e.target.value)}
              />
              <label>Founding date of company</label>
              <input
                type="date"
                name="foundingdate"
                defaultValue={company.foundingdate.substring(0, 10)}
                onChange={(e) => (editedCompany.foundingdate = e.target.value)}
              />
            </div>
          </div>
          <input className="save-button" type="submit" value="Save changes" />
        </form>
      </div>
    );
  else return <h1>Changes saved succesfully</h1>;
};

export default EditCompany;
