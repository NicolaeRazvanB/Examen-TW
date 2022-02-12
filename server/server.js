// Express Initialisation
const express = require("express");
const app = express();
// Sequelize Initialisation
const sequelize = require("./sequelize");
const { Op } = require("sequelize");

// Import created models
const Founder = require("./models/founder");
const Company = require("./models/company");

// Define entities relationship
Company.hasMany(Founder);

// Middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use((error, request, response, next) => {
  console.error(`[ERROR]: ${error}`);
  response.status(500).json(error);
});

// Kickstart the Express aplication
app.listen(7777, async () => {
  console.log("server started");
  try {
    await sequelize.authenticate();
    console.log("connected to db on port 7777");
  } catch {
    console.log("unable to connect to db");
  }
});

app.put("/", async (request, response, next) => {
  try {
    await sequelize.sync({ force: true });
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// Parent entity requests

// GET SORTED,FILTERED, PAGINATED PARENTS
app.get("/api/companies", async (request, response, next) => {
  const searcher = {};
  const { nm, dte, sv, st, pg } = request.query;
  if (nm && dte) {
    searcher.name = { [Op.is]: nm };
    searcher.deadline = { [Op.gt]: dte };
  }

  if (nm) {
    searcher.name = { [Op.is]: nm };
  }

  if (dte) {
    searcher.deadline = { [Op.gt]: dte };
  }

  if (st === "ASC")
    try {
      const companies = await Company.findAndCountAll({
        limit: 5,
        where: searcher,
        order: sv ? [[sv, "ASC"]] : undefined,
        offset: pg * 5,
      });
      if (companies.rows.length > 0) {
        response.json(companies);
      } else {
        response.sendStatus(204);
      }
    } catch (error) {
      next(error);
    }
  else
    try {
      const companies = await Company.findAndCountAll({
        limit: 5,
        where: searcher,
        order: sv ? [[sv, "DESC"]] : undefined,
        offset: pg * 5,
      });
      if (companies.rows.length > 0) {
        response.json(companies);
      } else {
        response.sendStatus(204);
      }
    } catch (error) {
      next(error);
    }
});

//POST PARENT
app.post("/api/companies", async (request, response, next) => {
  try {
    const company = await Company.create(request.body);
    response.status(201).location(company.id).send();
  } catch (error) {
    next(error);
  }
});

// GET ALL PARENT ENTITIES
app.get("/api/companiesCollection", async (request, response, next) => {
  try {
    const companies = await Company.findAll();
    if (companies.length > 0) {
      response.json(companies);
    } else {
      response.sendStatus(204);
    }
  } catch (error) {
    next(error);
  }
});

//GET PARENT ENTITY BY ID
app.get("/api/companies/:companyId", async (request, response, next) => {
  try {
    const company = await Company.findByPk(request.params.companyId);
    if (company) {
      response.json(company);
    } else {
      response.sendStatus(404);
    }
  } catch (error) {
    next(error);
  }
});

//PUT PARENT ENTITY
app.put("/api/companies/:companyId", async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.companyId);
    if (company) {
      await company.update(req.body);
      res.status(200).json({ message: "Company updated" });
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    next(error);
  }
});

//DELETE PARENT ENTITY
app.delete("/api/companies/:companyId", async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.companyId);
    if (company) {
      await company.destroy();
      res.status(200).json({ message: "Company deleted" });
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    next(error);
  }
});

// Child entity requests

//POST CHILD TO PARENT
app.post(
  "/api/companies/:companyId/founders",
  async (request, response, next) => {
    try {
      const company = await Company.findByPk(request.params.companyId);
      if (company) {
        const founder = await Founder.create(request.body);
        company.addFounder(founder);
        await company.save();
        response.status(201).location(founder.id).send();
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

//GET ALL CHILDREN OF PARENT
app.get(
  "/api/companies/:companyId/founders",
  async (request, response, next) => {
    try {
      const company = await Company.findByPk(request.params.companyId);
      if (company) {
        const founders = await company.getFounders();
        if (founders.length > 0) {
          response.json(founders);
        } else {
          response.sendStatus(204);
        }
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

//GET CHILD BY ID FROM PARENT BY ID
app.get("/api/companies/:companyId/founders/:founderId", async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.companyId);
    if (company) {
      const founders = await company.getFounders({
        where: {
          id: req.params.founderId,
        },
      });
      const founder = founders.shift();
      if (founder) {
        res.status(200).json(founder);
      } else {
        res.status(404).json({ message: "Founder not found" });
      }
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (err) {
    console.warn(err);
    res.status(500).json({ message: "Server error occured" });
  }
});

//PUT CHILD OF PARENT
app.put(
  "/api/companies/:companyId/founders/:founderId",
  async (req, res, next) => {
    try {
      const company = await Company.findByPk(req.params.companyId);
      if (company) {
        const founders = await company.getFounders({
          where: {
            id: req.params.founderId,
          },
        });
        const founder = founders.shift();
        if (founder) {
          await founder.update(req.body);
          res.status(200).json({
            message: "Founder of company updated",
          });
        } else {
          res.status(404).json({ message: "Founder not found" });
        }
      } else {
        res.status(404).json({ message: "Company not found" });
      }
    } catch (error) {
      next(error);
    }
  }
);

//DELETE CHILD OF PARENT
app.delete(
  "/api/companies/:companyId/founders/:founderId",
  async (req, res, next) => {
    try {
      const company = await Company.findByPk(req.params.companyId);
      if (company) {
        const founders = await company.getFounders({
          where: {
            id: req.params.founderId,
          },
        });
        const founder = founders.shift();
        if (founder) {
          await founder.destroy();
          res.status(200).json({
            message: "Founder deleted",
          });
        } else {
          res.status(404).json({ message: "Founder not found" });
        }
      } else {
        res.status(404).json({ message: "Company not found" });
      }
    } catch (error) {
      next(error);
    }
  }
);

//IMPORT
app.post("/api/import", async (request, response, next) => {
  try {
    const rg = {};
    for (let c of request.body) {
      const company = await Company.create(c);
      for (let f of c.founders) {
        const founder = await Founder.create(f);
        rg[f.key] = founder;
        company.addFounder(founder);
      }
      await company.save();
    }
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
