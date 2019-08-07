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
        background-color:rgb(88, 88, 88);
        border-radius:0px 10px 10px 10px;
      `}
      className="container"
    >
      <div
        css={css`
          margin-bottom: 10px;
        `}
      >
        
        {" "}
        <Link className="is-dark button" css={css`font-size:0.92em;padding:0px 50px;border-radius:0px 0px 10px 0px !important;`}to={"/"}>
          Back
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
