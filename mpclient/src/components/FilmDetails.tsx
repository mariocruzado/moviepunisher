import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "react-redux";
import { IFilm } from "../interfaces";
import { IGlobalState } from "../reducers/global";
import jwt from "jsonwebtoken";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

interface IPropsGlobal {
  token: string;
  films: IFilm[];
}
const FilmDetails: React.FC<any> = props => {
  const [film, setFilm] = React.useState<any | null>(null);

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
    })
      .then(response => {
        if (response.ok) {
          response.json().then((film: any) => {
            setFilm(film);
            console.log(film);
          });
        }
      })
      .catch(e => console.log("Angel " + e));
  };

  React.useEffect(() => getFilmData(props.film_id), [props.film_id]);

  const headerImg = "https://image.tmdb.org/t/p/original/";
  if (!film) return null;
  return (
    <div
      className="card"
      css={css`
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 0.8) !important;
      `}
    >
      {film.backdrop_path && (
        <div className="card-image">
          <figure className="image is-16by9">
            <img
              src={`${headerImg}${film.backdrop_path}`}
              alt={film.original_title}
            />
          </figure>
        </div>
      )}

      <div className="card-content">
        <div className="media">
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
                    src={`https://image.tmdb.org/t/p/w200/${film.poster_path}`}
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
                  {film.original_title} ({film.release_date.split("-")[0]})
                  </span>
                  <span className="subtitle is-size-6 is-block">
                    <i>{film.tagline}</i>
                  </span>
                  </div>
                  <div className="is-block">
                  {film.genres.map((g: any) => (
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
                    <p className="subtitle is-6">{film.release_date}</p>
                  </div>
                </div>
                <div className="columns">
                  <div className="column">
                    <p className="subtitle is-6">Languages:</p>
                  </div>
                  <div className="column">
                    <p className="subtitle is-6">
                      {film.spoken_languages.map((sl: any, j: number) => (
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
                      {film.original_language.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="media-left">{film.overview}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token,
  films: globalState.storedFilms
});
export default connect(
  mapStateToProps,
  null
)(FilmDetails);
