import React, { useEffect, useCallback } from "react";
import { IGlobalState } from "../reducers/global";
import * as actions from "../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//Enabling Emotion
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { searchBoxChecker, alphanumericChecker } from "../tools/fieldChecker";

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

  saveLastFilms: (films: any[]) => void;
  saveQuery: (query: string) => void;
}

//https://api.themoviedb.org/3/search/movie?api_key=51c725de6ddb9024213b00473cda137b&query=mac
const FilmList: React.FC<IPropsGlobal> = props => {
  const apiKey = "api_key=51c725de6ddb9024213b00473cda137b";
  const apiUrl = "https://api.themoviedb.org/3/";

  const [pages, setPages] = React.useState(0);
  const [filmpage, setFilmPage] = React.useState(1);
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
      setFilmPage(1);
      props.saveQuery(`search/movie?query=${search.replace(" ", "+")}`);
    } else {
      setRoundSearchBox(true);
    }
  };

  //Get films by query
  const retrieveFilms = () => {
    fetch(`${apiUrl}${props.query}&${apiKey}&page=${filmpage}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        if (response.ok) {
          response
            .json()
            .then((films: any) => {
              if (films.total_results > 0) {
                setCalculateAvg(true);
                props.saveLastFilms(films.results);
                setPages(films.total_pages);
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
                setPages(1);
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
  React.useEffect(() => retrieveFilms(), [filmpage, props.query]);

  const prevPage = () => {
    if (filmpage > 1) setFilmPage(p => p - 1);
  };
  const nextPage = () => {
    if (filmpage < pages) setFilmPage(p => p + 1);
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

  // React.useEffect(getLastFilms, []);
  React.useEffect(() => {
    // if (calculateAvg) {
    //   const idsarray = props.storedFilms.map(f => f.id);
    //   getAvgReviews(idsarray);
    // }
  }, [props.storedFilms.length]);

  if (!props.storedFilms) return null;

  return (
    <div>
      <div
        css={css`
          margin-top: 105px !important;
        `}
      >
        <div
          className="box has-background-grey-darker has-text-light"
          css={css`
            position: fixed;
            width: 100%;
            z-index: 50;
            top: 52px;
            border-radius: 0 !important;
            padding: 5px 15px 5px 15px;
          `}
        >
          <div className="field has-addons">
            <div className="control">
              <input
                onChange={updateSearch}
                value={search}
                className={`input ${roundSearchBox ? "is-danger" : ""}`}
                type="text"
                placeholder="Try a search!"
              />
            </div>
            <div className="control">
              <a className="button" onClick={() => searchFilms(search)}>
                <i className="fas fa-search" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Films listed */}
      <div className="container has-background-grey">
        <div className="has-text-centered">
          <div
            className="box has-text-centered"
            css={css`
              background-color: rgb(30, 27, 37) !important;
              color: rgb(255, 222, 255) !important;
              border-radius:0px !important;
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
                          <span>
                            {f.average ? f.average.toFixed(1) : "Not rated yet"}{" "}
                          </span>
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
          {pages > 1 && (
            <div
              css={css`
                width: 100%;
              `}
            >
              <div
                className="box has-background-grey-darker has-text-light is-pulled-right"
                css={css`
                  margin-right: 91px !important;
                  margin-bottom:20px;
                `}
              >
                                {filmpage > 1 && (
                <a
                  onClick={prevPage}
                  css={css`
                    margin-right: 5px;
                  `}
                >
                  <i className="fas fa-chevron-left has-text-light" />

                </a>)}
                {filmpage > 1 && (
                  <a css={css`font-size:0.8em;`}onClick={() => setFilmPage(1)} className="has-text-light" >
                    1
                  </a>
                )}

                <span
                  css={css`
                    margin-left: 10px;
                    margin-right: 10px;
                    font-weight:bolder;
                  `}
                  className="has-text-link"
                >
                  {filmpage}
                </span>
                {filmpage !== pages && (
                  <a css={css`font-size:0.8em;`} className="has-text-light" onClick={() => setFilmPage(pages)}>{pages}</a>
                )}
                {filmpage !== pages && (
                <a
                  onClick={nextPage}
                  css={css`
                    margin-left: 5px;
                  `}
                >
                  <i className="fas fa-chevron-right has-text-light" />
                </a>)}
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
  query: globalState.saveQuery
});

const mapDispatchToProps = {
  saveLastFilms: actions.saveLastFilms,
  saveQuery: actions.saveQuery
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilmList);
