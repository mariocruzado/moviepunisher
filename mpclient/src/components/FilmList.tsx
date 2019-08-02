import React, { useEffect, useCallback } from "react";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const formatDate = () => {
  const today = new Date();
  let day: any = today.getDate();
  let month: any = today.getMonth() + 1;
  const year = today.getFullYear();

  if (day < 10) day = "0" + day.toString();
  if (month < 10) month = "0" + month.toString();

  return `${year}-${month}-${day}`;
};

interface IPropsGlobal {
  token: string;
  storedFilms: any[];

  saveLastFilms: (films: any[]) => void;
}

//https://api.themoviedb.org/3/search/movie?api_key=51c725de6ddb9024213b00473cda137b&query=mac
const FilmList: React.FC<IPropsGlobal> = props => {
  const [pages, savePages] = React.useState(0);

  const getLastFilms = () => {
    const apiUrl = "https://api.themoviedb.org/3/";
    const apiKey = "api_key=51c725de6ddb9024213b00473cda137b";
    const apiByDate = `discover/movie?primary_release_date.gte=2019-06-04&primary_release_date.lte=${formatDate()}`;
    fetch(`${apiUrl}${apiByDate}&${apiKey}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        if (response.ok) {
          response.json().then((films: any) => {
            props.saveLastFilms(films.results);
            savePages(films.total_pages);
          });
        }
      })
      .catch(e => console.log("Angel " + e));
  };

  const getAvgReviews = (idsarray: any[]) => {
    fetch("http://localhost:8080/api/reviews/film/avg/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      },
      body: JSON.stringify(idsarray)
    })
      .then(response => {
        if (response.ok) {
          response.json().then((reviewdata: any) => {
            const films = props.storedFilms;
            reviewdata.map((row: any) => {
              const { film_id, nReviews, average } = row;
              const film = films.find(f => f.id === film_id);
              film.nReviews = nReviews;
              film.average = Number(average);
            });
            props.saveLastFilms([...films]);
          });
        } else {
          console.log("not ok");
        }
      })
      .catch(e => console.log("Angel " + e));
    return null;
  };

  const avgInt = (decimal: number) => {
    return Math.round(decimal);
  };

  React.useEffect(getLastFilms, []);
  React.useEffect(() => {
    const idsarray = props.storedFilms.map(f => f.id);
    getAvgReviews(idsarray);
  }, [props.storedFilms.length]);

  if (!props.storedFilms) return null;
  return (
    <div className="container">
      <div
        className="columns is-centered"
        css={css`
          margin-top: 40px !important;
        `}
      >
        <h1>Total Pages: {pages}</h1>
      </div>
      <div className="columns is-multiline is-mobile is-centered">
        {props.storedFilms.map(f => (
          <Link to={`/${f.id}`} key={f.id}>
            <div className="column is-three-quarters-mobile is-half-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd">
              <div className="cellphone-container">
                <div className="movie">
                  <div className="menu">
                    <i className="fas fa-film" />
                  </div>
                  <img
                    className="movie-img"
                    src={
                      f.poster_path
                        ? `https://image.tmdb.org/t/p/w400/${f.poster_path}`
                        : `http://roblucastaylor.com/wp-content/uploads/2017/07/cover-image-unavailable.jpg`
                    }
                  />

                  <div className="text-movie-cont">
                    <div className="mr-grid">
                      <div className="col1">
                        <h1>
                          {f.original_title.length > 40
                            ? f.original_title.substring(0, 37) + "..."
                            : f.original_title}
                        </h1>
                        <ul className="movie-gen">
                          <li>
                            Released: {f.release_date} / Country:{" "}
                            {f.original_language.toUpperCase()}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mr-grid">
                      <div className="col2 movie-likes">
                        <span>{f.average ? f.average : "Not rated yet"} </span>
                        {[...Array(parseInt(f.average ? f.average : 0))].map(
                          (_i, j) => (
                            <i className="fas fa-star" key={j} />
                          )
                        )}
                      </div>
                      <div className="col2">
                        <ul className="movie-likes">
                          <li>
                            <span>{f.nReviews ? f.nReviews : 0} </span>
                            <i className="fas fa-newspaper" />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mr-grid">
                      <div className="col1">
                        <p className="movie-description">
                          {f.overview.length > 200
                            ? f.overview.substring(0, 197) + "..."
                            : f.overview}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  storedFilms: globalState.storedFilms,
  token: globalState.token
});

const mapDispatchToProps = {
  saveLastFilms: actions.saveLastFilms
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmList);
