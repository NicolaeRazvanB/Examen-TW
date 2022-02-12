import "./App.css";
import { React, useState, useEffect } from "react";
import axios from "axios";
import Company from "./components/Company";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState({});
  const [count, setCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageMax, setPageMax] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addCompany, setAddCompany] = useState({
    name: "",
    foundingdate: "",
  });
  const [filterParams, setFilterParams] = useState({
    sortParameter: "name",
    sortType: "ASC",
    name: "none",
    foundingdate: "none",
  });

  useEffect(() => {
    const PathBuilder = () => {
      let path = "/api/companies?";
      if (filterParams.name !== "none") path += "nm=" + filterParams.name;

      if (filterParams.name === "none" && filterParams.foundingdate !== "none")
        path += "dte=" + filterParams.foundingdate;
      else if (filterParams.foundingdate !== "none")
        path += "&dte=" + filterParams.foundingdate;

      if (filterParams.foundingdate === "none")
        path += "sv=" + filterParams.sortParameter;
      else path += "&sv=" + filterParams.sortParameter;

      path += "&st=" + filterParams.sortType;
      path += "&pg=" + (pageNumber - 1);
      return path;
    };

    const FetchData = async () => {
      try {
        const resp = await axios.get(PathBuilder());
        setCompanies(resp.data.rows);
        setCount(resp.data.count);
        setIsLoading(false);
        setPageMax(Math.ceil(count / 5));
      } catch (err) {
        console.log(err);
      }
    };
    FetchData();
  }, [companies, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/companies", addCompany)
      .then((response) => {
        console.log(response.status);
      })
      .catch((error) => {
        console.log(error.response);
      });
    setIsLoading(true);
    e.target.reset();
  };

  if (companies === undefined) {
    console.log(companies);
    return (
      <div>
        <button
          onClick={() => {
            if (isAdding === false) setIsAdding(true);
            else setIsAdding(false);
          }}
        >
          Add a company
        </button>
        {isAdding && (
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <div>
                  <label>Company name</label>
                  <input
                    type="text"
                    name="company"
                    placeholder="name of your company"
                    onChange={(e) => (addCompany.name = e.target.value)}
                  />
                  <label>Founding date of company</label>
                  <input
                    type="date"
                    name="foundingdate"
                    onChange={(e) => (addCompany.foundingdate = e.target.value)}
                  />
                </div>
              </div>
              <input type="submit" value="Save company" />
            </form>
          </div>
        )}
      </div>
    );
  }

  if (companies !== undefined)
    return (
      <div>
        <div>
          <button
            onClick={() => {
              if (isAdding === false) setIsAdding(true);
              else setIsAdding(false);
            }}
          >
            Add a company
          </button>
          {isAdding && (
            <div>
              <form onSubmit={handleSubmit}>
                <div>
                  <div>
                    <label>Company name</label>
                    <input
                      type="text"
                      name="company"
                      placeholder="name of your company"
                      onChange={(e) => (addCompany.name = e.target.value)}
                    />
                    <label>Founding date of company</label>
                    <input
                      type="date"
                      name="foundingdate"
                      onChange={(e) =>
                        (addCompany.foundingdate = e.target.value)
                      }
                    />
                  </div>
                </div>
                <input type="submit" value="Save company" />
              </form>
            </div>
          )}
          <label> Sort by: </label>
          <select
            onChange={(e) => (filterParams.sortParameter = e.target.value)}
          >
            <option value="name">Company name</option>
            <option value="foundingdate">Date of founding</option>
          </select>
          <button
            onClick={() => {
              filterParams.sortType = "ASC";
            }}
          >
            ↑
          </button>
          <button
            onClick={() => {
              filterParams.sortType = "DESC";
            }}
          >
            ↓
          </button>
        </div>

        {isLoading === false && companies.length === 0 && (
          <h1>You currently haven't added any companies</h1>
        )}
        {!isLoading &&
          companies.length > 0 &&
          companies.map((item) => <Company key={item.id} company={item} />)}
        {!isLoading && (
          <div className="tableFooter">
            {pageNumber > 1 && (
              <button
                onClick={() => {
                  setPageNumber(pageNumber - 1);
                }}
              >
                ←
              </button>
            )}
            <h3>Page:{pageNumber}</h3>
            {pageNumber !== pageMax && (
              <button
                onClick={() => {
                  setPageNumber(pageNumber + 1);
                }}
              >
                →
              </button>
            )}
          </div>
        )}
        {isLoading && <h1>Retrieving data ...</h1>}
      </div>
    );
}

export default App;
