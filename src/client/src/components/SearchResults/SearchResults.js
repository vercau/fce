import React from "react";
import PropTypes from "prop-types";
import { Alert } from "reactstrap";
import { withRouter } from "react-router-dom";
import Config from "../../services/Config";
import { isActiveEstablishment } from "../../helpers/Search";
import { joinNoFalsy } from "../../helpers/utils";
import Value from "../shared/Value";
import GenerateXlxs from "./Xlsx/GenerateXlsx";
import SearchAwesomeTable from "../SearchAwesomeTable";
import TableCellState from "../SearchAwesomeTable/TableCellState";
import Button from "../shared/Button";
import { faFileExcel } from "@fortawesome/pro-solid-svg-icons";

import "./searchResults.scss";

const SearchResults = ({ results, pagination, isLoading }) => {
  const staffSizeRanges = {
    ...Config.get("inseeSizeRanges"),
    "0 salarié": "0 salarié"
  };

  function generateXlxs() {
    if (results && results.length) {
      return new GenerateXlxs(pagination).download();
    }
  }

  return (
    <div className="app-searchResults mx-6">
      {pagination.items > 0 && (
        <div className="columns">
          <div className="column is-8 is-offset-2">
            <h2 className="title my-2">
              {pagination.items} établissement
              {pagination.items > 1 && "s"} trouvé
              {pagination.items > 1 && "s"}
            </h2>
          </div>
          <div className="column is-2 export-button">
            <Button
              value="Export Excel"
              buttonClasses={["is-grey"]}
              icon={faFileExcel}
              callback={generateXlxs}
            />
          </div>
        </div>
      )}

      <div className="columns result-row">
        <div className="column is-12">
          {results.length === 0 && <Alert color="info">Aucun résultat</Alert>}

          {!!results.length ? (
            <div>
              <SearchAwesomeTable
                showPagination={pagination && pagination.pages > 1}
                pagination={{ ...pagination, min: 1 }}
                prevText="Précédent"
                nextText="Suivant"
                isLoading={isLoading}
                data={results}
                fields={[
                  {
                    headName: "SIRET",
                    importantHead: true,
                    accessor: ({ siret: { raw: siret } }) =>
                      Value({
                        value: siret,
                        link: `/establishment/${siret}`
                      }),
                    link: ({ siret: { raw: siret } }) =>
                      `/establishment/${siret}`
                  },
                  {
                    headName: "État",
                    accessor: ({
                      siret: { raw: siret },
                      etatadministratifetablissement: { raw: etat }
                    }) => TableCellState({ siret, etat })
                  },
                  {
                    headName: "Raison sociale / Nom",
                    html: true,
                    accessor: ({
                      enterprise_name: { raw: enterpriseName },
                      enseigne1etablissement: { raw: enseigne }
                    }) => {
                      let name = `<div>${enterpriseName}</div>`;

                      if (enseigne) {
                        name += `<div>(Enseigne : ${enseigne})</div>`;
                      }

                      return Value({
                        value: name
                      });
                    }
                  },
                  {
                    headName: "Catégorie établissement",
                    accessor: ({ etablissementsiege }) => {
                      const isSiege = etablissementsiege.raw === "true";
                      return Value({
                        value: isSiege ? "Siège social" : "Établissement"
                      });
                    }
                  },
                  {
                    headName: "Code postal",
                    accessor: ({
                      codepostaletablissement: { raw: postalCode },
                      libellecommuneetablissement: { raw: town }
                    }) =>
                      Value({
                        value: joinNoFalsy([postalCode, town], " - ")
                      })
                  },
                  {
                    headName: "Effectif",
                    accessor: ({
                      trancheeffectifsetablissement: {
                        raw: trancheEffectifInsee
                      },
                      etatadministratifetablissement: { raw: etat },
                      ...etablissement
                    }) =>
                      Value({
                        value: isActiveEstablishment(etat)
                          ? staffSizeRanges[trancheEffectifInsee]
                          : "0 salarié"
                      })
                  },
                  {
                    headName: "Activité",
                    accessor: ({
                      activiteprincipaleetablissement: { raw: naf },
                      activiteprincipaleetablissement_libelle: {
                        raw: libelle_naf
                      }
                    }) =>
                      naf &&
                      Value({
                        value: `${naf === null ? "" : naf} ${
                          libelle_naf === null ? "" : " - " + libelle_naf
                        }`
                      })
                  }
                ]}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

SearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default withRouter(SearchResults);
