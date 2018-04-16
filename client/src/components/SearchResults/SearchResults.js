import React from "react";
import "./searchResults.css";
import { Row, Col, Button, Alert } from "reactstrap";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import { faFileExcel, faPrint } from "@fortawesome/fontawesome-pro-light";
import Terms from "./Terms";
import Item from "./Item";

class SearchResults extends React.Component {
  render() {
    let items = Array.isArray(this.props.results)
      ? this.props.results.map((item, index) => (
          <Item item={item} key={index} />
        ))
      : [];

    return (
      <div className="app-searchResults">
        <Row className="justify-content-md-center">
          <Col xl="6" md="8">
            <h1 className="title">Résultats de recherche</h1>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col xl="6" md="8">
            <Terms terms={this.props.terms} />
          </Col>
        </Row>

        <Row className="justify-content-md-center d-print-none">
          <Col xl="6" md="12" className="text-center export-buttons">
            <Button color="primary" onClick={() => window.print()}>
              <FontAwesomeIcon icon={faPrint} /> Imprimer
            </Button>
            {this.props.terms.csvURL ? (
              <Button
                outline
                color="secondary"
                onClick={e => window.open(this.props.terms.csvURL, "_blank")}
              >
                <FontAwesomeIcon icon={faFileExcel} /> Export Excel
              </Button>
            ) : null}
          </Col>
        </Row>

        <Row className="justify-content-md-center result-row">
          <Col xl="6" md="8">
            {!Array.isArray(this.props.results) ? (
              <Alert color="danger">Une erreur est survenue</Alert>
            ) : !this.props.results.length ? (
              <Alert color="info">Aucun résultat</Alert>
            ) : (
              ""
            )}

            {items.length ? (
              <table className="table table-striped table-hover result-list">
                <thead>
                  <tr>
                    <th>SIRET</th>
                    <th>SIREN</th>
                    <th>Raison Sociale</th>
                    <th>Commune</th>
                    <th>Code Postal</th>
                    <th>Département</th>
                    <th>Activité</th>
                  </tr>
                </thead>
                <tbody>{items}</tbody>
              </table>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default SearchResults;