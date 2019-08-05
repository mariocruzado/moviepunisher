import React from "react";
import { connect } from "react-redux";
import { IFilm } from "../interfaces";
import { IGlobalState } from "../reducers/global";
import FilmDetails from "./FilmDetails";
import FilmReviews from "./FilmReviews";
import { RouteComponentProps, Link } from "react-router-dom";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

interface IPropsGlobal {
  token: string;
}
const SingleFilm: React.FC<
  IPropsGlobal & RouteComponentProps<{ film_id: any }>
> = props => {
  return (
    <div
      css={css`
        margin-top: 20px;
      `}
      className="container"
    >
      <div
        css={css`
          margin-bottom: 10px;
        `}
      >
        {" "}
        <Link className="button is-success" to={"/"}>
          Go back
        </Link>
      </div>

      <FilmDetails film_id={props.match.params.film_id} />
      <FilmReviews film_id={props.match.params.film_id} />
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token
});
export default connect(
  mapStateToProps,
  null
)(SingleFilm);