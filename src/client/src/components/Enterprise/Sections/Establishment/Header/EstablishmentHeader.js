import React from "react";
import Value from "../../../../shared/Value";
import Dashboard from "../Dashboard";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import {
  faArrowAltRight,
  faSquare,
  faCircle
} from "@fortawesome/fontawesome-pro-solid";
import { isActiveEstablishment } from "../../../../../helpers/Establishment";
import InfoBox from "../../../../shared/InfoBox";
import "./establishmentHeader.scss";

class EstablishmentHeader extends React.Component {
  render() {
    const { enterprise, establishment } = this.props;
    const adrComponents = establishment.adresse_components;
    const slugSocieteCom = enterprise.raison_sociale
      ? enterprise.raison_sociale.toLowerCase().replace(" ", "-")
      : "#";
    const isActive = isActiveEstablishment(establishment);
    const stateClass = isActive ? "icon--success" : "icon--danger";

    return (
      <section id="header" className="establishment-header w-100">
        <div className="has-text-link show-all-enterprise">
          <div
            className="responsive-item"
            data-show="quickview"
            data-target="enterprise"
          >
            <span>Voir les établissements</span>
            <span className="icon">
              <FontAwesomeIcon icon={faArrowAltRight} />
            </span>
          </div>
        </div>
        <h1 className="columns mb-4 is-capitalized has-text-weight-bold is-size-3">
          <Value
            value={
              establishment.nom_commercial.toLowerCase() ||
              `${establishment.nom.toLowerCase() ||
                ""} ${establishment.prenom.toLowerCase() || ""}`.trim() ||
              null
            }
            empty=" "
          />
        </h1>
        <div className="columns">
          <InfoBox
            value={establishment.categorie_etablissement}
            infoBoxClasses={[
              "has-text-weight-bold",
              "has-text-roboto",
              "is-size-6"
            ]}
          />
        </div>
        <div className="columns is-vcentered w-100">
          <div className="column is-4">
            <span className="is-size-6 has-text-roboto has-text-weight-semibold has-text-grey-dark">
              SIRET :{" "}
            </span>
            <span className="is-size-6 has-text-roboto has-text-weight-semibold has-text-grey-dark">
              <Value value={establishment.siret} empty="" />
            </span>
          </div>
          <div className="column is-8">
            <span className="is-size-6 has-text-segoe is-capitalized has-text-grey-dark">
              <Value value={adrComponents.numero_voie} empty="" />
              {adrComponents.numero_voie && " "}
              <Value value={adrComponents.indice_repetition} empty="" />
              {adrComponents.indice_repetition && " "}
              <Value
                value={
                  adrComponents.type_voie &&
                  adrComponents.type_voie.toLowerCase()
                }
                empty="-"
              />
              {adrComponents.type_voie && " "}
              <Value
                value={
                  adrComponents.nom_voie && adrComponents.nom_voie.toLowerCase()
                }
                empty="-"
              />
              {" - "}
            </span>
            <span className="is-size-6 is-capitalized has-text-segoe has-text-grey-dark">
              <Value value={adrComponents.code_postal} empty="-" />{" "}
              <Value
                value={
                  adrComponents.localite && adrComponents.localite.toLowerCase()
                }
                empty="-"
              />
            </span>
          </div>
        </div>
        <div className="columns is-vcentered w-100">
          <div className="column is-4">
            <span className="active-item-value">
              <FontAwesomeIcon
                icon={isActive ? faCircle : faSquare}
                className={`mr-2 ${stateClass}`}
              />
            </span>
            <span className="is-size-6 has-text-segoe has-text-grey-dark">
              {isActive ? "Ouvert depuis le " : "Fermé depuis le "}
            </span>
            <span className="is-size-6 has-text-segoe has-text-grey-dark">
              <Value
                value={
                  isActive
                    ? establishment.date_creation
                    : establishment.date_fin ||
                      establishment.date_dernier_traitement_etablissement
                }
                empty="-"
              />
            </span>
          </div>
          <div className="column is-8">
            <span className="is-size-6 has-text-segoe has-text-weight-semibold has-text-grey-dark">
              <Value value={establishment.naf} empty="-" />{" "}
              <Value
                value={
                  establishment.libelle_naf &&
                  establishment.libelle_naf.toLowerCase()
                }
                empty="-"
              />
            </span>
          </div>
        </div>
        <Dashboard establishment={establishment} />
      </section>
    );
  }
}

export default EstablishmentHeader;
