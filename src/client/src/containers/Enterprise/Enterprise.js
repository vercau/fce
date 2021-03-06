import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import {
  loadEstablishment,
  loadEntreprise
} from "../../services/Store/actions";
import {
  Establishment as EstablishmentView,
  Enterprise as EnterpriseView
} from "../../components/DataSheets";

class Enterprise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: null,
      isEnterprise: null,
      enterprise: null,
      headOffice: null,
      establishment: null,
      establishments: null,
      isLoaded: false,
      redirectTo: false
    };
  }

  componentDidMount() {
    this.mountComponent();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match && prevProps.match.url) {
      if (this.props.match.url !== prevProps.match.url) {
        this.mountComponent();
      }
    }
  }

  mountComponent() {
    this.setState(
      {
        isEnterprise: this.props.match.params.hasOwnProperty("siren"),
        isLoaded: false
      },
      () => {
        if (!this.loadEntityByStore()) {
          this.loadEntityByApi();
        }
      }
    );
  }

  loadEntityByStore = () => {
    if (this.state.isEnterprise) {
      return this.loadEnterpriseByStore(this.props.match.params.siren);
    }
    return this.loadEstablishmentByStore(this.props.match.params.siret);
  };

  loadEstablishmentByStore = siret => {
    let establishment = null;

    if (
      this.props.currentEnterprise &&
      this.props.currentEnterprise.etablissements
    ) {
      establishment = this.props.currentEnterprise.etablissements.find(
        establishment => {
          return (
            establishment.siret.trim() === siret.trim() &&
            establishment._dataSources !== null
          );
        }
      );

      if (establishment) {
        return this.initData(this.props.currentEnterprise, establishment);
      }
    }

    return false;
  };

  loadEnterpriseByStore = siren => {
    if (
      this.props.currentEnterprise &&
      this.props.currentEnterprise.siren === siren
    ) {
      return this.initData(this.props.currentEnterprise, null);
    }

    return false;
  };

  loadEntityByApi = () => {
    if (this.state.isEnterprise) {
      return this.loadEnterpriseByApi(this.props.match.params.siren);
    }
    return this.loadEstablishmentByApi(this.props.match.params.siret);
  };

  loadEstablishmentByApi = siret => {
    this.props
      .loadEstablishment(siret)
      .then(response => {
        const { query, results } = response.data;

        const establishment =
          results.length &&
          results[0].etablissements.find(establishment => {
            return (
              establishment.siret.trim() === siret.trim() &&
              establishment._success
            );
          });

        if (query.isSIRET && establishment) {
          this.loadEstablishmentByStore(siret);
        } else {
          this.setState({
            redirectTo: "/404"
          });
        }
      })
      .catch(
        function(error) {
          this.setState({
            redirectTo: "/404"
          });
        }.bind(this)
      );
  };

  loadEnterpriseByApi = siren => {
    this.props
      .loadEntreprise(siren)
      .then(response => {
        const { query, results } = response.data;

        if (query.isSIREN && results.length && results[0]._success) {
          this.loadEnterpriseByStore(siren);
        } else {
          this.setState({
            redirectTo: "/404"
          });
        }
      })
      .catch(
        function(error) {
          this.setState({
            redirectTo: "/404"
          });
        }.bind(this)
      );
  };

  initData = (enterprise, establishment) => {
    const headOffice =
      enterprise.etablissements.find(establishment => {
        return establishment.siret === enterprise.siret_siege_social;
      }) ||
      enterprise.etablissements.find(establishment => {
        return establishment.siege_social === true;
      });

    const establishments = enterprise.etablissements;

    this.setState({
      enterprise,
      headOffice: headOffice || {},
      establishment,
      establishments,
      isLoaded: true
    });

    return true;
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect push to={this.state.redirectTo} />;
    }

    return this.state.isEnterprise ? (
      <EnterpriseView
        enterprise={this.state.enterprise}
        headOffice={this.state.headOffice}
        establishments={this.state.establishments}
        hasSearchResults={this.props.hasSearchResults}
        isLoaded={this.state.isLoaded}
        history={this.props.history}
      />
    ) : (
      <EstablishmentView
        enterprise={this.state.enterprise}
        headOffice={this.state.headOffice}
        establishment={this.state.establishment}
        establishments={this.state.establishments}
        hasSearchResults={this.props.hasSearchResults}
        isLoaded={this.state.isLoaded}
        history={this.props.history}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    currentEnterprise: state.enterprise.current,
    hasSearchResults: state.search.results && state.search.results.length
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadEstablishment: siret => {
      return dispatch(loadEstablishment(siret));
    },
    loadEntreprise: siren => {
      return dispatch(loadEntreprise(siren));
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Enterprise)
);
