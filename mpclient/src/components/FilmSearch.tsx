import React from "react";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import unavailableimg from "../img/unavailable.gif";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { IFilm } from "../interfaces";

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
  query: string;

  saveQuery: (query: string) => void;
}

//https://api.themoviedb.org/3/search/movie?api_key=51c725de6ddb9024213b00473cda137b&query=mac
const FilmSearch: React.FC<IPropsGlobal> = props => {
  const apiKey = "api_key=51c725de6ddb9024213b00473cda137b";
  const apiUrl = "https://api.themoviedb.org/3/";

  const [calculateAvg, setCalculateAvg] = React.useState(false);
  const [header, setHeader] = React.useState("");
  const [films, saveFilms] = React.useState<IFilm[] | any>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentQuery, setCurrentQuery] = React.useState<any>("");

  const [noResults, setNoResults] = React.useState(false);
  const defaultQuery = `discover/movie?primary_release_date.gte=2019-06-04&primary_release_date.lte=${formatDate()}`;

  //Get films by query
  const retrieveFilms = () => {
    saveFilms([]);
    setHeader('');
    fetch(`${apiUrl}${props.query}&${apiKey}&page=${currentPage}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then((films: any) => {
              if (films.total_results > 0) {
                saveFilms(films.results);
                setTotalPages(films.total_pages);
                if (props.query !== currentQuery) {
                }
                setCalculateAvg(true);
                setCurrentQuery(props.query);
                if (props.query === defaultQuery)
                  setHeader("Popular Movies Now");
                else setHeader(`${films.total_results} results found`);
                setNoResults(false);
              } else {
                saveFilms([]);
                setCurrentPage(1);
                setTotalPages(1);
                setNoResults(true);
              }
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  };

  React.useEffect(() => {
    if (!props.query) {
      props.saveQuery(defaultQuery);
    }
  }, []);

  React.useEffect(() => {
    if (props.query) {
      retrieveFilms();
    }
  }, [currentPage, props.query]);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  //AVG Ratings by reviews
  const getAvgReviews = (idsarray: any[]) => {
    fetch("http://localhost:8080/api/reviews/film/avg/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + props.token
      },
      body: JSON.stringify(idsarray)
    }).then(response => {
      if (response.ok) {
        response.json().then((reviewdata: any) => {
          const filmsComplete = films;
          reviewdata.map((row: any) => {
            const { film_id, nReviews, average } = row;
            const film = filmsComplete.find((f: IFilm) => f.id === film_id);
            film.nReviews = nReviews;
            film.average = average;
          });
          saveFilms([...filmsComplete]);
        });
      }
    });
    return null;
  };

  // React.useEffect(getLastFilms, []);
  React.useEffect(() => {
    if (calculateAvg && films.length > 0) {
      const idsarray = films.map((f: IFilm) => f.id);
      getAvgReviews(idsarray);
      setCalculateAvg(false);
    }
  }, [calculateAvg]);

  return (
    <div id="top">
      {/* Films listed */}
      <div className="container has-background-grey">
        <div
          css={css`
            position: absolute;
            top: 10px;
            left: 15px;
            z-index:200 !important;
          `}
        >
          <Link to={"/"}>
            <i className="fas fa-times-circle is-big has-text-light" />
          </Link>
        </div>
        <div
          className="card has-text-centered"
          css={css`
            background-color: rgb(60, 60, 60) !important;
            color: rgb(255, 222, 255) !important;
            border-radius: 0px !important;
            padding:10px;
          `}
        >
          {!noResults && films.length <= 0 && (
            <button className="button is-dark is-loading is-medium"></button>
          )}
          {!noResults && <h5>{header}</h5>}
          {noResults && (
              <div css={css`display:flex !important;justify-content:center !important;`}>
                <figure className="image is-128x128">
                  <img
                    src={require("../img/notfound.svg")}
                    alt="Sorry!"
                  />
                </figure>
              </div>
          )}
        </div>
        {films.length > 0 && (
          <div className="columns is-multiline is-mobile is-centered">
            {films.map((f: IFilm) => (
              <Link to={`/film/${f.id}`} key={f.id}>
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
                            : unavailableimg
                        }
                      />

                      <div className="text-movie-cont">
                        <div className="mr-grid">
                          <div className="col1">
                            <h1 className="specialtitle">
                              {f.original_title.length > 38
                                ? f.original_title.substring(0, 35) + "..."
                                : f.original_title}
                            </h1>
                            <ul className="movie-gen">
                              <li>
                                Released:{" "}
                                {f.release_date ? f.release_date : "?"} /
                                Country: {f.original_language.toUpperCase()}
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mr-grid">
                          <div className="col2 movie-likes">
                            <i className="fas fa-star" />
                            <span>
                              {" "}
                              {f.average
                                ? f.average.toFixed(1)
                                : "Not rated yet"}
                            </span>
                            {/* {(() => {
                            const result: any = [];
                            for (let j = 0; j < parseInt(f.average); j++) {
                              result.push(
                                <i
                                  className="fas fa-star"
                                  key={f.original_title + "star" + j}
                                />
                              );
                            }
                            return result;
                          })()} */}
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
            {/* Paginate */}
            {totalPages > 1 && (
              <div
                css={css`
                  width: 100%;
                `}
              >
                <div
                  className="box has-background-grey-darker has-text-light is-pulled-right"
                  css={css`
                    margin-right: 91px !important;
                    margin-bottom: 20px;
                  `}
                >
                  {currentPage > 1 && (
                    <a
                      href="#top"
                      onClick={prevPage}
                      css={css`
                        margin-right: 5px;
                      `}
                    >
                      <i className="fas fa-chevron-left has-text-light" />
                    </a>
                  )}
                  {currentPage > 1 && (
                    <a
                      href="#top"
                      css={css`
                        font-size: 0.8em;
                      `}
                      onClick={() => setCurrentPage(1)}
                      className="has-text-light"
                    >
                      1
                    </a>
                  )}

                  <span
                    css={css`
                      margin-left: 10px;
                      margin-right: 10px;
                      font-weight: bolder;
                    `}
                    className="has-text-link"
                  >
                    {currentPage}
                  </span>
                  {currentPage !== totalPages && (
                    <a
                      href="#top"
                      css={css`
                        font-size: 0.8em;
                      `}
                      className="has-text-light"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </a>
                  )}
                  {currentPage !== totalPages && (
                    <a
                      href="#top"
                      onClick={nextPage}
                      css={css`
                        margin-left: 5px;
                      `}
                    >
                      <i className="fas fa-chevron-right has-text-light" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  token: globalState.token,
  query: globalState.saveQuery
});

const mapDispatchToProps = {
  saveQuery: actions.saveQuery
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmSearch);
