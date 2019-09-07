import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { connect } from "react-redux";
import { IFilm } from "../interfaces";
import { IGlobalState } from "../reducers/global";
import jwt from "jsonwebtoken";
import unavailableimg from "../img/unavailable.gif";

import * as actions from "../actions";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

interface IPropsGlobal {
  token: string;
  films: IFilm[];
  actualFilm: IFilm;

  saveFilm: (film: IFilm) => void;
}
const FilmDetails: React.FC<IPropsGlobal & any> = props => {

  const [ready, setReady] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  //Retreiving film data from THEMOVIEDB API
  const getFilmData = (filmid: number) => {
    const apiUrl = `http://api.themoviedb.org/3/movie/${filmid}?`;
    const apiKey = "api_key=51c725de6ddb9024213b00473cda137b";
    fetch(`${apiUrl}&${apiKey}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        if (response.ok) {
          response.json().then((film: IFilm) => {
            props.saveFilm(film);
            setReady(true);
            setMsg("");
          });
        } else {
          setMsg("Cannot retrieve film info/Film doesn't exist");
          setReady(false);
        }
      })
      .catch(err => {
        setMsg("Error connecting to server");
        setReady(false);
      });
  };

  React.useEffect(() => getFilmData(props.film_id), [props.film_id]);

  const headerImg = "https://image.tmdb.org/t/p/original/";

  if (!ready) {
    if (msg.length > 1 || props.film_id.length > 12) {
      return (
        <div>
          <div
            css={css`
              display: flex !important;
              justify-content: center !important;
              filter:grayscale(100%);
            `}
          >
              <img src={require("../img/404.jpg")} alt="Sorry!" css={css`margin-bottom: 30px !important;`}/>
          </div>
        </div>
      );
    } else {
      return (
        <div className="card-content has-text-centered">
          <a className="button is-dark is-large is-loading">Loading</a>
        </div>
      );
    }
  } else return (
    <div>
      <div className="card-content">
        {/* new card */}
        <a href={props.actualFilm.homepage} target="_blank">
          <div className="movie_card" id="ave">
            <div className="info_section">
              <div className="movie_header">
                <img
                  className="locandina"
                  src={
                    props.actualFilm.poster_path
                      ? `https://image.tmdb.org/t/p/w400/${props.actualFilm.poster_path}`
                      : unavailableimg
                  }
                />
                <h1>
                  {props.actualFilm.original_title} (
                  {props.actualFilm.release_date
                    ? props.actualFilm.release_date.split("-")[0]
                    : "?"}
                  )
                </h1>
                <h4 className="is-size-7">{props.actualFilm.tagline}</h4>
                <div
                  css={css`
                    margin: 10px 0px 10px 0px;
                  `}
                >
                  {props.actualFilm.genres.slice(0,4).map((g: any) => (
                    <span
                      css={css`
                        margin: 0px 0px 0px 3px;
                        padding: 5px;
                        border-radius: 10px;
                        font-size: 0.7em !important;
                      `}
                      className="has-background-dark has-text-white"
                      key={g.id}
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
                <span
                  className="minutes"
                  css={css`
                    font-size: 0.9em !important;
                  `}
                >
                  {props.actualFilm.runtime
                    ? props.actualFilm.runtime + " min"
                    : "Unknown length"}
                </span>
              </div>
              <div className="movie_desc">
                <p
                  className="text"
                  css={css`
                    font-size: 0.9em;
                  `}
                >
                  {props.actualFilm.overview}
                </p>
              </div>
            </div>
            {props.actualFilm.backdrop_path && (
              <div
                className="blur_back ave_back"
                css={css`
                  background-image: url(${headerImg}${props.actualFilm.backdrop_path});
                `}
              />
            )}
          </div>
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token,
  films: globalState.storedFilms,
  actualFilm: globalState.actualFilm
});
const mapDispatchToProps = {
  saveFilm: actions.saveFilm
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmDetails);
