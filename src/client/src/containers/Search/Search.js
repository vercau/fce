import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import SearchView from "../../components/Search";
import { search, setCurrentEnterprise } from "../../services/Store/actions";
import Http from "../../services/Http";
import Config from "../../services/Config";
import SearchResults from "../../containers/SearchResults";

class Search extends Component {
  constructor(props) {
    super(props);
    console.log(props.prevTerms);
    this.state = {
      terms: {
        q: "",
        siegeSocial: false,
        naf: null,
        commune: null
      },
      hasError: false,
      loading: false,
      redirectTo: false,
      showResults: false
    };
  }

  componentDidMount() {
    const { q, siegeSocial, naf, commune } = this.props.prevTerms;
    if (!this.checkPreviousTerms(this.props.prevTerms)) {
      this.setState({
        terms: { q, siegeSocial, naf, commune }
      });
    }
  }

  checkPreviousTerms = terms => {
    let empty = false;
    Object.values(terms).map(t => {
      empty = t === null ? true : false;
    });

    return empty;
  };

  updateForm = evt => {
    const { name, value, type, checked } = evt.target;
    let terms = { ...this.state.terms };
    terms[name] = type === "checkbox" ? checked : value;

    this.setState({
      terms: terms
    });
  };

  updateFormSelect = (name, element) => {
    let terms = { ...this.state.terms };
    terms[name] = element && element.value;

    this.setState({
      terms: terms
    });
  };

  loadNaf = term => {
    if (term.length < Config.get("advancedSearch").minTerms) {
      return new Promise(resolve => {
        resolve([]);
      });
    }

    return Http.get("/naf", {
      params: {
        q: term
      }
    })
      .then(response => {
        if (response.data && response.data.results) {
          return Promise.resolve(
            response.data.results.map(naf => {
              return {
                label: naf.libelle,
                value: naf.code
              };
            })
          );
        }
        return Promise.reject([]);
      })
      .catch(function(error) {
        console.error(error);
        return Promise.reject([]);
      });
  };

  loadCommunes = term => {
    if (term.length < Config.get("advancedSearch").minTerms) {
      return new Promise(resolve => {
        resolve([]);
      });
    }

    return Http.get("/communes", {
      params: {
        q: term
      }
    })
      .then(response => {
        if (response.data && response.data.results) {
          return Promise.resolve(
            response.data.results.map(commune => {
              return {
                label: `${commune.nom} (${commune.code_postal})`,
                value: commune.code_insee
              };
            })
          );
        }
        return Promise.reject([]);
      })
      .catch(function(error) {
        console.error(error);
        return Promise.reject([]);
      });
  };

  search = evt => {
    evt && evt.preventDefault();
    this.setState({ hasError: false, loading: true });

    this.props
      .search(this.state.terms)
      .then(response => {
        const { query, results } = response.data;
        let redirectTo = false;
        let showResults = false;

        if (query.isSIRET && results) {
          redirectTo = `/establishment/${query.terms.q}`;
          this.props.setCurrentEnterprise(results[0]);
        } else if (query.isSIREN && results) {
          redirectTo = `/enterprise/${query.terms.q}`;
          this.props.setCurrentEnterprise(results[0]);
        } else if (results && results.length === 1) {
          redirectTo = `/establishment/${results[0].etablissements[0].siret}`;
        } else {
          showResults = true;
        }

        this.setState({
          hasError: false,
          loading: false,
          redirectTo,
          showResults
        });
      })
      .catch(
        function(error) {
          this.setState({
            hasError: true,
            loading: false
          });
        }.bind(this)
      );
  };

  render() {
    if (this.state.redirectTo) {
      return <Redirect push to={this.state.redirectTo} />;
    }

    return (
      <>
        <SearchView
          terms={this.state.terms}
          search={this.search}
          updateForm={this.updateForm}
          updateFormSelect={this.updateFormSelect}
          loading={this.state.loading}
          hasError={this.state.hasError}
          loadNaf={this.loadNaf}
          loadCommunes={this.loadCommunes}
        />
        {this.state.showResults ? <SearchResults /> : null}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    prevTerms: state.search.terms
  };
};

const mapDispatchToProps = dispatch => {
  return {
    search: term => {
      return dispatch(search(term));
    },
    setCurrentEnterprise: enterprise => {
      return dispatch(setCurrentEnterprise(enterprise));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
