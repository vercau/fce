require("dotenv").config();
const process = require("process");

const config = {
  client: {
    baseUrl: process.env.CLIENT_BASE_URL,
    magicLink: "/magic-link/{key}/browser/{browser}"
  },
  APIGouv: {
    token: process.env.API_GOUV_TOKEN
  },
  SireneAPI: {
    enable: false,
    basicAuth: process.env.API_SIRENE_BASIC_AUTH,
    pagination: {
      itemsByPage: 15
    }
  },
  db: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB
  },
  mail: JSON.parse(process.env.MAIL),
  proxy: false,
  apiTimeout: 10000,
  magicKey: {
    allowedEmails: JSON.parse(process.env.MAGIC_KEY_ALLOWED_EMAILS).map(
      mask => new RegExp(mask)
    ),
    privateKey: process.env.MAGIC_KEY_PRIVATE_KEY,
    clientVerification: true,
    expire: process.env.MAGIC_KEY_EXPIRE
  },
  magicLink: {
    bcc: process.env.MAGIC_LINK_BCC
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE
  },
  elasticIndexer: {
    appsearch_address: process.env.JWT_APPSEARCH_ADDRRESS,
    appsearch_apiKey: process.env.JWT_APPSEARCH_API_KEY,
    appsearch_engineName: process.env.JWT_APPSEARCH_ENGINE_NAME,
    appsearch_concurencyLimit: 2,
    appsearch_pageLimit: 1000,
    client_address: process.env.JWT_ELASTIC_CLIENT_ADDRESS,
    cursor_size: 100000,
    enterpriseFields: [
      "denominationunitelegale",
      "nomunitelegale",
      "nomusageunitelegale",
      "prenomusuelunitelegale",
      "prenom1unitelegale",
      "siren",
      "categoriejuridiqueunitelegale",
      "denominationusuelle1unitelegale",
      "denominationusuelle2unitelegale",
      "denominationusuelle3unitelegale"
    ],
    appSearchConst: {
      physicPersonJuridicCode: "1000"
    }
  },
  xlsxExport: {
    establishmentState: {
      A: "Actif",
      F: "Fermé"
    },
    inseeSizeRanges: {
      NN: "Unité non employeuse",
      "0 salarié": "0 salarié (pas d'effectif au 31/12 )",
      "01": "1 ou 2 salariés",
      "02": "3 à 5 salariés",
      "03": "6 à 9 salariés",
      "11": "10 à 19 salariés",
      "12": "20 à 49 salariés",
      "21": "50 à 99 salariés",
      "22": "100 à 199 salariés",
      "31": "200 à 249 salariés",
      "32": "250 à 499 salariés",
      "41": "500 à 999 salariés",
      "42": "1 000 à 1 999 salariés",
      "51": "2 000 à 4 999 salariés",
      "52": "5 000 à 9 999 salariés",
      "53": "10 000 salariés et plus"
    }
  },
  sanitizeTables: [
    {
      fields: ["siret", "numero_de_dossier"],
      table: "etablissements_pse",
      hasId: false
    },
    {
      fields: ["code"],
      table: "departements",
      hasId: false
    },
    {
      fields: ["nom", "code_postal"],
      table: "communes",
      hasId: false
    },
    {
      fields: ["siret", "date_visite"],
      table: "interactions_pole_3e",
      hasId: false
    }
  ]
};

if (process.env.HOST) {
  config.host = process.env.HOST;
}

if (process.env.PORT) {
  config.port = process.env.PORT;
}

module.exports = config;
