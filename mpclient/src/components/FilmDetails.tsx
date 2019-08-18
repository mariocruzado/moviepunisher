import React from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { connect } from "react-redux";
import { IFilm } from "../interfaces";
import { IGlobalState } from "../reducers/global";
import jwt from "jsonwebtoken";
import unavailableimg from "../img/unavailable.gif"

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
  // const [film, setFilm] = React.useState<IFilm | null>(null);
  const [ready, setReady] = React.useState(false);
  //   const filmIndex = React.useMemo(() => {
  //     console.log(props.films);
  //     return props.films.findIndex((f: IFilm) => f.id == props.film_id);
  //   }, [props.film_id, props.films]);

  //   React.useMemo(() => setFilm(props.films[filmIndex]), [
  //     props.films,
  //     filmIndex
  //   ]);

  const getFilmData = (filmid: number) => {
    const apiUrl = `http://api.themoviedb.org/3/movie/${filmid}?`;
    const apiKey = "api_key=51c725de6ddb9024213b00473cda137b";
    fetch(`${apiUrl}&${apiKey}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }).then(response => {
      if (response.ok) {
        response.json().then((film: IFilm) => {
          props.saveFilm(film);
          setReady(true);
        });
      }
    });
  };

  React.useEffect(() => getFilmData(props.film_id), [props.film_id]);

  const headerImg = "https://image.tmdb.org/t/p/original/";

  if (!ready) return null;
  return (
    <div>
      {/* {film.backdrop_path && (
        <div className="card-image">
          <figure className="image is-16by9">
            <img
              src={`${headerImg}${film.backdrop_path}`}
              alt={film.original_title}
            />
          </figure>
        </div>
      )} */}

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
                      ? `https://image.tmdb.org/t/p/w400/${
                          props.actualFilm.poster_path
                        }`
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
                  {props.actualFilm.genres.map((g: any) => (
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
        {/* Old card */}
        {/* <div className="media">
          <div className="media-content">
            <div className="columns">
              <div className="column is-4 is-mobile is-centered">
                <figure
                  className="image"
                  css={css`
                    max-width: 200px !important;
                  `}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200/${props.actualFilm.poster_path}`}
                    alt="Placeholder image"
                  />
                </figure>
              </div>
              <div
                className="column is-8 is-mobile"
                css={css`
                  border-radius: 5px;
                `}
              >
                <div>
                  <span className="title is-4 is-block">
                    {props.actualFilm.original_title} ({props.actualFilm.release_date.split("-")[0]})
                  </span>
                  <span className="subtitle is-size-6 is-block">
                    <i>{props.actualFilm.tagline}</i>
                  </span>
                </div>
                <div className="is-block">
                  {props.actualFilm.genres.map((g: any) => (
                    <span
                      css={css`
                        margin-right: 5px;
                        padding: 5px;
                        border-radius: 10px;
                        font-size: 0.7em !important;
                      `}
                      className="has-background-success has-text-white"
                      key={g.id}
                    >
                      {g.name}
                    </span>
                  ))}
                </div>

                <div className="columns">
                  <div className="column">
                    <p className="subtitle is-6">Release Date:</p>
                  </div>
                  <div className="column">
                    <p className="subtitle is-6">{props.actualFilm.release_date}</p>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <p className="subtitle is-6">Languages:</p>
                  </div>
                  <div className="column">
                    <p className="subtitle is-6">
                      {props.actualFilm.spoken_languages.map((sl: any, j: number) => (
                        <span key={`${sl.name}${j}`}>{sl.name} </span>
                      ))}
                    </p>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <p className="subtitle is-6">Country:</p>
                  </div>
                  <div className="column">
                    <p className="subtitle is-6">
                      {props.actualFilm.original_language.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="media-left">{props.actualFilm.overview}</div> */}
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
