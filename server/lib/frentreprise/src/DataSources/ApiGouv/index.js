import DataSource from "../DataSource";
import EtablissementsAPI from "./EtablissementsAPI";
import EntreprisesAPI from "./EntreprisesAPI";
import axios from "../../../lib/axios";

const _ = {
  axios: Symbol("_axios"),
  requestAPIs: Symbol("_requestAPIs")
};

export default class ApiGouv extends DataSource {
  constructor(baseURL, axiosConfig = {}) {
    super();
    this.token = null;
    this[_.axios] = axios.create({
      baseURL: baseURL,
      timeout: 30000
    });
    this.axiosConfig = axiosConfig;
  }

  // Etablissements
  async getSIRET(SIRET) {
    return await this[_.requestAPIs](
      SIRET,
      EtablissementsAPI.getLegacy,
      EtablissementsAPI.getEtablissement,
      EtablissementsAPI.agefiph,
      EtablissementsAPI.exercices,
      EtablissementsAPI.association,
      EtablissementsAPI.predecesseur,
      EtablissementsAPI.successeur,
      EtablissementsAPI.document_association
    );
  }

  // Entreprises
  async getSIREN(SIREN) {
    return await this[_.requestAPIs](
      SIREN,
      EntreprisesAPI.getLegacy,
      EntreprisesAPI.getEntreprise,
      EntreprisesAPI.attestation_acoss,
      EntreprisesAPI.attestation_dgfip
    );
  }

  async search() {
    return false;
  }

  async [_.requestAPIs](identifier, ...apiCalls) {
    let out = {};

    const requests = (Array.isArray(apiCalls) ? apiCalls : [apiCalls])
      .filter(fn => typeof fn === "function")
      .map(fn => {
        return fn(identifier, this[_.axios], {
          ...this.axiosConfig,
          params: {
            token: this.token,
            context: "Tiers",
            recipient: "Direccte Occitanie",
            object: "FCEE - Direccte Occitanie"
          }
        });
      });

    await Promise.all(requests).then(results => {
      Object.assign(out, ...results);
    });

    return out;
  }
}
