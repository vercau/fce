import {
  SEARCH_RESULTS,
  SEARCH_TERMS,
  RESET_STORE,
  SEARCH_RESET,
  SEARCH_SET_TERM
} from "../constants/ActionTypes";
import addInteractions from "../utils/addInteractions";

const initialState = {
  results: [],
  pagination: {},
  terms: {
    siret: null,
    siren: null,
    q: null,
    naf: null,
    _nafSelect: null,
    commune: null,
    _communeSelect: null,
    siegeSocial: null
  }
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_RESULTS:
      return {
        ...state,
        results: flattenResults(action.results, state.terms),
        pagination: action.pagination
      };

    case SEARCH_TERMS:
      return {
        ...state,
        terms: { ...initialState.terms, ...action.terms }
      };

    case RESET_STORE:
      return {};

    case SEARCH_RESET:
      return { ...initialState };

    case SEARCH_SET_TERM:
      return {
        ...state,
        terms: { ...state.terms, ...{ [action.termKey]: action.termValue } }
      };

    default:
      return state;
  }
};

const flattenResults = (results, terms) => {
  if (!Array.isArray(results)) {
    return false;
  }

  const flattenResults = [];
  const interactionTerms = Array.isArray(terms.interactions)
    ? terms.interactions.map(interaction => interaction.value)
    : null;

  results.forEach(enterprise => {
    if (Array.isArray(enterprise.etablissements)) {
      enterprise.etablissements.forEach(establishment => {
        establishment = addInteractions(establishment, interactionTerms);
        flattenResults.push({ ...enterprise, etablissement: establishment });
      });
    }
  });

  return flattenResults;
};

export default search;
