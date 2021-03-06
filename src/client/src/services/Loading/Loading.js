import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/pro-solid-svg-icons";

export default function withLoading(BaseComponent) {
  return function({ isLoaded, ...props }) {
    return isLoaded ? (
      <BaseComponent {...props} />
    ) : (
      <div className="text-center">
        <FontAwesomeIcon icon={faSpinner} spin /> Chargement en cours...
      </div>
    );
  };
}
