import React, { useEffect, useCallback } from "react";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { searchBoxChecker, alphanumericChecker } from "../tools/fieldChecker";
import { IPages } from "../interfaces";
import FilmLocal from './FilmLocal';

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
  storedFilms: any[];
  pageInfo: IPages;

  saveLastFilms: (films: any[]) => void;
  saveQuery: (query: string) => void;
  setPages: (pages: IPages) => void;
}

//https://api.themoviedb.org/3/search/movie?api_key=51c725de6ddb9024213b00473cda137b&query=mac
const FilmList: React.FC<IPropsGlobal> = props => {
  const apiKey = "api_key=51c725de6ddb9024213b00473cda137b";
  const apiUrl = "https://api.themoviedb.org/3/";

  const [filmresults, setFilmResults] = React.useState(0);
  const [calculateAvg, setCalculateAvg] = React.useState(false);
  const [header, setHeader] = React.useState("");

  const [search, setSearch] = React.useState("");
  const [roundSearchBox, setRoundSearchBox] = React.useState(false);
  const defaultQuery = `discover/movie?primary_release_date.gte=2019-06-04&primary_release_date.lte=${formatDate()}`;

  const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      !(event.currentTarget.value.charAt(0) === " ") &&
      event.currentTarget.value.length < 101 &&
      alphanumericChecker(event.currentTarget.value)
    ) {
      setSearch(event.currentTarget.value);
      setRoundSearchBox(false);
    }
  };

  //Film searcher
  const searchFilms = (search: string) => {
    if (searchBoxChecker(search)) {
      props.setPages({
        ...props.pageInfo,
        current: 1
      });
      props.saveQuery(`search/movie?query=${search.replace(" ", "+")}`);
    } else {
      setRoundSearchBox(true);
    }
  };

  //Get films by query
  const retrieveFilms = () => {
    fetch(`${apiUrl}${props.query}&${apiKey}&page=${props.pageInfo.current}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then((films: any) => {
              if (films.total_results > 0) {
                props.saveLastFilms(films.results);
                setCalculateAvg(true);
                props.setPages({
                  ...props.pageInfo,
                  total: films.total_pages
                });
                setFilmResults(films.total_results);

                if (props.query === defaultQuery)
                  setHeader("Popular Movies Now");
                else
                  setHeader(
                    `Showing ${films.total_results} results ${
                      search ? `for '${search}'` : ""
                    }`
                  );
              } else {
                props.saveLastFilms([]);
                props.setPages({
                  total:1,
                  current: 1
                });
                setFilmResults(0);
                setHeader("Sorry! No results :(");
              }
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  };

  React.useEffect(() => {
    setHeader("Loading...");
    if (!props.query) {
      props.saveQuery(defaultQuery);
    }
  }, []);

  React.useEffect(() => {
    if (props.query) {
      retrieveFilms();
    }
  }, [props.pageInfo.current, props.query]);

  const prevPage = () => {
    if (props.pageInfo.current > 1) {
      props.setPages({
        ...props.pageInfo,
        current: props.pageInfo.current - 1
      });
    }
  };
  const nextPage = () => {
    if (props.pageInfo.current < props.pageInfo.total) {
      props.setPages({
        ...props.pageInfo,
        current: props.pageInfo.current + 1
      });
    }
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
    })
      .then(response => {
        if (response.ok) {
          response.json().then((reviewdata: any) => {
            const films = props.storedFilms;
            reviewdata.map((row: any) => {
              const { film_id, nReviews, average } = row;
              const film = films.find(f => f.id === film_id);
              film.nReviews = nReviews;
              film.average = average;
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

  // React.useEffect(getLastFilms, []);
  React.useEffect(() => {
    if (calculateAvg) {
      const idsarray = props.storedFilms.map(f => f.id);
      getAvgReviews(idsarray);
      setCalculateAvg(false);
    }
  }, [calculateAvg]);

  if (!props.storedFilms) return null;

  return (
    <div>
      {/* Films listed */}
      <FilmLocal />
      <div className="container has-background-grey">
        <div className="has-text-centered">
          <div
            className="box has-text-centered"
            css={css`
              background-color: rgb(60, 60, 60) !important;
              color: rgb(255, 222, 255) !important;
              border-radius: 0px !important;
            `}
          >
            <h5>{header}</h5>
          </div>
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
                          <h1 className="specialtitle">
                            {f.original_title.length > 38
                              ? f.original_title.substring(0, 35) + "..."
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
                          <i className="fas fa-star" />
                          <span>
                            {" "}
                            {f.average ? f.average.toFixed(1) : "Not rated yet"}
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
          {props.pageInfo.total > 1 && (
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
                {props.pageInfo.current > 1 && (
                  <a
                    onClick={prevPage}
                    css={css`
                      margin-right: 5px;
                    `}
                  >
                    <i className="fas fa-chevron-left has-text-light" />
                  </a>
                )}
                {props.pageInfo.current > 1 && (
                  <a
                    css={css`
                      font-size: 0.8em;
                    `}
                    onClick={() =>
                      props.setPages({
                        ...props.pageInfo,
                        current: 1
                      })
                    }
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
                  {props.pageInfo.current}
                </span>
                {props.pageInfo.current !== props.pageInfo.total && (
                  <a
                    css={css`
                      font-size: 0.8em;
                    `}
                    className="has-text-light"
                    onClick={() =>
                      props.setPages({
                        ...props.pageInfo,
                        current: props.pageInfo.total
                      })
                    }
                  >
                    {props.pageInfo.total}
                  </a>
                )}
                {props.pageInfo.current !== props.pageInfo.total && (
                  <a
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
      </div>
    </div>
  );
};

const mapStateToProps = (globalState: IGlobalState) => ({
  storedFilms: globalState.storedFilms,
  token: globalState.token,
  query: globalState.saveQuery,
  pageInfo: globalState.storedPages
});

const mapDispatchToProps = {
  saveLastFilms: actions.saveLastFilms,
  saveQuery: actions.saveQuery,
  setPages: actions.savePages
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmList);
